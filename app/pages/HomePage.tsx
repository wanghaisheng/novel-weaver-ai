
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { GENERAL_FAQS } from '../constants'; 
import type { User, FAQItem } from '../types'; 
import LanguagePicker from '../components/common/LanguagePicker'; // Import LanguagePicker

interface HomePageProps {
  onStartCreating: () => void;
  onNavigateToPricing: () => void;
  currentUser: (User & { token: string }) | null;
  onSignOut: () => void;
  onNavigateToSignIn: (message?: string) => void;
  onNavigateToSignUp: () => void;
  onNavigateToPrivacy: () => void; 
  onNavigateToTerms: () => void;   
  onNavigateToAbout: () => void;   
  onNavigateToContact: () => void; 
}

// Key features will now use translation keys
const keyFeatures = [
  {
    icon: '💡',
    titleKey: 'home.features.ideation.title',
    descriptionKey: 'home.features.ideation.description',
  },
  {
    icon: '📈',
    titleKey: 'home.features.outlining.title',
    descriptionKey: 'home.features.outlining.description',
  },
  {
    icon: '✍️',
    titleKey: 'home.features.writing.title',
    descriptionKey: 'home.features.writing.description',
  },
  {
    icon: '🔍',
    titleKey: 'home.features.revision.title',
    descriptionKey: 'home.features.revision.description',
  },
];

// How it works steps will also use translation keys
const howItWorksSteps = [
  {
    step: 1,
    icon: '✨',
    titleKey: 'home.howItWorks.spark.title',
    descriptionKey: 'home.howItWorks.spark.description',
  },
  {
    step: 2,
    icon: '🗺️',
    titleKey: 'home.howItWorks.outline.title',
    descriptionKey: 'home.howItWorks.outline.description',
  },
  {
    step: 3,
    icon: '🖋️',
    titleKey: 'home.howItWorks.draft.title',
    descriptionKey: 'home.howItWorks.draft.description',
  },
  {
    step: 4,
    icon: '🛠️',
    titleKey: 'home.howItWorks.refine.title',
    descriptionKey: 'home.howItWorks.refine.description',
  },
];

// Genres for mega menu: names and descriptions should be translatable
const genresForMegaMenu = [ 
  { nameKey: 'genres.sciFi.name', color: 'bg-gradient-to-br from-indigo-500 to-purple-600', icon: '🚀', descriptionKey: "genres.sciFi.description" },
  { nameKey: 'genres.fantasy.name', color: 'bg-gradient-to-br from-purple-500 to-pink-600', icon: '🐉', descriptionKey: "genres.fantasy.description" },
  { nameKey: 'genres.mystery.name', color: 'bg-gradient-to-br from-yellow-500 to-orange-600', icon: '🔍', descriptionKey: "genres.mystery.description" },
];

// Novel showcases: titles and blurbs could be translatable if they are generic examples
const initialNovelShowcases = [ // For demo, keeping these as is, but in full i18n, these would use keys or be dynamic
  { title: "The Last Stargazer", blurb: "In a dying universe...", imagePlaceholder: "🌌", bgColor: "bg-slate-800 border border-slate-700", genre: "Sci-Fi"},
  { title: "Cyber-Soul City", blurb: "A detective with a bio-enhanced past...", imagePlaceholder: "🌃", bgColor: "bg-slate-800 border border-slate-700", genre: "Cyberpunk"},
  { title: "The Clockwork Heart", blurb: "An inventor in a steampunk era creates an automaton with a human heart, leading to unforeseen emotional entanglements.", imagePlaceholder: "⚙️❤️", bgColor: "bg-slate-800 border border-slate-700", genre: "Steampunk"},
  { title: "Echoes of the Void", blurb: "A lone ship adrift in uncharted space receives a cryptic message from a long-lost civilization.", imagePlaceholder: "🛰️", bgColor: "bg-slate-800 border border-slate-700", genre: "Sci-Fi"},
  { title: "The Dragon's Oracle", blurb: "A young village girl discovers she can communicate with ancient dragons, a power that could save or doom her kingdom.", imagePlaceholder: "🐲", bgColor: "bg-slate-800 border border-slate-700", genre: "Fantasy"},
  { title: "Neon City Blues", blurb: "In the sprawling metropolis of Neo-Veridia, a private investigator uncovers a conspiracy that reaches the highest echelons of corporate power.", imagePlaceholder: "🏙️✨", bgColor: "bg-slate-800 border border-slate-700", genre: "Cyberpunk"}
];

