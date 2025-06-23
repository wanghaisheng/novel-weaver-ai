
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../components/common/LanguagePicker';


interface PrivacyPageProps {
  onNavigateHome: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
  onNavigateToMonetization: () => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ 
  onNavigateHome,
  onNavigateToPrivacy,
  onNavigateToTerms,
  onNavigateToAbout,
  onNavigateToContact,
  onNavigateToMonetization
 }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-secondary shadow-xl sticky top-0 z-50 border-b border-border mb-12">
        <div className="container mx-auto flex items-center justify-between">
          <button onClick={onNavigateHome} className="text-2xl font-extrabold text-primary hover:text-primary/90 transition-colors tracking-tight">
            {t('appTitle')}
          </button>
          <button onClick={onNavigateHome} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-secondary active:scale-[0.98] transition-all duration-200 ease-in-out">
            {t('staticPages.backToHome')}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow w-full max-w-4xl">
        <div className="bg-card p-8 rounded-xl shadow-2xl border border-border">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-8 text-center tracking-tight">
            {t('privacyPage.title')}
          </h1>
          <div className="prose prose-sm md:prose-base max-w-none mx-auto text-foreground leading-relaxed space-y-6 
                          prose-headings:text-primary prose-a:text-accent prose-strong:text-foreground 
                          prose-ul:text-muted-foreground prose-li:marker:text-primary">
            <p>
              {t('privacyPage.thankYou', { appTitle: t('appTitle') })}
            </p>
            
            <section>
              <h2 className="text-2xl font-semibold mt-6 mb-3">{t('privacyPage.contentComingSoonTitle')}</h2>
              <p>{t('privacyPage.workingOnDetails')}</p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('privacyPage.infoWeCollect')}</li>
                <li>{t('privacyPage.howWeUseInfo')}</li>
                <li>{t('privacyPage.howWeProtectInfo')}</li>
                <li>{t('privacyPage.yourRights')}</li>
                <li>{t('privacyPage.andMore')}</li>
              </ul>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect (Placeholder)</h2>
                <p>We may collect information you provide directly to us, such as when you create an account (e.g., email address). All novel content (ideas, outlines, chapters) created within the tool is stored in your browser's local storage and is not transmitted to our servers unless future cloud features are implemented and explicitly used by you.</p>
                <p>We may also collect anonymous usage data through analytics tools to help us understand how our service is used and to improve it. This data does not personally identify you.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information (Placeholder)</h2>
                <p>Information you provide for account creation is used to manage your account and provide you with access to our services. Anonymized usage data helps us improve functionality and user experience. Novel content stored locally is solely for your use within the application.</p>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Storage & Security (Placeholder)</h2>
                <p>As mentioned, your primary novel data is stored in your browser's local storage. This means the data resides on your device. While we design the application with security in mind, the security of local storage is also dependent on your browser and device security. We strongly recommend using the download feature frequently to back up your work.</p>
                <p>If we introduce cloud storage features in the future, we will update this policy with details on data encryption and server-side security measures.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6 mb-3">4. Your Rights (Placeholder)</h2>
                <p>You have the right to access and modify your account information. You have full control over the novel data stored in your local browser storage and can delete it by clearing your browser's cache/storage for this site or by using application features if provided. For specific data requests related to your account (if applicable), please contact us.</p>
            </section>
            
            <p className="mt-8">
              {t('privacyPage.checkBackSoon')}
            </p>
          </div>
          <div className="text-center mt-12">
            <button
              onClick={onNavigateHome}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] transition-all duration-200 ease-in-out"
            >
              {t('staticPages.returnToHomepage')}
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-10 mt-12 border-t border-border bg-secondary">
        <p className="text-sm text-muted-foreground mb-4">{t('footer.copyrightSimple', { year: new Date().getFullYear(), appTitle: t('appTitle') })}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <button onClick={onNavigateToPrivacy} className="text-xs text-primary font-semibold hover:text-primary/80 hover:underline transition-colors duration-200 ease-in-out">{t('footer.privacyPolicy')}</button>
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

export default PrivacyPage;