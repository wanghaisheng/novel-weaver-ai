

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendSparkUserQuery, TrendSparkConcept, TrendSparkAIResponse, ToolSectionId } from '../../types';
import { generateTrendSparkIdeas } from '../../services/geminiService';
import { TextAreaInput } from '../common/TextAreaInput';
import { LoadingSpinner } from '../common/LoadingSpinner';
import LanguagePicker from '../common/LanguagePicker';
import { TOOL_PAGE_SECTIONS, NOVEL_EDITOR_SUB_SECTIONS } from '../../constants';

interface TrendSparkToolProps {
  userApiKey: string | null;
  onDevelopConcept: (concept: TrendSparkConcept) => void;
  onSelectNavigation: (toolId: ToolSectionId, displayId: string) => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
  onNavigateToMonetization: () => void;
}

const TrendSparkTool: React.FC<TrendSparkToolProps> = ({ 
  userApiKey, 
  onDevelopConcept,
  onSelectNavigation,
  onNavigateToPrivacy,
  onNavigateToTerms,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToMonetization
 }) => {
  const { t } = useTranslation();
  const [userTrends, setUserTrends] = useState('');
  const [generatedConcepts, setGeneratedConcepts] = useState<TrendSparkConcept[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateConcepts = useCallback(async () => {
    if (!userTrends.trim()) {
      setError(t('trendSparkTool.errors.noTrendsProvided'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedConcepts([]);

    try {
      const query: TrendSparkUserQuery = { trends: userTrends };
      const response: TrendSparkAIResponse = await generateTrendSparkIdeas(query, userApiKey || undefined);
      setGeneratedConcepts(response.concepts || []);
      if (!response.concepts || response.concepts.length === 0) {
        setError(t('trendSparkTool.errors.noConceptsGenerated'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('trendSparkTool.errors.apiError');
      setError(errorMessage);
      console.error("Trend Spark API call failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userTrends, userApiKey, t]);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-background text-foreground">
      <div className="bg-card p-6 rounded-xl shadow-xl border border-border">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3 tracking-tight">
          {t('trendSparkTool.title')}
        </h2>
        <p className="text-foreground text-sm md:text-base mb-6 leading-relaxed">
          {t('trendSparkTool.description')}
        </p>

        <TextAreaInput
          label={t('trendSparkTool.inputLabel')}
          id="trendInput"
          value={userTrends}
          onChange={(e) => setUserTrends(e.target.value)}
          rows={5}
          placeholder={t('trendSparkTool.inputPlaceholder')}
          instruction={t('trendSparkTool.inputInstruction')}
          className="mb-4 bg-muted"
        />

        <button
          onClick={handleGenerateConcepts}
          disabled={isLoading || !userTrends.trim()}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70 transition-all duration-200 ease-in-out"
        >
          {isLoading ? t('trendSparkTool.buttonLoading') : t('trendSparkTool.buttonGenerate')}
        </button>

        {isLoading && <LoadingSpinner />}
        {error && <p className="mt-4 text-sm text-destructive-foreground bg-destructive/80 border border-destructive p-3 rounded-md">{error}</p>}
      </div>

      {generatedConcepts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl md:text-2xl font-semibold text-primary tracking-tight">
            {t('trendSparkTool.generatedConceptsTitle')}
          </h3>
          {generatedConcepts.map((concept) => (
            <div key={concept.id} className="bg-secondary p-6 rounded-xl shadow-lg border border-border hover:border-primary/70 transition-colors duration-200">
              <h4 className="text-lg font-bold text-primary mb-2">{concept.title}</h4>
              <p className="text-sm text-foreground mb-3 leading-relaxed italic">"{concept.blurb}"</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
                <div>
                  <strong className="text-muted-foreground">{t('trendSparkTool.conceptCard.genre')}:</strong>
                  <span className="ml-1 text-foreground">{concept.genreSuggestion}</span>
                </div>
                <div>
                  <strong className="text-muted-foreground">{t('trendSparkTool.conceptCard.targetAudience')}:</strong>
                  <span className="ml-1 text-foreground">{concept.targetAudiencePlatform}</span>
                </div>
              </div>
              
              <div>
                <strong className="block text-xs text-muted-foreground mb-1">{t('trendSparkTool.conceptCard.sellingPoints')}:</strong>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  {concept.sellingPoints.map((point, index) => (
                    <li key={index} className="text-xs text-foreground leading-tight">{point}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onDevelopConcept(concept)}
                className="mt-5 px-5 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-secondary active:scale-[0.98] transition-all duration-200 ease-in-out"
              >
                {t('trendSparkTool.buttonDevelopConcept')}
              </button>
            </div>
          ))}
        </div>
      )}
      <footer className="w-full text-center py-10 mt-12 border-t border-border bg-background -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 rounded-b-xl">
        <p className="text-sm text-muted-foreground">{t('footer.copyrightToolPage', { year: new Date().getFullYear(), appTitle: t('appTitle') })}</p>
        
        <div className="mt-4 mb-3 border-t border-border/50 pt-3">
          <span className="text-xs text-muted-foreground mr-2">{t('footer.toolNavigation')}:</span>
          {TOOL_PAGE_SECTIONS.map(tool => (
            <button
              key={tool.id}
              onClick={() => onSelectNavigation(tool.id, tool.id === 'novel-editor' ? (NOVEL_EDITOR_SUB_SECTIONS[0]?.id || 'novel-workflow-editor-section') : tool.id)}
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
            <button onClick={onNavigateToMonetization} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('monetizationPage.footerLink')}</button>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <LanguagePicker />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default TrendSparkTool;