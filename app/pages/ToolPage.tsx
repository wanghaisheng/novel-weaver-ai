import React, { useState, useEffect, useCallback } from 'react';
import { NovelData, NovelStage, Stage1Data, Stage2Data, Stage3Data, Chapter, User, TrendSparkConcept } from '../types';
import type { ToolSectionId } from '../types';
import { ToolSidebar } from '../components/tool/ToolSidebar';
import NovelToolLandingPage from '../components/tool/NovelToolLandingPage'; 
import TrendSparkTool from '../components/tool/TrendSparkTool'; // Import TrendSparkTool
import { TOOL_PAGE_SECTIONS, NOVEL_EDITOR_SUB_SECTIONS } from '../constants';

interface ToolPageProps {
  novelData: NovelData;
  currentStage: NovelStage;
  userApiKey: string | null; 
  onSetUserApiKey: (key: string | null) => void; 
  onSetNovelData: (data: NovelData | ((prevData: NovelData) => NovelData)) => void;
  onSetCurrentStage: (stage: NovelStage) => void;
  onUpdateStage1Data: (data: Stage1Data) => void;
  onUpdateStage2Data: (data: Stage2Data) => void;
  onUpdateStage3Data: (data: Stage3Data) => void;
  onChapterUpdate: (chapterId: string, updatedContent: string) => void;
  onChapterGenerateStart: (chapterId: string) => void;
  onChapterGenerateEnd: (chapterId: string, content: string) => void;
  onDownloadNovel: () => void;
  onNavigateHome: () => void;
  currentUser: (User & { token: string }) | null; 
  onSignOut: () => void; 
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
}

const ToolPage: React.FC<ToolPageProps> = (props) => {
  const defaultToolId = TOOL_PAGE_SECTIONS[0]?.id || 'novel-editor';
  const [activeToolId, setActiveToolId] = useState<ToolSectionId>(defaultToolId);
  const [activeDisplayId, setActiveDisplayId] = useState<string>(defaultToolId); // For novel editor, this can be sub-section ID

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    console.log('[ToolPage.tsx] Mounted. CurrentUser:', !!props.currentUser);
  }, [props.currentUser]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const handleSelectNavigation = useCallback((toolId: ToolSectionId, displayId: string) => {
    console.log(`[ToolPage.tsx] handleSelectNavigation called. toolId: ${toolId}, displayId: ${displayId}`);
    setActiveToolId(toolId);
    setActiveDisplayId(displayId); // For TrendSpark, displayId will be 'trend-spark' itself.

    if (toolId === 'novel-editor') {
        requestAnimationFrame(() => {
            const element = document.getElementById(displayId);
            if (element) {
                console.log(`[ToolPage.tsx] Scrolling to element: ${displayId}`);
                const headerOffset = 0; 
                const elementPosition = element.getBoundingClientRect().top;
                const scrollableContainer = document.querySelector('main.flex-1.overflow-y-auto');

                if (scrollableContainer) {
                    const containerTop = scrollableContainer.getBoundingClientRect().top;
                    const scrollTop = (elementPosition + scrollableContainer.scrollTop) - containerTop - headerOffset;
                    console.log(`[ToolPage.tsx] Scrolling container. Element top: ${elementPosition}, Container top: ${containerTop}, ScrollTop target: ${scrollTop}`);
                    scrollableContainer.scrollTo({
                        top: scrollTop,
                        behavior: 'smooth'
                    });
                } else {
                    console.log('[ToolPage.tsx] Scrollable container not found, scrolling window.');
                    window.scrollTo({ top: elementPosition + window.pageYOffset - headerOffset, behavior: 'smooth'});
                }
            } else {
                console.warn(`[ToolPage.tsx] Element with ID ${displayId} not found for scrolling.`);
            }
        });
    } else if (toolId === 'trend-spark') {
        // For TrendSpark or other tools that are single pages, scroll to top of the main content area
        const scrollableContainer = document.querySelector('main.flex-1.overflow-y-auto');
        if (scrollableContainer) {
            scrollableContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
  }, []);
  
  const handleDevelopConcept = useCallback((concept: TrendSparkConcept) => {
    props.onSetNovelData(prevData => ({
      ...prevData,
      title: concept.title,
      stage1: {
        ...prevData.stage1,
        coreIdea: concept.blurb,
        genre: concept.genreSuggestion,
        targetAudience: concept.targetAudiencePlatform,
        // Reset other stage 1 fields or fill with defaults
        theme: '',
        logline: '',
        characters: [],
        worldBuilding: { timeAndPlace: '', coreRules: '', socialStructure: '', keyLocations: '' },
      },
      // Optionally reset stage 2 and 3 data or keep them if user wants to merge
      stage2: getInitialNovelData(s => s).stage2, // Reset to initial empty structure
      stage3: getInitialNovelData(s => s).stage3, // Reset to initial empty structure
    }));
    props.onSetCurrentStage(NovelStage.FOUNDATION);
    // Switch to Novel Editor view, specifically the workflow editor section
    const novelEditorWorkflowId = NOVEL_EDITOR_SUB_SECTIONS.find(s => s.titleKey === 'toolPage.subSections.novelWorkflowEditor.title')?.id || 'novel-workflow-editor-section';
    handleSelectNavigation('novel-editor', novelEditorWorkflowId);
  }, [props.onSetNovelData, props.onSetCurrentStage, handleSelectNavigation]);

  // Helper function to get initial novel data structures (simplified from App.tsx)
  const getInitialNovelData = (t: (key: string) => string) => ({
    stage2: {
      act1: { stasis: '', incitingIncident: '', debate: '', turningPoint1: '' },
      act2: { testsAlliesEnemies: '', midpoint: '', risingAction: '', allIsLost: '', turningPoint2: '' },
      act3: { runUpToClimax: '', climax: '', fallingAction: '', resolution: '' },
    },
    stage3: {
      chapters: [] as Chapter[],
      currentChapterPrompt: { 
          povCharacter: '', coreGoal: '', keyPlotPoints: '', 
          startingScene: '', endingScene: '', atmosphere: '', wordCount: undefined 
      }
    },
  });


  const renderActiveSection = () => {
    const commonLandingPageProps = {
      ...props,
      onSelectNavigation: handleSelectNavigation, // Pass down for footer links
    };
    switch (activeToolId) {
      case 'novel-editor':
        return <NovelToolLandingPage {...commonLandingPageProps} />;
      case 'trend-spark':
        return <TrendSparkTool 
                  userApiKey={props.userApiKey} 
                  onDevelopConcept={handleDevelopConcept}
                  onSelectNavigation={handleSelectNavigation}
                  onNavigateToPrivacy={props.onNavigateToPrivacy}
                  onNavigateToTerms={props.onNavigateToTerms}
                  onNavigateToAbout={props.onNavigateToAbout}
                  onNavigateToContact={props.onNavigateToContact}
                />;
      default:
        console.warn(`[ToolPage.tsx] Unknown activeToolId: ${activeToolId}. Defaulting to NovelToolLandingPage.`);
        return <NovelToolLandingPage {...commonLandingPageProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <ToolSidebar
        activeToolId={activeToolId}
        activeDisplayId={activeDisplayId} // This will be relevant for 'novel-editor' sub-sections
        userApiKey={props.userApiKey}
        onSetUserApiKey={props.onSetUserApiKey}
        onSelectNavigation={handleSelectNavigation}
        onNavigateHome={props.onNavigateHome}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        currentUser={props.currentUser}
        onSignOut={props.onSignOut}
      />
      <main className="flex-1 overflow-y-auto bg-slate-900">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default ToolPage;