import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NovelData, RevisionTaskType, RevisionState } from '../types';
import { TextAreaInput } from './common/TextAreaInput';
import { LoadingSpinner } from './common/LoadingSpinner';
import { reviseTextWithAI } from '../services/geminiService';
import { META_PROMPT_SECTIONS, REVISION_TASK_OPTIONS } from '../constants';

interface Stage4RevisionProps {
  novelData: NovelData;
}

const Stage4Revision: React.FC<Stage4RevisionProps> = ({ novelData }) => {
  const { t } = useTranslation();
  const [revisionState, setRevisionState] = useState<RevisionState>({
    taskType: '',
    inputText: '',
    outputText: '',
    isLoading: false,
  });
  const sections = META_PROMPT_SECTIONS.stage4; 

  const handleInputChange = (field: keyof RevisionState, value: string | RevisionTaskType) => {
    setRevisionState(prev => ({ ...prev, [field]: value, outputText: field === 'taskType' || field === 'inputText' ? '' : prev.outputText }));
  };

  const handleSubmitRevision = useCallback(async () => {
    if (!revisionState.taskType || !revisionState.inputText) {
      alert(t('stage4revision.alerts.selectTaskAndText'));
      return;
    }
    setRevisionState(prev => ({ ...prev, isLoading: true, outputText: '' }));
    try {
      const result = await reviseTextWithAI(novelData, revisionState.taskType, revisionState.inputText);
      setRevisionState(prev => ({ ...prev, outputText: result, isLoading: false }));
    } catch (error) {
      console.error("Revision AI call failed:", error);
      const errorMessage = error instanceof Error ? error.message : t('stage4revision.errors.failedToGetRevision');
      setRevisionState(prev => ({ ...prev, outputText: `${t('stage4revision.errors.errorPrefix')}: ${errorMessage}`, isLoading: false }));
    }
  }, [novelData, revisionState.taskType, revisionState.inputText, t]);

  const getTaskInstruction = () => {
    if (!revisionState.taskType) return "";
    switch (revisionState.taskType) {
        case RevisionTaskType.CONSISTENCY: return sections.taskConsistency;
        case RevisionTaskType.DESCRIPTION: return sections.taskDescription;
        case RevisionTaskType.DIALOGUE: return sections.taskDialogue;
        case RevisionTaskType.PACING: return sections.taskPacing;
        default: return "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-6 bg-card border border-border rounded-xl shadow-xl">
        <p className="text-md text-foreground leading-relaxed">{t('stage4revision.introUIText', {defaultValue: sections.intro})}</p>
      </div>
      
      <div className="p-6 bg-card rounded-xl shadow-xl border border-border">
        <label htmlFor="revisionTaskType" className="block text-sm font-medium text-foreground mb-1.5">
          {t('stage4revision.labels.selectTask', {defaultValue: sections.selectTask})}
        </label>
        <select
          id="revisionTaskType"
          value={revisionState.taskType}
          onChange={(e) => handleInputChange('taskType', e.target.value as RevisionTaskType)}
          className="w-full p-3 mb-4 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors duration-200 shadow-sm"
        >
          <option value="">{t('stage4revision.placeholders.selectTask')}</option>
          {REVISION_TASK_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
          ))}
        </select>

        {revisionState.taskType && (
            <p className="text-xs text-muted-foreground mb-4 italic p-3 bg-muted rounded-md border border-border">
                {t(`stage4revision.taskDescriptions.${revisionState.taskType}`, {defaultValue: getTaskInstruction().split('[Paste')[0]})}
            </p>
        )}

        <TextAreaInput
          label={t('stage4revision.labels.pasteText', {defaultValue: sections.pasteText})}
          id="revisionInputText"
          value={revisionState.inputText}
          onChange={(e) => handleInputChange('inputText', e.target.value)}
          rows={10}
          placeholder={t('stage4revision.placeholders.pasteText')}
        />

        <button
          onClick={handleSubmitRevision}
          disabled={revisionState.isLoading || !revisionState.taskType || !revisionState.inputText}
          className="mt-4 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70 transition-all duration-200 ease-in-out"
        >
          {revisionState.isLoading ? t('stage4revision.buttons.processing') : t('stage4revision.buttons.getSuggestions', {defaultValue: sections.getSuggestions})}
        </button>
        {revisionState.isLoading && <LoadingSpinner />}
      </div>

      {revisionState.outputText && (
        <div className="mt-8 p-6 bg-card rounded-xl shadow-xl border border-border">
          <h3 className="text-xl font-semibold text-primary mb-3 tracking-tight">{t('stage4revision.titles.aiSuggestions')}:</h3>
          <div className="prose prose-sm max-w-none p-4 bg-muted rounded-md whitespace-pre-wrap text-foreground border border-border">
            {revisionState.outputText}
          </div>
           <button
            onClick={() => navigator.clipboard.writeText(revisionState.outputText)}
            className="mt-4 px-5 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            {t('stage4revision.buttons.copyToClipboard')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Stage4Revision;