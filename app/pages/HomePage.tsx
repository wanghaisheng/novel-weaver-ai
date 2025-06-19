

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
const initialNovelShowcases = [ 
  { title: "The Last Stargazer", blurb: "In a dying universe...", imagePlaceholder: "🌌", bgColor: "bg-secondary border border-border", genre: "Sci-Fi"}, // Mapped to secondary
  { title: "Cyber-Soul City", blurb: "A detective with a bio-enhanced past...", imagePlaceholder: "🌃", bgColor: "bg-secondary border border-border", genre: "Cyberpunk"},
  { title: "The Clockwork Heart", blurb: "An inventor in a steampunk era creates an automaton with a human heart, leading to unforeseen emotional entanglements.", imagePlaceholder: "⚙️❤️", bgColor: "bg-secondary border border-border", genre: "Steampunk"},
  { title: "Echoes of the Void", blurb: "A lone ship adrift in uncharted space receives a cryptic message from a long-lost civilization.", imagePlaceholder: "🛰️", bgColor: "bg-secondary border border-border", genre: "Sci-Fi"},
  { title: "The Dragon's Oracle", blurb: "A young village girl discovers she can communicate with ancient dragons, a power that could save or doom her kingdom.", imagePlaceholder: "🐲", bgColor: "bg-secondary border border-border", genre: "Fantasy"},
  { title: "Neon City Blues", blurb: "In the sprawling metropolis of Neo-Veridia, a private investigator uncovers a conspiracy that reaches the highest echelons of corporate power.", imagePlaceholder: "🏙️✨", bgColor: "bg-secondary border border-border", genre: "Cyberpunk"}
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
  colorClasses: string; // Keep this for specific border colors if not directly mapped to primary/accent
}

