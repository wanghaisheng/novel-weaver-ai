
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../components/common/LanguagePicker';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ 
  onNavigateHome,
  onNavigateToPrivacy,
  onNavigateToTerms,
  onNavigateToAbout,
  onNavigateToContact
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-slate-900 shadow-xl sticky top-0 z-50 border-b border-slate-700 mb-12">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={onNavigateHome} className="text-2xl font-extrabold text-sky-400 hover:text-sky-300 transition-colors tracking-tight">
            {t('appTitle')}
          </button>
          <button onClick={onNavigateHome} className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98] transition-all duration-200 ease-in-out">
            {t('staticPages.backToHome')}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow w-full max-w-4xl">
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-300 mb-8 text-center tracking-tight">
            {t('aboutPage.title')}
          </h1>
          <div className="prose prose-slate prose-invert mx-auto text-slate-300 text-base leading-relaxed space-y-6">
            <p>
              {t('aboutPage.welcome', { appTitle: t('appTitle') })}
            </p>
            <p>
              <strong>{t('aboutPage.missionStoryComingSoon')}</strong>
            </p>
            <p>
              {t('aboutPage.passionateAboutEmpowering')}
            </p>

            <section>
                <h2 className="text-xl font-semibold text-sky-400 mt-6 mb-3">{t('aboutPage.content.missionTitle', {defaultValue: 'Our Mission (Placeholder)'})}</h2>
                <p>{t('aboutPage.content.mission_p1', { appTitle: t('appTitle'), defaultValue: `Our mission at ${t('appTitle')} is to democratize storytelling by providing writers of all levels with intelligent, intuitive tools that augment creativity, overcome common hurdles, and streamline the novel-writing process. We believe that everyone has a story to tell, and technology can be a powerful ally in bringing those stories to life.` })}</p>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold text-sky-400 mt-6 mb-3">{t('aboutPage.content.visionTitle', { appTitle: t('appTitle'), defaultValue: `The ${t('appTitle')} Vision (Placeholder)`})}</h2>
                <p>{t('aboutPage.content.vision_p1', { appTitle: t('appTitle'), defaultValue: `We envision a world where the barrier to writing a novel is significantly lowered, where aspiring authors feel empowered and supported, and where seasoned writers can explore new creative avenues with AI collaboration. ${t('appTitle')} aims to be more than just a tool; we strive to be a creative partner in your literary journey.`})}</p>
            </section>

            <ul className="list-disc list-inside space-y-1 mt-4">
              <li>{t('aboutPage.visionBehind', { appTitle: t('appTitle') })}</li>
              <li>{t('aboutPage.teamAndValues')}</li>
              <li>{t('aboutPage.revolutionizeNovelWriting')}</li>
              <li>{t('aboutPage.commitmentToAuthors')}</li>
            </ul>
            <p className="mt-8">
              {t('aboutPage.stayTuned', { appTitle: t('appTitle') })}
            </p>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={onNavigateHome}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] transition-all duration-200 ease-in-out"
            >
              {t('staticPages.returnToHomepage')}
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-10 mt-12 border-t border-slate-700">
        <p className="text-sm text-slate-500 mb-4">{t('footer.copyrightSimple', { year: new Date().getFullYear(), appTitle: t('appTitle') })}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <button onClick={onNavigateToPrivacy} className="text-xs text-slate-400 hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.privacyPolicy')}</button>
            <button onClick={onNavigateToTerms} className="text-xs text-slate-400 hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.termsOfService')}</button>
            <button onClick={onNavigateToAbout} className="text-xs text-sky-400 font-semibold hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.aboutUs')}</button>
            <button onClick={onNavigateToContact} className="text-xs text-slate-400 hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.contactUs')}</button>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <LanguagePicker />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
