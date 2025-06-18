import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendSparkUserQuery, TrendSparkConcept, TrendSparkAIResponse, ToolSectionId } from '../../types';
import { generateTrendSparkIdeas } from '../../services/geminiService';
import { TextAreaInput } from '../common/TextAreaInput';
import { LoadingSpinner } from '../common/LoadingSpinner';
import LanguagePicker from '../common/LanguagePicker';
import { TOOL_PAGE_SECTIONS } from '../../constants';

interface TrendSparkToolProps {
  userApiKey: string | null;
  onDevelopConcept: (concept: TrendSparkConcept) => void;
  onSelectNavigation: (toolId: ToolSectionId, displayId: string) => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
}

const TrendSparkTool: React.FC<TrendSparkToolProps> = ({ 
  userApiKey, 
  onDevelopConcept,
  onSelectNavigation,
  onNavigateToPrivacy,
  onNavigateToTerms,
  onNavigateToAbout,
  onNavigateToContact
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
      const response: TrendSparkAIResponse = await generateTrendSparkIdeas(query, userApiKey);
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
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold text-sky-300 mb-3 tracking-tight">
          {t('trendSparkTool.title')}
        </h2>
        <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed">
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
          className="mb-4"
        />

        <button
          onClick={handleGenerateConcepts}
          disabled={isLoading || !userTrends.trim()}
          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70 transition-all duration-200 ease-in-out"
        >
          {isLoading ? t('trendSparkTool.buttonLoading') : t('trendSparkTool.buttonGenerate')}
        </button>

        {isLoading && <LoadingSpinner />}
        {error && <p className="mt-4 text-sm text-red-300 bg-red-900/50 border border-red-700 p-3 rounded-md">{error}</p>}
      </div>

      {generatedConcepts.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl md:text-2xl font-semibold text-sky-300 tracking-tight">
            {t('trendSparkTool.generatedConceptsTitle')}
          </h3>
          {generatedConcepts.map((concept) => (
            <div key={concept.id} className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 hover:border-sky-600/70 transition-colors duration-200">
              <h4 className="text-lg font-bold text-sky-400 mb-2">{concept.title}</h4>
              <p className="text-sm text-slate-300 mb-3 leading-relaxed italic">"{concept.blurb}"</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
                <div>
                  <strong className="text-slate-400">{t('trendSparkTool.conceptCard.genre')}:</strong>
                  <span className="ml-1 text-slate-200">{concept.genreSuggestion}</span>
                </div>
                <div>
                  <strong className="text-slate-400">{t('trendSparkTool.conceptCard.targetAudience')}:</strong>
                  <span className="ml-1 text-slate-200">{concept.targetAudiencePlatform}</span>
                </div>
              </div>
              
              <div>
                <strong className="block text-xs text-slate-400 mb-1">{t('trendSparkTool.conceptCard.sellingPoints')}:</strong>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  {concept.sellingPoints.map((point, index) => (
                    <li key={index} className="text-xs text-slate-200 leading-tight">{point}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onDevelopConcept(concept)}
                className="mt-5 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] transition-all duration-200 ease-in-out"
              >
                {t('trendSparkTool.buttonDevelopConcept')}
              </button>
            </div>
          ))}
        </div>
      )}
      <footer className="w-full text-center py-10 mt-12 border-t border-slate-700 bg-slate-900 -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 rounded-b-xl">
        <p className="text-sm text-slate-500">{t('footer.copyrightToolPage', { year: new Date().getFullYear(), appTitle: t('appTitle') })}</p>
        
        <div className="mt-4 mb-3 border-t border-slate-700/50 pt-3">
          <span className="text-xs text-slate-500 mr-2">{t('footer.toolNavigation')}:</span>
          {TOOL_PAGE_SECTIONS.map(tool => (
            <button
              key={tool.id}
              onClick={() => onSelectNavigation(tool.id, tool.id)}
              className="text-xs text-sky-400 hover:text-sky-300 hover:underline transition-colors duration-200 ease-in-out px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500 rounded"
              aria-label={t(tool.titleKey)}
            >
              {t(tool.titleKey)}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <button onClick={onNavigateToPrivacy} className="text-xs text-slate-400 hover:text-sky-300 hover:underline transition-colors duration-200 ease-in-out">{t('footer.privacyPolicy')}</button>
            <button onClick={onNavigateToTerms} className="text-xs text-slate-400 hover:text-sky-300 hover:underline transition-colors duration-200 ease-in-out">{t('footer.termsOfService')}</button>
            <button onClick={onNavigateToAbout} className="text-xs text-slate-400 hover:text-sky-300 hover:underline transition-colors duration-200 ease-in-out">{t('footer.aboutUs')}</button>
            <button onClick={onNavigateToContact} className="text-xs text-slate-400 hover:text-sky-300 hover:underline transition-colors duration-200 ease-in-out">{t('footer.contactUs')}</button>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <LanguagePicker />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default TrendSparkTool;