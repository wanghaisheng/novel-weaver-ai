
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '../components/common/LanguagePicker';

interface ContactPageProps {
  onNavigateHome: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ 
  onNavigateHome,
  onNavigateToPrivacy,
  onNavigateToTerms,
  onNavigateToAbout,
  onNavigateToContact
}) => {
  const { t } = useTranslation();

  // Placeholder form submit handler
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(t('contactPage.formSubmitPlaceholderAlert', {defaultValue: "Thank you for your message! (This is a placeholder - form not yet functional)"}));
    // In a real app, you'd collect form data and send it.
  };

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
            {t('contactPage.title')}
          </h1>
          <div className="prose prose-slate prose-invert mx-auto text-slate-300 text-base leading-relaxed space-y-6">
            <p>
              {t('contactPage.loveToHear')}
            </p>
            
            <section>
                 <h2 className="text-xl font-semibold text-sky-400 mt-6 mb-3">Email Us (Placeholder)</h2>
                <p>For general inquiries, support, or feedback, please email us at: <a href="mailto:support@novelweaver.example.com" className="text-sky-400 hover:underline">support@novelweaver.example.com</a> (This is a placeholder email).</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-sky-400 mt-6 mb-3">Contact Form (Placeholder)</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300">Your Name</label>
                        <input type="text" name="name" id="contact-name" required className="mt-1 block w-full p-2.5 border border-slate-600 rounded-md bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" placeholder="Your Name" />
                    </div>
                    <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300">Your Email</label>
                        <input type="email" name="email" id="contact-email" required className="mt-1 block w-full p-2.5 border border-slate-600 rounded-md bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300">Message</label>
                        <textarea name="message" id="contact-message" rows={4} required className="mt-1 block w-full p-2.5 border border-slate-600 rounded-md bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" placeholder="Your message..."></textarea>
                    </div>
                    <div>
                        <button type="submit" className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] transition-all duration-200 ease-in-out">
                            Send Message (Placeholder)
                        </button>
                    </div>
                </form>
            </section>

            <p className="mt-8">
              {t('contactPage.appreciatePatience')}
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
            <button onClick={onNavigateToAbout} className="text-xs text-slate-400 hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.aboutUs')}</button>
            <button onClick={onNavigateToContact} className="text-xs text-sky-400 font-semibold hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.contactUs')}</button>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <LanguagePicker />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
