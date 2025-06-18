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
  const sections = META_PROMPT_SECTIONS.stage4; // These are instruction templates, not directly translated UI text.

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
    // META_PROMPT_SECTIONS contains detailed English instructions for the AI, not for UI display.
    // The UI label for the task type itself is handled by REVISION_TASK_OPTIONS and `t()`.
    // The instruction displayed is part of the AI's meta prompt.
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
      <div className="p-6 bg-slate-800 border border-slate-700 rounded-xl shadow-xl">
        {/* sections.intro is an English instruction for the AI. If UI text is needed, use t() */}
        <p className="text-md text-slate-300 leading-relaxed">{t('stage4revision.introUIText', {defaultValue: sections.intro})}</p>
      </div>
      
      <div className="p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
        <label htmlFor="revisionTaskType" className="block text-sm font-medium text-slate-300 mb-1.5">
          {t('stage4revision.labels.selectTask', {defaultValue: sections.selectTask})}
        </label>
        <select
          id="revisionTaskType"
          value={revisionState.taskType}
          onChange={(e) => handleInputChange('taskType', e.target.value as RevisionTaskType)}
          className="w-full p-3 mb-4 border border-slate-600 rounded-lg bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 shadow-sm"
        >
          <option value="">{t('stage4revision.placeholders.selectTask')}</option>
          {REVISION_TASK_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
          ))}
        </select>

        {revisionState.taskType && (
            <p className="text-xs text-slate-400 mb-4 italic p-3 bg-slate-700 rounded-md border border-slate-600">
                {/* getTaskInstruction() returns the AI meta prompt instruction. If you need a UI description, use t() */}
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
          className="mt-4 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70 transition-all duration-200 ease-in-out"
        >
          {revisionState.isLoading ? t('stage4revision.buttons.processing') : t('stage4revision.buttons.getSuggestions', {defaultValue: sections.getSuggestions})}
        </button>
        {revisionState.isLoading && <LoadingSpinner />}
      </div>

      {revisionState.outputText && (
        <div className="mt-8 p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
          <h3 className="text-xl font-semibold text-cyan-400 mb-3 tracking-tight">{t('stage4revision.titles.aiSuggestions')}:</h3>
          <div className="prose prose-sm max-w-none p-4 bg-slate-700 rounded-md whitespace-pre-wrap text-slate-200 border border-slate-600">
            {revisionState.outputText}
          </div>
           <button
            onClick={() => navigator.clipboard.writeText(revisionState.outputText)}
            className="mt-4 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] transition-all duration-200 ease-in-out"
          >
            {t('stage4revision.buttons.copyToClipboard')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Stage4Revision;