import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput } from './common/TextInput';

interface StageFinalizeExportProps {
  novelTitle: string;
  onSetNovelTitle: (title: string) => void;
  onDownloadNovel: () => void;
}

const StageFinalizeExport: React.FC<StageFinalizeExportProps> = ({
  novelTitle,
  onSetNovelTitle,
  onDownloadNovel,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 p-6 md:p-8 text-center bg-slate-800 rounded-xl shadow-xl border border-slate-700">
      <h3 className="text-3xl font-bold text-cyan-400 mb-6 tracking-tight">
        {t('finalizeExport.congratulations')}
      </h3>
      <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
        {t('finalizeExport.reachedFinalStage')}
      </p>

      <div className="max-w-md mx-auto mb-10">
        <TextInput
          label={t('finalizeExport.novelTitleLabel')}
          id="novelFinalTitle"
          value={novelTitle}
          onChange={(e) => onSetNovelTitle(e.target.value)}
          placeholder={t('finalizeExport.novelTitlePlaceholder')}
          className="text-center text-xl p-3" 
          instruction={t('finalizeExport.novelTitleInstruction')}
        />
      </div>

      <button
        onClick={onDownloadNovel}
        disabled={!novelTitle.trim()}
        className="px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-xl font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none disabled:opacity-70"
        aria-label={t('finalizeExport.downloadAriaLabel')}
      >
        {t('finalizeExport.downloadButton')}
      </button>

      <p className="text-sm text-slate-400 mt-12">
        {t('finalizeExport.thankYouMessage', { appTitle: t('appTitle') })}
      </p>
    </div>
  );
};

export default StageFinalizeExport;