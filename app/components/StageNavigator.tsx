import React from 'react';
import { useTranslation } from 'react-i18next';
import { NovelStage, STAGES_ORDER } from '../types';
import { STAGE_INSTRUCTIONS } from '../constants';

interface StageNavigatorProps {
  currentStage: NovelStage;
  onStageSelect: (stage: NovelStage) => void;
}

export const StageNavigator: React.FC<StageNavigatorProps> = ({ currentStage, onStageSelect }) => {
  const { t } = useTranslation();

  return (
    <nav className="w-64 bg-secondary p-4 space-y-2 flex-shrink-0 h-full overflow-y-auto border-r border-border">
      <h2 className="text-xl font-bold text-primary mb-6 px-2 tracking-tight">{t('stageNavigator.title')}</h2>
      {STAGES_ORDER.map((stageId) => {
        const stageInfo = STAGE_INSTRUCTIONS[stageId];
        const isActive = currentStage === stageId;
        const translatedTitle = t(stageInfo.titleKey);
        // Split translated title if it contains ":", otherwise use full title for main part
        const titleParts = translatedTitle.includes(':') ? translatedTitle.split(':') : [translatedTitle, ''];
        const mainTitlePart = titleParts[0];
        const subTitlePart = titleParts.length > 1 ? titleParts[1].trim() : '';

        return (
          <button
            key={stageId}
            onClick={() => onStageSelect(stageId)}
            className={`w-full text-left px-3 py-3 rounded-md transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-secondary ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-md border-l-4 border-primary' 
                : 'bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground'
            }`}
            title={t(stageInfo.descriptionKey)}
          >
            <span className="font-semibold">{mainTitlePart}</span>
            {subTitlePart && <span className="text-sm">{`: ${subTitlePart}`}</span>}
          </button>
        );
      })}
    </nav>
  );
};