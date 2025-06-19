

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { PRICING_PLANS, CURRENCY_OPTIONS, BILLING_CYCLE_OPTIONS, PAYMENT_METHODS, TRUSTED_COMPANIES_LOGOS, PRICING_FAQS } from '../constants';
import type { BillingCycle, FAQItem, PricingPlan, User } from '../types';
import LanguagePicker from '../components/common/LanguagePicker'; // Import LanguagePicker

interface PricingPageProps {
  onNavigateHome: () => void;
  onStartCreating: () => void;
  currentUser: (User & { token: string }) | null;
  onNavigateToSignIn: (message?: string) => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
  onNavigateToAbout: () => void;
  onNavigateToContact: () => void;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode; isButton?: boolean; onClick?: () => void }> = ({ href, children, isButton, onClick }) => (
  <a
    href={href}
    onClick={(e) => { 
      if (onClick) {
        e.preventDefault(); 
        onClick();
      }
    }}
    className={`transition-all duration-200 ease-in-out px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98]
                ${isButton 
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/30 focus:ring-ring' 
                  : 'text-muted-foreground hover:text-primary focus:ring-ring'
                }`}
  >
    {children}
  </a>
);


const PricingPage: React.FC<PricingPageProps> = ({ 
    onNavigateHome, 
    onStartCreating, 
    currentUser, 
    onNavigateToSignIn,
    onNavigateToPrivacy,
    onNavigateToTerms,
    onNavigateToAbout,
    onNavigateToContact
}) => {
  const { t } = useTranslation(); 
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCY_OPTIONS[0]);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [autoDetectedMessage, setAutoDetectedMessage] = useState<string>('');
  const [currencyManuallySelected, setCurrencyManuallySelected] = useState<boolean>(false);

  useEffect(() => {
    if (!currencyManuallySelected) {
        const detectedCurrency = CURRENCY_OPTIONS.find(c => c.code === 'USD') || CURRENCY_OPTIONS[0];
        setSelectedCurrency(detectedCurrency);
        setAutoDetectedMessage(t('pricing.currencyAutoDetectMessage', { currencyCode: detectedCurrency.code }));
    }
  }, [currencyManuallySelected, t]);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = CURRENCY_OPTIONS.find(c => c.code === event.target.value) || CURRENCY_OPTIONS[0];
    setSelectedCurrency(newCurrency);
    setCurrencyManuallySelected(true);
    setAutoDetectedMessage(t('pricing.currencySelectedMessage', { currencyCode: newCurrency.code }));
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const formatPrice = (plan: PricingPlan) => {
    let priceStr: string | undefined;
    let originalPriceStr: string | undefined;

    if (billingCycle === 'yearly' && plan.id !== 'free') {
        const yearlyDiscount = 0.20; 
        const monthlyPriceForCalc = parseFloat(plan.prices[selectedCurrency.code]);
        if (!isNaN(monthlyPriceForCalc) && monthlyPriceForCalc > 0) {
            priceStr = (monthlyPriceForCalc * 12 * (1 - yearlyDiscount) / 12).toFixed(2); // Keep showing price per month
            originalPriceStr = monthlyPriceForCalc.toFixed(2);
        } else { priceStr = plan.prices[selectedCurrency.code]; }
    } else {
        priceStr = plan.prices[selectedCurrency.code];
        if (plan.originalPrices) originalPriceStr = plan.originalPrices[selectedCurrency.code];
    }
    
    if (priceStr === undefined) priceStr = plan.prices['KRW'] || plan.priceMonthly;

    return (
        <>
            {originalPriceStr && priceStr !== originalPriceStr && billingCycle === 'monthly' && (
                <span className="text-base line-through text-muted-foreground mr-2">{selectedCurrency.symbol}{originalPriceStr}</span>
            )}
            {billingCycle === 'yearly' && originalPriceStr && plan.id !== 'free' && (
                 <span className="text-base line-through text-muted-foreground mr-2">{selectedCurrency.symbol}{originalPriceStr}</span>
            )}
            <span className="text-3xl md:text-4xl font-bold text-foreground">{selectedCurrency.symbol}{priceStr}</span>
            <span className="text-muted-foreground text-sm"> {t('pricing.perMonth')}</span>
            {billingCycle === 'yearly' && plan.id !== 'free' && <span className="text-xs text-muted-foreground block">({t('pricing.billedAnnually')})</span>}
        </>
    );
  };
  
  const PaymentMethodLogos = () => (
    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-4">
      {PAYMENT_METHODS.map(method => (
        <span key={method.name} className="text-muted-foreground text-sm border border-border bg-secondary px-3 py-1.5 rounded-md shadow-sm">{method.name}</span>
      ))}
       <span className="text-muted-foreground/70 text-xs">{t('pricing.morePaymentMethods')} &gt;&gt;</span>
    </div>
  );

  const handlePlanCtaClick = (plan: PricingPlan) => {
    if (plan.id === 'free') {
        onStartCreating(); 
        return;
    }
    const gumroadUrl = billingCycle === 'yearly' ? plan.gumroadLinkYearly : plan.gumroadLinkMonthly;
    if (gumroadUrl) {
        const finalUrl = currentUser?.email ? `${gumroadUrl}?email=${encodeURIComponent(currentUser.email)}` : gumroadUrl;
        window.location.href = finalUrl;
    } else {
        alert(t('pricing.gumroadLinkUnavailableAlert', { planName: t(plan.nameKey), cycle: billingCycle }));
    }
  };

  const handleStartCreatingButton = () => {
    onStartCreating();
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-secondary shadow-xl sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <NavLink href="#" onClick={onNavigateHome} >
            <span className="text-2xl font-extrabold text-primary hover:text-primary/90 transition-colors tracking-tight">{t('appTitle')}</span>
          </NavLink>
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink href="#" onClick={onNavigateHome}>{t('navigation.home')}</NavLink>
            <NavLink href="#" isButton={true} onClick={handleStartCreatingButton}>{currentUser ? t('navigation.goToTool') : t('navigation.startCreating')}</NavLink>
          </nav>
           <div className="md:hidden">
            <NavLink href="#" isButton={true} onClick={handleStartCreatingButton}>{currentUser ? t('navigation.myNovels') : t('navigation.getStarted')}</NavLink>
          </div>
        </div>
      </header>

      <main className="w-full flex-grow">
        <section className="py-16 md:py-24 bg-gradient-to-b from-secondary to-background relative">
           <div className="absolute inset-0 opacity-5"> <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="pricingGrid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#pricingGrid)" /></svg></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-6 tracking-tight">{t('pricing.pageTitle')}</h1>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-3">
              <div className="relative">
                <select value={selectedCurrency.code} onChange={handleCurrencyChange} className="appearance-none bg-card border border-border text-foreground text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring shadow-md" aria-label={t('pricing.selectCurrencyAriaLabel')}>
                  {CURRENCY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div>
              </div>
              <div className="flex bg-card p-1 rounded-lg shadow-md border border-border">
                {(Object.keys(BILLING_CYCLE_OPTIONS) as BillingCycle[]).map(cycle => (
                  <button key={cycle} onClick={() => setBillingCycle(cycle)} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-card ${billingCycle === cycle ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
                    {t(BILLING_CYCLE_OPTIONS[cycle].labelKey)}
                    {cycle === 'yearly' && BILLING_CYCLE_OPTIONS.yearly.saveBadgeKey && (<span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${billingCycle === cycle ? 'bg-background/20 text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}>{t(BILLING_CYCLE_OPTIONS.yearly.saveBadgeKey)}</span>)}
                  </button>
                ))}
              </div>
            </div>
            {autoDetectedMessage && <p className="text-xs text-muted-foreground mb-10 italic">{autoDetectedMessage}</p>}

            <div className="grid md:grid-cols-3 gap-8 items-end max-w-6xl mx-auto">
              {PRICING_PLANS.map(plan => (
                <div key={plan.id} className={`p-6 md:p-8 rounded-xl shadow-2xl flex flex-col text-left transition-all duration-300 transform hover:scale-[1.02] ${plan.isHighlighted ? 'bg-card border-2 border-primary relative -translate-y-0 md:-translate-y-4' : 'bg-card/70 border border-border'}`}>
                  {plan.isHighlighted && plan.highlightBadgeKey && billingCycle === 'yearly' && (<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-lg">{t(plan.highlightBadgeKey)}</div>)}
                  <h3 className="text-2xl font-semibold text-primary mb-2">{t(plan.nameKey)}</h3>
                  <div className="mb-6 h-16 flex items-center">{formatPrice(plan)}</div>
                  <button onClick={() => handlePlanCtaClick(plan)} className={`w-full py-3 font-semibold rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card active:scale-[0.98] ${plan.isHighlighted ? 'bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-ring' : 'bg-secondary hover:bg-accent text-secondary-foreground focus:ring-ring'} mb-8`}>
                    {t(plan.ctaTextKey)}
                  </button>
                  <ul className="space-y-2 text-sm text-foreground flex-grow">
                    {plan.featureKeys.map((featureKey, idx) => (<li key={idx} className="flex items-start"><svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg><span>{t(featureKey)} <small className="text-muted-foreground">(i)</small></span></li>))}
                  </ul>
                </div>
              ))}
            </div>
             <p className="text-xs text-muted-foreground mt-8">{t('pricing.polloApiNote')} <a href="#" className="text-primary hover:underline">{t('pricing.polloApiLinkText')}</a>.</p>
             <div className="mt-8 text-sm text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>{t('pricing.paymentSafety')}</div>
            <PaymentMethodLogos />
          </div>
        </section>

        <section className="py-16 md:py-20 bg-secondary border-t border-border">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6 tracking-tight">{t('pricing.joinUsersSection.title', { appTitle: t('appTitle')})}</h2>
            <button onClick={handleStartCreatingButton} className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-primary/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-secondary active:scale-[0.98]">
              {currentUser ? t('pricing.joinUsersSection.ctaLoggedIn') : t('pricing.joinUsersSection.ctaLoggedOut')}
            </button>
          </div>
        </section>
        
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4"><div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4">{TRUSTED_COMPANIES_LOGOS.map(company => (<span key={company} className="text-muted-foreground font-medium text-lg filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">{company}</span>))}</div></div>
        </section>

        <section id="pricing-faqs" className="py-16 md:py-20 bg-secondary border-t border-border scroll-mt-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-primary mb-12 tracking-tight">{t('faqs.pricing.sectionTitle')}</h2>
            <div className="space-y-3">
              {PRICING_FAQS.map((faq, index) => (
                <div key={index} className="bg-card rounded-lg shadow-md border border-border">
                  <button onClick={() => toggleFaq(index)} className="flex justify-between items-center w-full p-5 text-left hover:bg-accent/50 rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-card" aria-expanded={openFaqIndex === index} aria-controls={`faq-answer-${index}`}>
                    <span className="text-md font-medium text-foreground">{t(faq.questionKey)}</span><span className={`transform transition-transform duration-300 text-muted-foreground ${openFaqIndex === index ? 'rotate-180' : 'rotate-0'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></span>
                  </button>
                  {openFaqIndex === index && (<div id={`faq-answer-${index}`} className="p-5 border-t border-border"><p className="text-muted-foreground text-sm leading-relaxed">{t(faq.answerKey)}</p></div>)}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full text-center py-10 border-t border-border bg-secondary">
        <p className="text-sm text-muted-foreground">{t('footer.copyrightPricingPage', { year: new Date().getFullYear(), appTitle: t('appTitle') })}</p>
        <div className="mt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <button onClick={onNavigateToPrivacy} className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out">{t('footer.privacyPolicy')}</button>
            <button onClick={onNavigateToTerms} className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out">{t('footer.termsOfService')}</button>
            <button onClick={onNavigateToAbout} className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out">{t('footer.aboutUs')}</button>
            <button onClick={onNavigateToContact} className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200 ease-in-out">{t('footer.contactUs')}</button>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <LanguagePicker />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;