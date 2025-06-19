import React from 'react';
import { useTranslation } from 'react-i18next';
import { NovelData, NovelStage, Stage1Data, Stage2Data, Stage3Data, Chapter, User, ToolSectionId } from '../../types';
import NovelWorkflowEditor from './NovelWorkflowEditor';
import FeaturesSection from './sections/FeaturesSection';
import HowItWorksToolSection from './sections/HowItWorksToolSection';
import ShowcaseToolSection from './sections/ShowcaseToolSection';
import FAQToolSection from './sections/FAQToolSection';
import LanguagePicker from '../common/LanguagePicker';
import { NOVEL_EDITOR_SUB_SECTIONS, TOOL_PAGE_SECTIONS } from '../../constants';


// Props for NovelToolLandingPage should match what's passed from ToolPage
// which are essentially ToolPageProps + commonPageProps for footer.
interface NovelToolLandingPageProps {
  novelData: NovelData;
  currentStage: NovelStage;
  onSetNovelData: (data: NovelData | ((prevData: NovelData) => NovelData)) => void;
  onSetCurrentStage: (stage: NovelStage) => void;
  onUpdateStage1Data: (data: Stage1Data) => void;
  onUpdateStage2Data: (data: Stage2Data) => void;
  onUpdateStage3Data: (data: Stage3Data) => void;
  onChapterUpdate: (chapterId: string, updatedContent: string) => void;
  onChapterGenerateStart: (chapterId: string) => void;
  onChapterGenerateEnd: (chapterId: string, content: string) => void;
  onDownloadNovel: () => void;
  // Common page props for footer
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
  onSelectNavigation: (toolId: ToolSectionId, displayId: string) => void; // Added for tool navigation
}


const NovelToolLandingPage: React.FC<NovelToolLandingPageProps> = ({
  novelData,
  currentStage,
  onSetNovelData,
  onSetCurrentStage,
  onUpdateStage1Data,
  onUpdateStage2Data,
  onUpdateStage3Data,
  onChapterUpdate,
  onChapterGenerateStart,
  onChapterGenerateEnd,
  onDownloadNovel,
  onNavigateToPrivacy,
  onNavigateToTerms,
  onNavigateToAbout,
  onNavigateToContact,
  onSelectNavigation
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-12 md:space-y-16 bg-background text-foreground">
      <div id={NOVEL_EDITOR_SUB_SECTIONS.find(s => s.titleKey === 'toolPage.subSections.novelWorkflowEditor.title')?.id || 'novel-workflow-editor-section'} className="scroll-mt-4">
        <NovelWorkflowEditor
          novelData={novelData}
          currentStage={currentStage}
          onSetNovelData={onSetNovelData}
          onSetCurrentStage={onSetCurrentStage}
          onUpdateStage1Data={onUpdateStage1Data}
          onUpdateStage2Data={onUpdateStage2Data}
          onUpdateStage3Data={onUpdateStage3Data}
          onChapterUpdate={onChapterUpdate}
          onChapterGenerateStart={onChapterGenerateStart}
          onChapterGenerateEnd={onChapterGenerateEnd}
          onDownloadNovel={onDownloadNovel}
        />
      </div>

      <div id={NOVEL_EDITOR_SUB_SECTIONS.find(s => s.titleKey === 'toolPage.subSections.features.title')?.id || 'novel-tool-features-section'} className="scroll-mt-4">
        <FeaturesSection />
      </div>
      
      <div id={NOVEL_EDITOR_SUB_SECTIONS.find(s => s.titleKey === 'toolPage.subSections.howItWorks.title')?.id || 'novel-tool-howitworks-section'} className="scroll-mt-4">
        <HowItWorksToolSection />
      </div>

      <div id={NOVEL_EDITOR_SUB_SECTIONS.find(s => s.titleKey === 'toolPage.subSections.showcase.title')?.id || 'novel-tool-showcase-section'} className="scroll-mt-4">
        <ShowcaseToolSection />
      </div>

      <div id={NOVEL_EDITOR_SUB_SECTIONS.find(s => s.titleKey === 'toolPage.subSections.faq.title')?.id || 'novel-tool-faq-section'} className="scroll-mt-4">
        <FAQToolSection />
      </div>

      <footer className="w-full text-center py-10 mt-12 border-t border-border bg-background -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 rounded-b-xl">
        <p className="text-sm text-muted-foreground">{t('footer.copyrightToolPage', { year: new Date().getFullYear(), appTitle: t('appTitle') })}</p>
        
        <div className="mt-4 mb-3 border-t border-border/50 pt-3">
          <span className="text-xs text-muted-foreground mr-2">{t('footer.toolNavigation')}:</span>
          {TOOL_PAGE_SECTIONS.map(tool => (
            <button
              key={tool.id}
              onClick={() => onSelectNavigation(tool.id, tool.id)}
              className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors duration-200 ease-in-out px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring rounded"
              aria-label={t(tool.titleKey)}
            >
              {t(tool.titleKey)}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <button onClick={onNavigateToPrivacy} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('footer.privacyPolicy')}</button>
            <button onClick={onNavigateToTerms} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('footer.termsOfService')}</button>
            <button onClick={onNavigateToAbout} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('footer.aboutUs')}</button>
            <button onClick={onNavigateToContact} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('footer.contactUs')}</button>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <LanguagePicker />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default NovelToolLandingPage;