const homePageGenreExamples: HomePageGenreTool[] = [
  { nameKey: "home.genreTools.sciFi.name", icon: "🚀", descriptionKey: "home.genreTools.sciFi.description", toolFocusKey: "home.genreTools.sciFi.toolFocus", colorClasses: "border-primary hover:shadow-primary/10" },
  { nameKey: "home.genreTools.fantasy.name", icon: "🐉", descriptionKey: "home.genreTools.fantasy.description", toolFocusKey: "home.genreTools.fantasy.toolFocus", colorClasses: "border-purple-500 hover:shadow-purple-500/10" }, // Keep purple or map to accent
  { nameKey: "home.genreTools.mystery.name", icon: "🔍", descriptionKey: "home.genreTools.mystery.description", toolFocusKey: "home.genreTools.mystery.toolFocus", colorClasses: "border-amber-500 hover:shadow-amber-500/10" } // Keep amber or map to accent
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
  const baseClasses = `transition-all duration-200 ease-in-out px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98]`;
  const typeClasses = isButton
    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/30 focus:ring-ring'
    : 'text-muted-foreground hover:text-primary focus:ring-ring';

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
  const { t } = useTranslation(); 
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const showcaseGenres = useMemo(() => {
    const uniqueGenres = new Set(initialNovelShowcases.map(s => s.genre));
    return ['All', ...Array.from(uniqueGenres)]; 
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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 bg-secondary shadow-xl sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <NavLink href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
            <span className="text-2xl font-extrabold text-primary hover:text-primary/90 transition-colors tracking-tight">{t('appTitle')}</span>
          </NavLink>
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink href="#key-features">{t('navigation.features')}</NavLink>
            <NavLink href="#how-it-works-home">{t('navigation.howItWorks')}</NavLink>
            <NavLink href="#testimonials">{t('navigation.testimonials')}</NavLink>
            <NavLink href="#genre-tools-section-home">{t('navigation.genreTools')}</NavLink>

            <div className="relative">
              <button ref={megaMenuTriggerRef} onClick={() => setIsMegaMenuOpen(prev => !prev)} aria-expanded={isMegaMenuOpen} aria-haspopup="true" className="flex items-center space-x-1 transition-all duration-200 ease-in-out px-4 py-2 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background text-muted-foreground hover:text-primary focus:ring-ring">
                <span>{t('navigation.toolsMegaMenu')}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'transform rotate-180' : ''}`} />
              </button>
              {isMegaMenuOpen && (
                <div ref={megaMenuRef} className="absolute top-full mt-2 w-screen max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl -translate-x-1/2 left-1/2 sm:left-auto sm:translate-x-0 sm:right-0 origin-top-right bg-card border border-border rounded-lg shadow-2xl p-6 z-40" style={{ animation: 'fadeInScaleUp 0.2s ease-out forwards' }}>
                   <style>{`@keyframes fadeInScaleUp { from { opacity: 0; transform: scale(0.95) translateY(-10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
                  <h3 className="text-xl font-semibold text-primary mb-1 px-1">{t('home.megaMenu.title')}</h3>
                  <p className="text-xs text-muted-foreground mb-4 px-1">{t('home.megaMenu.description')}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {genresForMegaMenu.map(genre => (
                      <a key={genre.nameKey} href="#" onClick={(e) => { e.preventDefault(); alert(t('home.megaMenu.alertAccessingTools', { genreName: t(genre.nameKey) })); setIsMegaMenuOpen(false); }} className="group block p-4 bg-secondary hover:bg-accent/80 rounded-lg transition-all duration-200 ease-in-out border border-border hover:border-primary/50 hover:shadow-lg">
                        <div className="flex items-center space-x-3 mb-1.5"><span className="text-3xl opacity-80 group-hover:opacity-100 transition-opacity">{genre.icon}</span><span className="font-semibold text-foreground group-hover:text-primary transition-colors">{t(genre.nameKey)}</span></div>
                        <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors leading-snug">{t(genre.descriptionKey)}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <NavLink href="#" onClick={(e) => { e.preventDefault(); onNavigateToPricing();}}>{t('navigation.pricing')}</NavLink> 
            {currentUser ? (
                <>
                    <span className="px-4 py-2 text-sm text-muted-foreground truncate max-w-[150px]" title={currentUser.email}>{currentUser.email}</span>
                    <NavLink onClick={(e) => { e.preventDefault(); onSignOut();}} className="bg-secondary hover:bg-accent text-foreground hover:text-accent-foreground focus:ring-ring">{t('navigation.signOut')}</NavLink>
                </>
            ) : (
                <>
                    <NavLink onClick={(e) => { e.preventDefault(); onNavigateToSignIn();}}>{t('navigation.signIn')}</NavLink>
                    <NavLink onClick={(e) => { e.preventDefault(); onNavigateToSignUp();}} isButton={true}>{t('navigation.signUp')}</NavLink>
                </>
            )}
          </nav>
          <div className="md:hidden"> 
            <button onClick={handleStartCreatingClick} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] transition-all duration-200 ease-in-out">
              {t('home.hero.createNovelNow')}
            </button>
          </div>
        </div>
      </header>

      <section className="w-full py-20 md:py-28 px-4 text-center relative overflow-hidden hero-gradient"> {/* hero-gradient class applied */}
         <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground relative z-10">{t('home.hero.welcome')} <span className="gradient-text">{t('appTitle')}!</span></h1>
        <p className="text-lg sm:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto relative z-10 leading-relaxed">{t('home.hero.tagline')}</p>
         <button onClick={handleStartCreatingClick} className="mt-10 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold rounded-lg shadow-lg hover:shadow-primary/40 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] relative z-10" aria-label={t('home.hero.createNovelNowAriaLabel')}>
            {t('home.hero.createNovelNow')}
          </button>
      </section>

      <main className="container mx-auto px-4 py-12 flex-grow">
        <section id="key-features" className="py-12 md:py-16 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-primary mb-16 tracking-tight">{t('home.features.sectionTitle', { appTitle: t('appTitle') })}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyFeatures.map((feature) => (
              <div key={feature.titleKey} className="bg-card p-8 rounded-xl shadow-xl border border-border text-center transform hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 hover:border-accent transition-all duration-300">
                <div className="text-5xl mb-6 text-primary">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{t(feature.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(feature.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works-home" className="py-12 md:py-16 bg-secondary rounded-xl my-16 shadow-2xl border border-border scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-primary mb-16 tracking-tight">{t('home.howItWorks.sectionTitle')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 px-6">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center text-4xl mb-6 shadow-lg">{step.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t(step.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(step.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </section>

        <section  id="novel-showcase" className="py-12 md:py-16 scroll-mt-20">
          <h2 className="text-3xl font-bold text-center text-primary mb-12 tracking-tight">{t('home.showcase.sectionTitle')}</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {showcaseGenres.map(genre => (
              <button key={genre} onClick={() => setActiveFilter(genre)} className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] shadow-md ${activeFilter === genre ? 'bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-ring' : 'bg-secondary hover:bg-accent text-foreground hover:text-accent-foreground focus:ring-ring'}`}>
                {genre} 
              </button>
            ))}
          </div>
          {filteredShowcases.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredShowcases.map((showcase, index) => (
                <div key={index} className={`p-8 ${showcase.bgColor} rounded-xl shadow-xl flex flex-col items-center text-foreground transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300`}>
                  <div className="text-6xl mb-5 opacity-80" aria-hidden="true">{showcase.imagePlaceholder}</div>
                  <h3 className="text-2xl font-bold mb-3 text-center text-foreground">{showcase.title}</h3>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed mb-4">{showcase.blurb}</p>
                  <span className="text-xs bg-background/50 px-3 py-1 rounded-full text-muted-foreground">{showcase.genre}</span>
                </div>
              ))}
            </div>
          ) : ( <p className="text-center text-muted-foreground">{t('home.showcase.noMatch')}</p> )}
        </section>

        <section id="testimonials" className="py-12 md:py-16 bg-secondary rounded-xl my-16 shadow-xl border border-border scroll-mt-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-primary mb-4 tracking-tight">{t('home.testimonials.sectionTitle')}</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t('home.testimonials.sectionDescription', { appTitle: t('appTitle') })}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-card p-6 rounded-xl shadow-xl border border-border flex flex-col transform hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                  {testimonial.avatarPlaceholder && (
                    <div className="text-4xl mb-4 text-primary opacity-80">{testimonial.avatarPlaceholder}</div>
                  )}
                  <blockquote className="text-foreground italic leading-relaxed flex-grow">
                    "{t(testimonial.quoteKey)}"
                  </blockquote>
                  <footer className="mt-4 pt-4 border-t border-border">
                    <p className="font-semibold text-primary">{t(testimonial.authorNameKey)}</p>
                    <p className="text-sm text-muted-foreground">{t(testimonial.authorTitleKey)}</p>
                  </footer>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="genre-tools-section-home" className="py-12 md:py-16 bg-secondary rounded-xl my-16 shadow-xl border border-border scroll-mt-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-primary mb-4 tracking-tight">{t('home.genreTools.sectionTitle')}</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('home.genreTools.sectionDescription', { appTitle: t('appTitle')})}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homePageGenreExamples.map((genreTool) => (
                <div key={genreTool.nameKey} className={`bg-card p-6 rounded-xl shadow-xl border-l-4 ${genreTool.colorClasses} flex flex-col transform hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300`}>
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4 text-foreground opacity-80">{genreTool.icon}</span>
                    <h3 className="text-2xl font-semibold text-foreground">{t(genreTool.nameKey)}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed flex-grow">{t(genreTool.descriptionKey)}</p>
                  <div className="mt-auto pt-3 border-t border-border">
                    <p className="text-sm font-medium text-primary mb-1">{t('home.genreTools.toolFocusLabel')}:</p>
                    <p className="text-xs text-foreground leading-snug">{t(genreTool.toolFocusKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 p-8 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-xl shadow-2xl text-center border border-primary/70"> {/* Gradient based on primary */}
              <h3 className="text-2xl font-bold text-primary-foreground mb-3 tracking-tight">{t('home.genreTools.customPrompt.title')}</h3>
              <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto leading-relaxed">
                {t('home.genreTools.customPrompt.description')}
              </p>
              <button
                onClick={(e) => { e.preventDefault(); onNavigateToPricing();}}
                className="px-8 py-3 bg-background text-primary font-semibold rounded-lg shadow-md hover:bg-background/90 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary active:scale-[0.98]"
              >
                {t('home.genreTools.customPrompt.cta')}
              </button>
            </div>
          </div>
        </section>

        <section id="seo-content-home" className="py-12 md:py-16 bg-secondary rounded-xl my-16 shadow-xl border border-border scroll-mt-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center tracking-tight">{t('home.seoSection.title')}</h2>
            <div className="prose prose-sm md:prose-base mx-auto text-muted-foreground leading-relaxed space-y-4"> {/* Adjusted prose text color */}
              <p>{t('home.seoSection.paragraph1', { appTitle: t('appTitle') })}</p>
              <p>{t('home.seoSection.paragraph2', { appTitle: t('appTitle') })}</p>
              <p>{t('home.seoSection.paragraph3', { appTitle: t('appTitle') })}</p>
            </div>
          </div>
        </section>

        <section id="home-faqs" className="py-12 md:py-16 scroll-mt-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-primary mb-12 tracking-tight">{t('faqs.general.sectionTitle')}</h2>
            <div className="space-y-4">
              {GENERAL_FAQS.map((faq, index) => (
                <div key={index} className="bg-card rounded-lg shadow-md border border-border">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full p-5 text-left hover:bg-accent/50 rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-card"
                    aria-expanded={openFaqIndex === index}
                    aria-controls={`faq-answer-home-${index}`}
                  >
                    <span className="text-md font-medium text-foreground">{t(faq.questionKey)}</span>
                    <span className={`transform transition-transform duration-300 text-muted-foreground ${openFaqIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div id={`faq-answer-home-${index}`} className="p-5 border-t border-border">
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{t(faq.answerKey)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full text-center py-10 border-t border-border bg-secondary">
        <p className="text-sm text-muted-foreground">{t('footer.copyright', { year: new Date().getFullYear(), appTitle: t('appTitle') })} {t('footer.tagline')}</p>
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

export default HomePage;