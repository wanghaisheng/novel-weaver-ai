

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NovelData, NovelStage, Stage1Data, Stage2Data, Stage3Data, Chapter, User, TrendSparkConcept } from '../types';
import type { ToolSectionId } from '../types';
import { ToolSidebar } from '../components/tool/ToolSidebar';
import NovelToolLandingPage from '../components/tool/NovelToolLandingPage'; 
import TrendSparkTool from '../components/tool/TrendSparkTool';
import { TOOL_PAGE_SECTIONS, NOVEL_EDITOR_SUB_SECTIONS } from '../constants';
import { getInitialNovelData as getInitialNovelDataFromApp } from '../App';


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
  getInitialNovelData: (t: (key: string) => string) => NovelData; // Add this prop
}

const ToolPage: React.FC<ToolPageProps> = (props) => {
  const { t } = useTranslation();
  const defaultToolId = TOOL_PAGE_SECTIONS[0]?.id || 'novel-editor';
  const [activeToolId, setActiveToolId] = useState<ToolSectionId>(defaultToolId);
  const [activeDisplayId, setActiveDisplayId] = useState<string>(
    defaultToolId === 'novel-editor' ? NOVEL_EDITOR_SUB_SECTIONS[0]?.id || 'novel-workflow-editor-section' : defaultToolId
  );


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
    setActiveToolId(toolId);
    setActiveDisplayId(displayId); 

    if (toolId === 'novel-editor') {
        requestAnimationFrame(() => {
            const element = document.getElementById(displayId);
            if (element) {
                const headerOffset = 80; // Approximate height of sticky header/tabs if any
                const scrollableContainer = document.querySelector('main.flex-1.overflow-y-auto');
                
                if (scrollableContainer) {
                    const elementRect = element.getBoundingClientRect();
                    const containerRect = scrollableContainer.getBoundingClientRect();
                    // Calculate scroll position relative to the container's current scroll top
                    const scrollTopTarget = elementRect.top - containerRect.top + scrollableContainer.scrollTop - headerOffset;
                    
                    scrollableContainer.scrollTo({
                        top: scrollTopTarget,
                        behavior: 'smooth'
                    });
                } else {
                     // Fallback to window scroll if specific container not found
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth'});
                }
            }
        });
    } else { // For TrendSpark or other single-page tools
        const scrollableContainer = document.querySelector('main.flex-1.overflow-y-auto');
        if (scrollableContainer) {
            scrollableContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
  }, []);
  
  const handleDevelopConcept = useCallback((concept: TrendSparkConcept) => {
    const initialNovelStructure = props.getInitialNovelData(t);
    props.onSetNovelData(prevData => ({
      ...prevData, // Keep existing top-level data like user preferences if any
      title: concept.title,
      stage1: {
        ...initialNovelStructure.stage1, // Start with a clean Stage 1 structure
        coreIdea: concept.blurb,
        genre: concept.genreSuggestion,
        targetAudience: concept.targetAudiencePlatform,
        // Ensure other Stage 1 fields are explicitly reset or from initial structure
        theme: '', // Reset
        logline: '', // Reset
        characters: [], // Reset
        worldBuilding: { timeAndPlace: '', coreRules: '', socialStructure: '', keyLocations: '' }, // Reset
      },
      stage2: initialNovelStructure.stage2, // Reset Stage 2
      stage3: initialNovelStructure.stage3, // Reset Stage 3
    }));
    props.onSetCurrentStage(NovelStage.FOUNDATION);
    const novelEditorWorkflowId = NOVEL_EDITOR_SUB_SECTIONS.find(s => s.titleKey === 'toolPage.subSections.novelWorkflowEditor.title')?.id || 'novel-workflow-editor-section';
    handleSelectNavigation('novel-editor', novelEditorWorkflowId);
  }, [props.onSetNovelData, props.onSetCurrentStage, handleSelectNavigation, props.getInitialNovelData, t]);


  const renderActiveSection = () => {
    const commonLandingPageProps = {
      ...props,
      onSelectNavigation: handleSelectNavigation, 
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
    <div className="flex h-screen bg-background overflow-hidden">
      <ToolSidebar
        activeToolId={activeToolId}
        activeDisplayId={activeDisplayId}
        userApiKey={props.userApiKey}
        onSetUserApiKey={props.onSetUserApiKey}
        onSelectNavigation={handleSelectNavigation}
        onNavigateHome={props.onNavigateHome}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        currentUser={props.currentUser}
        onSignOut={props.onSignOut}
      />
      <main className="flex-1 overflow-y-auto bg-background"> {/* Updated bg-background */}
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default ToolPage;