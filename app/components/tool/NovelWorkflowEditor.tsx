
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NovelData, NovelStage, Stage1Data, Stage2Data, Stage3Data, STAGES_ORDER } from '../../types';
import Stage1Foundation from '../Stage1Foundation';
import Stage2Plotting from '../Stage2Plotting';
import Stage3Writing from '../Stage3Writing';
import Stage4Revision from '../Stage4Revision';
import StageFinalizeExport from '../StageFinalizeExport'; 
import { STAGE_INSTRUCTIONS } from '../../constants';
import StageTabs from './StageTabs';

interface NovelWorkflowEditorProps {
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
}

const NovelWorkflowEditor: React.FC<NovelWorkflowEditorProps> = ({
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
}) => {
  const { t } = useTranslation();

  const renderStageContent = () => {
    switch (currentStage) {
      case NovelStage.FOUNDATION:
        return <Stage1Foundation data={novelData.stage1} onChange={onUpdateStage1Data} />;
      case NovelStage.OUTLINE:
        return <Stage2Plotting data={novelData.stage2} onChange={onUpdateStage2Data} />;
      case NovelStage.WRITING:
        return (
          <Stage3Writing
            novelData={novelData}
            stage3Data={novelData.stage3}
            onChange={onUpdateStage3Data}
            onChapterUpdate={onChapterUpdate}
            onChapterGenerateStart={onChapterGenerateStart}
            onChapterGenerateEnd={onChapterGenerateEnd}
          />
        );
      case NovelStage.REVISION:
        return <Stage4Revision novelData={novelData} />;
      case NovelStage.FINALIZE_EXPORT:
        return (
          <StageFinalizeExport
            novelTitle={novelData.title}
            onSetNovelTitle={(title) => onSetNovelData(prev => ({ ...prev, title }))}
            onDownloadNovel={onDownloadNovel}
          />
        );
      default:
        return <p className="text-slate-400">Select a stage to begin.</p>;
    }
  };

  const currentStageInfo = STAGE_INSTRUCTIONS[currentStage];
  
  return (
    <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-700 mb-16">
      <div className="bg-slate-800 p-3 sticky top-0 z-10 rounded-t-xl border-b border-slate-700">
        <div className="hidden md:block">
          <StageTabs
            currentStage={currentStage}
            onStageSelect={onSetCurrentStage}
          />
        </div>
        <div className="md:hidden">
          <label htmlFor="stage-select-mobile" className="sr-only">Select Stage</label>
          <select
            id="stage-select-mobile"
            value={currentStage}
            onChange={(e) => onSetCurrentStage(e.target.value as NovelStage)}
            className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 shadow-sm"
            aria-label="Select novel writing stage"
          >
            {STAGES_ORDER.map((stageId) => {
              const stageInfo = STAGE_INSTRUCTIONS[stageId];
              return (
                <option key={stageId} value={stageId}>
                  {t(stageInfo.titleKey)}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      
      <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 bg-slate-900 rounded-b-xl">
        <div className="mb-8 p-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-300 mb-2 tracking-tight">{t(currentStageInfo.titleKey)}</h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">{t(currentStageInfo.descriptionKey)}</p>
        </div>
        {renderStageContent()}
      </div>
    </div>
  );
};

export default NovelWorkflowEditor;