// Testimonials: quotes, author names, titles could be translatable
interface Testimonial {
  id: string;
  quoteKey: string;
  authorNameKey: string;
  authorTitleKey: string;
  avatarPlaceholder?: string;
}

const testimonials: Testimonial[] = [
  { id: 'testimonial-1', quoteKey: "home.testimonials.1.quote", authorNameKey: "home.testimonials.1.authorName", authorTitleKey: "home.testimonials.1.authorTitle", avatarPlaceholder: "🚀" },
  { id: 'testimonial-2', quoteKey: "home.testimonials.2.quote", authorNameKey: "home.testimonials.2.authorName", authorTitleKey: "home.testimonials.2.authorTitle", avatarPlaceholder: "📚" },
  { id: 'testimonial-3', quoteKey: "home.testimonials.3.quote", authorNameKey: "home.testimonials.3.authorName", authorTitleKey: "home.testimonials.3.authorTitle", avatarPlaceholder: "✒️" }
];

// Genre tools: names, descriptions, toolFocus should be translatable
interface HomePageGenreTool {
  nameKey: string;
  icon: string;
  descriptionKey: string;
  toolFocusKey: string;
  colorClasses: string;
}

const homePageGenreExamples: HomePageGenreTool[] = [
  { nameKey: "home.genreTools.sciFi.name", icon: "🚀", descriptionKey: "home.genreTools.sciFi.description", toolFocusKey: "home.genreTools.sciFi.toolFocus", colorClasses: "border-sky-500 hover:shadow-sky-500/10" },
  { nameKey: "home.genreTools.fantasy.name", icon: "🐉", descriptionKey: "home.genreTools.fantasy.description", toolFocusKey: "home.genreTools.fantasy.toolFocus", colorClasses: "border-purple-500 hover:shadow-purple-500/10" },
  { nameKey: "home.genreTools.mystery.name", icon: "🔍", descriptionKey: "home.genreTools.mystery.description", toolFocusKey: "home.genreTools.mystery.toolFocus", colorClasses: "border-amber-500 hover:shadow-amber-500/10" }
];


const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);


