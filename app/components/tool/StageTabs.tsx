

import React from 'react';
import { useTranslation } from 'react-i18next';
import { NovelStage, STAGES_ORDER } from '../../types';
import { STAGE_INSTRUCTIONS } from '../../constants';

interface StageTabsProps {
  currentStage: NovelStage;
  onStageSelect: (stage: NovelStage) => void;
}

const StageTabs: React.FC<StageTabsProps> = ({ currentStage, onStageSelect }) => {
  const { t } = useTranslation();
  return (
    <div className="flex space-x-1 border-b-2 border-border" role="tablist" aria-label="Novel Stages">
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
            role="tab"
            aria-selected={isActive}
            aria-controls={`stage-panel-${stageId}`} 
            id={`stage-tab-${stageId}`}
            className={`px-4 py-3 font-semibold text-sm rounded-t-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-70 focus:ring-offset-0 focus:ring-offset-secondary relative 
              ${
                isActive
                  ? 'bg-card text-primary border-x-2 border-t-2 border-border border-b-2 border-b-card focus:ring-ring -mb-0.5' 
                  : 'text-muted-foreground hover:text-primary hover:bg-accent/70 border-2 border-transparent focus:ring-ring'
              }
            `}
            title={t(stageInfo.descriptionKey)}
          >
            {subTitlePart || mainTitlePart} {/* Show subtitle if present, else main title part */}
          </button>
        );
      })}
    </div>
  );
};

export default StageTabs;