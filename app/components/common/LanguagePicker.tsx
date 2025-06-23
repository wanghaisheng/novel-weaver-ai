import React from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLngs } from '../../i18n'; // Assuming supportedLngs is exported from i18n.ts

const LanguagePicker: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-muted-foreground hidden sm:inline">{i18n.t('footer.language')}:</span>
      <select
        value={i18n.resolvedLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-muted text-foreground text-xs rounded-md p-1.5 border border-input focus:outline-none focus:ring-1 focus:ring-ring hover:bg-accent/50 transition-colors"
        aria-label={i18n.t('footer.selectLanguageLabel')}
      >
        {Object.entries(supportedLngs).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguagePicker;