
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
  onNavigateToMonetization: () => void; // This prop is crucial
  getInitialNovelData: (t: (key: string) => string) => NovelData; 
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

    const scrollableContainer = document.querySelector('main.flex-1.overflow-y-auto');
    if (!scrollableContainer) return;

    if (toolId === 'novel-editor') {
        requestAnimationFrame(() => {
            const element = document.getElementById(displayId);
            if (element) {
                const headerOffset = 20; // Offset for sticky elements or desired padding
                const elementRect = element.getBoundingClientRect();
                const containerRect = scrollableContainer.getBoundingClientRect();
                const scrollTopTarget = elementRect.top - containerRect.top + scrollableContainer.scrollTop - headerOffset;
                
                scrollableContainer.scrollTo({
                    top: scrollTopTarget,
                    behavior: 'smooth'
                });
            }
        });
    } else { 
        scrollableContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);
  
  const handleDevelopConcept = useCallback((concept: TrendSparkConcept) => {
    const initialNovelStructure = props.getInitialNovelData(t);
    props.onSetNovelData(prevData => ({
      ...initialNovelStructure, 
      title: concept.title,
      stage1: {
        ...initialNovelStructure.stage1, 
        coreIdea: concept.blurb,
        genre: concept.genreSuggestion,
        targetAudience: concept.targetAudiencePlatform,
      },
    }));
    props.onSetCurrentStage(NovelStage.FOUNDATION);
    const novelEditorWorkflowId = NOVEL_EDITOR_SUB_SECTIONS.find(s => s.id === 'novel-workflow-editor-section')?.id || 'novel-workflow-editor-section';
    handleSelectNavigation('novel-editor', novelEditorWorkflowId);
  }, [props.onSetNovelData, props.onSetCurrentStage, handleSelectNavigation, props.getInitialNovelData, t]);


  const renderActiveSection = () => {
    switch (activeToolId) {
      case 'novel-editor':
        return <NovelToolLandingPage
                  novelData={props.novelData}
                  currentStage={props.currentStage}
                  onSetNovelData={props.onSetNovelData}
                  onSetCurrentStage={props.onSetCurrentStage}
                  onUpdateStage1Data={props.onUpdateStage1Data}
                  onUpdateStage2Data={props.onUpdateStage2Data}
                  onUpdateStage3Data={props.onUpdateStage3Data}
                  onChapterUpdate={props.onChapterUpdate}
                  onChapterGenerateStart={props.onChapterGenerateStart}
                  onChapterGenerateEnd={props.onChapterGenerateEnd}
                  onDownloadNovel={props.onDownloadNovel}
                  onNavigateToPrivacy={props.onNavigateToPrivacy}
                  onNavigateToTerms={props.onNavigateToTerms}
                  onNavigateToAbout={props.onNavigateToAbout}
                  onNavigateToContact={props.onNavigateToContact}
                  onNavigateToMonetization={props.onNavigateToMonetization}
                  onSelectNavigation={handleSelectNavigation}
                />;
      case 'trend-spark':
        return <TrendSparkTool 
                  userApiKey={props.userApiKey} 
                  onDevelopConcept={handleDevelopConcept}
                  onSelectNavigation={handleSelectNavigation} // Added for consistency, might not be used yet
                  onNavigateToPrivacy={props.onNavigateToPrivacy}
                  onNavigateToTerms={props.onNavigateToTerms}
                  onNavigateToAbout={props.onNavigateToAbout}
                  onNavigateToContact={props.onNavigateToContact}
                  onNavigateToMonetization={props.onNavigateToMonetization} // Added
                />;
      default:
        console.warn(`[ToolPage.tsx] Unknown activeToolId: ${activeToolId}. Defaulting to NovelToolLandingPage.`);
        return <NovelToolLandingPage
                  novelData={props.novelData}
                  currentStage={props.currentStage}
                  onSetNovelData={props.onSetNovelData}
                  onSetCurrentStage={props.onSetCurrentStage}
                  onUpdateStage1Data={props.onUpdateStage1Data}
                  onUpdateStage2Data={props.onUpdateStage2Data}
                  onUpdateStage3Data={props.onUpdateStage3Data}
                  onChapterUpdate={props.onChapterUpdate}
                  onChapterGenerateStart={props.onChapterGenerateStart}
                  onChapterGenerateEnd={props.onChapterGenerateEnd}
                  onDownloadNovel={props.onDownloadNovel}
                  onNavigateToPrivacy={props.onNavigateToPrivacy}
                  onNavigateToTerms={props.onNavigateToTerms}
                  onNavigateToAbout={props.onNavigateToAbout}
                  onNavigateToContact={props.onNavigateToContact}
                  onNavigateToMonetization={props.onNavigateToMonetization}
                  onSelectNavigation={handleSelectNavigation}
                />;
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
      <main className="flex-1 overflow-y-auto bg-background" id="tool-main-content">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default ToolPage;