const NavLink: React.FC<{
  href?: string;
  children: React.ReactNode;
  isButton?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean;
}> = ({ href, children, isButton, onClick, className, ...props }) => {
  const baseClasses = `transition-all duration-200 ease-in-out px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98]`;
  const typeClasses = isButton
    ? 'bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white shadow-md hover:shadow-lg hover:shadow-cyan-500/30 focus:ring-sky-400'
    : 'text-slate-300 hover:text-sky-400 focus:ring-sky-400';

  const combinedClassName = `${baseClasses} ${typeClasses} ${className || ''}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    } else if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1); 
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
          const headerOffset = 80; 
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      } else {
        console.warn(`[HomePage.tsx] NavLink: Element with ID '${targetId}' not found for smooth scroll.`);
      }
    }
  };

  if (href && !onClick && !href.startsWith('#')) { 
    return <a href={href} className={combinedClassName} {...props}>{children}</a>;
  }

  const Element = (href && href.startsWith('#') && !onClick) ? 'a' : 'button';

  return (
    <Element
      onClick={handleClick}
      className={combinedClassName}
      {...props}
      {...(Element === 'a' && {href})}
    >
      {children}
    </Element>
  );
};


const HomePage: React.FC<HomePageProps> = ({
    onStartCreating,
    onNavigateToPricing,
    currentUser,
    onSignOut,
    onNavigateToSignIn,
    onNavigateToSignUp,
    onNavigateToPrivacy,
    onNavigateToTerms,
    onNavigateToAbout,
    onNavigateToContact
}) => {
  const { t } = useTranslation(); // Add useTranslation hook
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const showcaseGenres = useMemo(() => {
    const uniqueGenres = new Set(initialNovelShowcases.map(s => s.genre));
    return ['All', ...Array.from(uniqueGenres)]; // "All" might need translation if displayed
  }, []);

  const filteredShowcases = useMemo(() => {
    if (activeFilter === 'All') return initialNovelShowcases;
    return initialNovelShowcases.filter(showcase => showcase.genre === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMegaMenuOpen && megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node) && megaMenuTriggerRef.current && !megaMenuTriggerRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMegaMenuOpen) setIsMegaMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMegaMenuOpen]);

  const handleStartCreatingClick = () => {
    onStartCreating(); 
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-slate-900 shadow-xl sticky top-0 z-50 border-b border-slate-700">
        <div className="container mx-auto flex items-center justify-between">
          <NavLink href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <span className="text-2xl font-extrabold text-sky-400 hover:text-sky-300 transition-colors tracking-tight">{t('appTitle')}</span>
          </NavLink>
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="#key-features">{t('navigation.features')}</NavLink>
            <NavLink href="#how-it-works-home">{t('navigation.howItWorks')}</NavLink>
            <NavLink href="#testimonials">{t('navigation.testimonials')}</NavLink>
            <NavLink href="#genre-tools-section-home">{t('navigation.genreTools')}</NavLink>

            <div className="relative">
              <button ref={megaMenuTriggerRef} onClick={() => setIsMegaMenuOpen(prev => !prev)} aria-expanded={isMegaMenuOpen} aria-haspopup="true" className="flex items-center space-x-1 transition-all duration-200 ease-in-out px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 text-slate-300 hover:text-sky-400 focus:ring-sky-400">
                <span>{t('navigation.toolsMegaMenu')}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'transform rotate-180' : ''}`} />
              </button>
              {isMegaMenuOpen && (
                <div ref={megaMenuRef} className="absolute top-full mt-2 w-screen max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl -translate-x-1/2 left-1/2 sm:left-auto sm:translate-x-0 sm:right-0 origin-top-right bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 z-40" style={{ animation: 'fadeInScaleUp 0.2s ease-out forwards' }}>
                   <style>{`@keyframes fadeInScaleUp { from { opacity: 0; transform: scale(0.95) translateY(-10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
                  <h3 className="text-xl font-semibold text-sky-300 mb-1 px-1">{t('home.megaMenu.title')}</h3>
                  <p className="text-xs text-slate-400 mb-4 px-1">{t('home.megaMenu.description')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {genresForMegaMenu.map(genre => (
                      <a key={genre.nameKey} href="#" onClick={(e) => { e.preventDefault(); alert(t('home.megaMenu.alertAccessingTools', { genreName: t(genre.nameKey) })); setIsMegaMenuOpen(false); }} className="group block p-4 bg-slate-700 hover:bg-slate-600/80 rounded-lg transition-all duration-200 ease-in-out border border-slate-600 hover:border-sky-500/50 hover:shadow-lg">
                        <div className="flex items-center space-x-3 mb-1.5"><span className="text-3xl opacity-80 group-hover:opacity-100 transition-opacity">{genre.icon}</span><span className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">{t(genre.nameKey)}</span></div>
                        <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-snug">{t(genre.descriptionKey)}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink href="#" onClick={(e) => { e.preventDefault(); onNavigateToPricing();}}>{t('navigation.pricing')}</NavLink> 
            {currentUser ? (
                <>
                    <span className="px-4 py-2 text-sm text-slate-400 truncate max-w-[150px]" title={currentUser.email}>{currentUser.email}</span>
                    <NavLink onClick={(e) => { e.preventDefault(); onSignOut();}} className="bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white focus:ring-slate-500">{t('navigation.signOut')}</NavLink>
                </>
            ) : (
                <>
                    <NavLink onClick={(e) => { e.preventDefault(); onNavigateToSignIn();}}>{t('navigation.signIn')}</NavLink>
                    <NavLink onClick={(e) => { e.preventDefault(); onNavigateToSignUp();}} isButton={true}>{t('navigation.signUp')}</NavLink>
                </>
            )}
          </nav>
          <div className="md:hidden"> 
            <button onClick={handleStartCreatingClick} className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98] transition-all duration-200 ease-in-out">
              {t('home.hero.createNovelNow')}
            </button>
          </div>
        </div>
      </header>

      <section className="w-full py-20 md:py-28 px-4 bg-slate-900 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10"><svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="smallGridHero" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#smallGridHero)" /></svg></div>
         <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 relative z-10">{t('home.hero.welcome')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">{t('appTitle')}!</span></h1>
        <p className="text-lg sm:text-xl text-slate-300 mt-6 max-w-2xl mx-auto relative z-10 leading-relaxed">{t('home.hero.tagline')}</p>
         <button onClick={handleStartCreatingClick} className="mt-10 px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/40 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-[0.98] relative z-10" aria-label={t('home.hero.createNovelNowAriaLabel')}>
            {t('home.hero.createNovelNow')}
          </button>
      </section>

      <main className="container mx-auto px-4 py-12 flex-grow">
        <section id="key-features" className="py-12 md:py-16 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-sky-300 mb-16 tracking-tight">{t('home.features.sectionTitle', { appTitle: t('appTitle') })}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyFeatures.map((feature) => (
              <div key={feature.titleKey} className="bg-slate-800 p-8 rounded-xl shadow-xl border border-slate-700 text-center transform hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10 hover:border-slate-600 transition-all duration-300">
                <div className="text-5xl mb-6 text-sky-400">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-100 mb-3">{t(feature.titleKey)}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t(feature.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works-home" className="py-12 md:py-16 bg-slate-900 rounded-xl my-16 shadow-2xl border border-slate-700 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-sky-300 mb-16 tracking-tight">{t('home.howItWorks.sectionTitle')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 px-6">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                <div className="bg-gradient-to-br from-sky-500 to-cyan-400 text-white rounded-full w-20 h-20 flex items-center justify-center text-4xl mb-6 shadow-lg">{step.icon}</div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{t(step.titleKey)}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t(step.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </section>

        <section  id="novel-showcase" className="py-12 md:py-16 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-sky-300 mb-12 tracking-tight">{t('home.showcase.sectionTitle')}</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {showcaseGenres.map(genre => (
              <button key={genre} onClick={() => setActiveFilter(genre)} className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98] shadow-md ${activeFilter === genre ? 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-400' : 'bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white focus:ring-slate-500'}`}>
                {genre} {/* Genre names from showcase are not translated yet */}
              </button>
            ))}
          </div>
          {filteredShowcases.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredShowcases.map((showcase, index) => (
                <div key={index} className={`p-8 ${showcase.bgColor} rounded-xl shadow-xl flex flex-col items-center text-white transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300`}>
                  <div className="text-6xl mb-5 opacity-80" aria-hidden="true">{showcase.imagePlaceholder}</div>
                  <h3 className="text-2xl font-bold mb-3 text-center text-slate-100">{showcase.title}</h3>
                  <p className="text-sm text-slate-300 text-center leading-relaxed mb-4">{showcase.blurb}</p>
                  <span className="text-xs bg-slate-900/50 px-3 py-1 rounded-full text-slate-300">{showcase.genre}</span>
                </div>
              ))}
            </div>
          ) : ( <p className="text-center text-slate-400">{t('home.showcase.noMatch')}</p> )}
        </section>

        <section id="testimonials" className="py-12 md:py-16 bg-slate-900 rounded-xl my-16 shadow-xl border border-slate-700 scroll-mt-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-sky-300 mb-4 tracking-tight">{t('home.testimonials.sectionTitle')}</h2>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              {t('home.testimonials.sectionDescription', { appTitle: t('appTitle') })}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 flex flex-col transform hover:-translate-y-1.5 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                  {testimonial.avatarPlaceholder && (
                    <div className="text-4xl mb-4 text-cyan-400 opacity-80">{testimonial.avatarPlaceholder}</div>
                  )}
                  <blockquote className="text-slate-300 italic leading-relaxed flex-grow">
                    "{t(testimonial.quoteKey)}"
                  </blockquote>
                  <footer className="mt-4 pt-4 border-t border-slate-700">
                    <p className="font-semibold text-sky-400">{t(testimonial.authorNameKey)}</p>
                    <p className="text-sm text-slate-400">{t(testimonial.authorTitleKey)}</p>
                  </footer>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="genre-tools-section-home" className="py-12 md:py-16 bg-slate-900 rounded-xl my-16 shadow-xl border border-slate-700 scroll-mt-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-sky-300 mb-4 tracking-tight">{t('home.genreTools.sectionTitle')}</h2>
            <p className="text-center text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('home.genreTools.sectionDescription', { appTitle: t('appTitle')})}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homePageGenreExamples.map((genreTool) => (
                <div key={genreTool.nameKey} className={`bg-slate-800 p-6 rounded-xl shadow-xl border-l-4 ${genreTool.colorClasses} flex flex-col transform hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300`}>
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4 text-slate-300 opacity-80">{genreTool.icon}</span>
                    <h3 className="text-2xl font-semibold text-slate-100">{t(genreTool.nameKey)}</h3>
                  </div>
                  <p className="text-slate-400 text-sm mb-3 leading-relaxed flex-grow">{t(genreTool.descriptionKey)}</p>
                  <div className="mt-auto pt-3 border-t border-slate-700">
                    <p className="text-sm font-medium text-sky-400 mb-1">{t('home.genreTools.toolFocusLabel')}:</p>
                    <p className="text-xs text-slate-300 leading-snug">{t(genreTool.toolFocusKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 p-8 bg-gradient-to-r from-sky-700 via-cyan-700 to-teal-700 rounded-xl shadow-2xl text-center border border-sky-600">
              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{t('home.genreTools.customPrompt.title')}</h3>
              <p className="text-sky-100 mb-6 max-w-xl mx-auto leading-relaxed">
                {t('home.genreTools.customPrompt.description')}
              </p>
              <button
                onClick={(e) => { e.preventDefault(); onNavigateToPricing();}}
                className="px-8 py-3 bg-white text-sky-600 font-semibold rounded-lg shadow-md hover:bg-slate-100 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-sky-700 active:scale-[0.98]"
              >
                {t('home.genreTools.customPrompt.cta')}
              </button>
            </div>
          </div>
        </section>

        <section id="seo-content-home" className="py-12 md:py-16 bg-slate-900 rounded-xl my-16 shadow-xl border border-slate-700 scroll-mt-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-sky-300 mb-6 text-center tracking-tight">{t('home.seoSection.title')}</h2>
            <div className="prose prose-slate prose-invert mx-auto text-slate-300 text-sm md:text-base leading-relaxed space-y-4">
              <p>{t('home.seoSection.paragraph1', { appTitle: t('appTitle') })}</p>
              <p>{t('home.seoSection.paragraph2', { appTitle: t('appTitle') })}</p>
              <p>{t('home.seoSection.paragraph3', { appTitle: t('appTitle') })}</p>
            </div>
          </div>
        </section>

        <section id="home-faqs" className="py-12 md:py-16 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-sky-300 mb-12 tracking-tight">{t('faqs.general.sectionTitle')}</h2>
            <div className="space-y-4">
              {GENERAL_FAQS.map((faq, index) => (
                <div key={index} className="bg-slate-800 rounded-lg shadow-md border border-slate-700">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full p-5 text-left hover:bg-slate-700/50 rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-800"
                    aria-expanded={openFaqIndex === index}
                    aria-controls={`faq-answer-home-${index}`}
                  >
                    <span className="text-md font-medium text-slate-100">{t(faq.questionKey)}</span>
                    <span className={`transform transition-transform duration-300 text-slate-400 ${openFaqIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div id={`faq-answer-home-${index}`} className="p-5 border-t border-slate-700">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{t(faq.answerKey)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full text-center py-10 border-t border-slate-700 bg-slate-900">
        <p className="text-sm text-slate-500">{t('footer.copyright', { year: new Date().getFullYear(), appTitle: t('appTitle') })} {t('footer.tagline')}</p>
        <div className="mt-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <button onClick={onNavigateToPrivacy} className="text-xs text-slate-400 hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.privacyPolicy')}</button>
            <button onClick={onNavigateToTerms} className="text-xs text-slate-400 hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.termsOfService')}</button>
            <button onClick={onNavigateToAbout} className="text-xs text-slate-400 hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.aboutUs')}</button>
            <button onClick={onNavigateToContact} className="text-xs text-slate-400 hover:text-sky-300 transition-colors duration-200 ease-in-out">{t('footer.contactUs')}</button>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <LanguagePicker />
            </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;