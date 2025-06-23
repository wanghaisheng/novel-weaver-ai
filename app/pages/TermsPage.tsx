
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../components/common/LanguagePicker';

interface TermsPageProps {
  onNavigateHome: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
  onNavigateToMonetization: () => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ 
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
            {t('termsPage.title')}
          </h1>
          <div className="prose prose-sm md:prose-base max-w-none mx-auto text-foreground leading-relaxed space-y-6
                          prose-headings:text-primary prose-a:text-accent prose-strong:text-foreground 
                          prose-ul:text-muted-foreground prose-li:marker:text-primary">
            <p>
              {t('termsPage.welcome', { appTitle: t('appTitle') })}
            </p>
            <p>
              <strong>{t('termsPage.contentComingSoonTitle')}</strong>
            </p>
            <p>
              {t('termsPage.finalizingLegalFramework')}
            </p>
            
            <section>
                <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms (Placeholder)</h2>
                <p>{t('termsPage.content.section1_p1', { appTitle: t('appTitle'), defaultValue: `By accessing or using ${t('appTitle')} ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.` })}</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6 mb-3">2. Use of Service (Placeholder)</h2>
                <p>{t('termsPage.content.section2_p1', { defaultValue: `You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for any content you create and for your conduct while using the Service. You agree not to use the service to generate harmful, illegal, or infringing content.`})}</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6 mb-3">3. Intellectual Property (Placeholder)</h2>
                <p>{t('termsPage.content.section3_p1', { appTitle: t('appTitle'), defaultValue: `You retain full ownership of the creative content (novel drafts, ideas, outlines, etc.) you input into and generate with the Service ("Your Content"). We claim no ownership over Your Content. The Service itself, including its software, design, and branding, is the property of ${t('appTitle')} and its licensors and is protected by intellectual property laws.`})}</p>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold mt-6 mb-3">4. Disclaimers and Limitation of Liability (Placeholder)</h2>
                <p>{t('termsPage.content.section4_p1', { appTitle: t('appTitle'), defaultValue: `The Service is provided "as is" and "as available" without any warranties of any kind. We do not warrant that the service will be error-free or uninterrupted. ${t('appTitle')} shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use, the service.`})}</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mt-6 mb-3">5. Changes to Terms (Placeholder)</h2>
                <p>{t('termsPage.content.section5_p1', { defaultValue: `We reserve the right to modify these Terms at any time. We will provide notice of material changes. Your continued use of the Service after such changes constitutes your acceptance of the new Terms.`})}</p>
            </section>

            <ul className="list-disc list-inside space-y-1 mt-4">
              <li>{t('termsPage.userResponsibilities')}</li>
              <li>{t('termsPage.providerResponsibilities')}</li>
              <li>{t('termsPage.contentOwnership')}</li>
              <li>{t('termsPage.acceptableUse')}</li>
              <li>{t('termsPage.disclaimers')}</li>
              <li>{t('termsPage.otherLegalInfo')}</li>
            </ul>
            <p className="mt-8">
              {t('termsPage.checkBackSoon')}
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
            <button onClick={onNavigateToPrivacy} className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200 ease-in-out">{t('footer.privacyPolicy')}</button>
            <button onClick={onNavigateToTerms} className="text-xs text-primary font-semibold hover:text-primary/80 hover:underline transition-colors duration-200 ease-in-out">{t('footer.termsOfService')}</button>
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

export default TermsPage;