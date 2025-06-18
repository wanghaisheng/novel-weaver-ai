
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NovelData, NovelStage, Stage1Data, Stage2Data, Stage3Data, CharacterProfile, Chapter, User, AppView } from './types';
import HomePage from './pages/HomePage';
import ToolPage from './pages/ToolPage';
import PricingPage from './pages/PricingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UpgradeModal from './components/UpgradeModal'; 
import { STAGE_INSTRUCTIONS } from './constants'; // Moved up as it's used in downloadNovel

const AUTH_USER_KEY = 'novelAuthUser';
const USER_API_KEY = 'userGeminiApiKey';

const getInitialNovelData = (t: (key: string) => string): NovelData => ({
  title: t('novel.defaultTitle'), 
  stage1: {
    coreIdea: '', genre: '', tone: '', targetAudience: '', theme: '', logline: '',
    characters: [] as CharacterProfile[],
    worldBuilding: { timeAndPlace: '', coreRules: '', socialStructure: '', keyLocations: '' },
  },
  stage2: {
    act1: { stasis: '', incitingIncident: '', debate: '', turningPoint1: '' },
    act2: { testsAlliesEnemies: '', midpoint: '', risingAction: '', allIsLost: '', turningPoint2: '' },
    act3: { runUpToClimax: '', climax: '', fallingAction: '', resolution: '' },
  },
  stage3: {
    chapters: [] as Chapter[],
    currentChapterPrompt: { 
        povCharacter: '', coreGoal: '', keyPlotPoints: '', 
        startingScene: '', endingScene: '', atmosphere: '', wordCount: undefined 
    }
  },
});

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentUser, setCurrentUser] = useState<(User & { token: string }) | null>(null);
  const [authLoading, setAuthLoading] = useState(true); 
  const [signInRedirectMessage, setSignInRedirectMessage] = useState<string | undefined>(undefined);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);

  const [currentStage, setCurrentStage] = useState<NovelStage>(NovelStage.FOUNDATION);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [novelData, setNovelData] = useState<NovelData>(() => {
    const initialData = getInitialNovelData(t);
    const savedData = localStorage.getItem('novelData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Perform a deep merge, preferring parsed data but ensuring structure from initialData
        return {
          ...initialData, // Start with initial structure
          ...parsed,      // Overwrite top-level keys with parsed data
          title: parsed.title || initialData.title, // Specific handling for title
          stage1: {
            ...initialData.stage1,
            ...(parsed.stage1 || {}),
            characters: Array.isArray(parsed.stage1?.characters) ? parsed.stage1.characters : initialData.stage1.characters,
            worldBuilding: { ...initialData.stage1.worldBuilding, ...(parsed.stage1?.worldBuilding || {}) }
          },
          stage2: {
            ...initialData.stage2,
            ...(parsed.stage2 || {}),
            act1: { ...initialData.stage2.act1, ...(parsed.stage2?.act1 || {}) },
            act2: { ...initialData.stage2.act2, ...(parsed.stage2?.act2 || {}) },
            act3: { ...initialData.stage2.act3, ...(parsed.stage2?.act3 || {}) }
          },
          stage3: {
            ...initialData.stage3,
            ...(parsed.stage3 || {}),
            chapters: Array.isArray(parsed.stage3?.chapters) ? parsed.stage3.chapters : initialData.stage3.chapters,
            currentChapterPrompt: { ...initialData.stage3.currentChapterPrompt, ...(parsed.stage3?.currentChapterPrompt || {}) }
          }
        };
      } catch (e) {
        console.error("Failed to parse novelData from localStorage or merge failed. Using initial data and clearing corrupted storage.", e);
        localStorage.removeItem('novelData'); // Clear corrupted data to prevent future errors
      }
    }
    return initialData;
  });

  useEffect(() => {
    console.log('[App.tsx] useEffect - Initializing, currentView:', currentView, 'window.location.pathname:', window.location.pathname);
    if (window.location.pathname === '/auth/callback') {
      console.log('[App.tsx] Detected auth callback route.');
      setCurrentView('authCallback');
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    const storedUserApiKey = localStorage.getItem(USER_API_KEY);
    if (storedUserApiKey) {
      setUserApiKey(storedUserApiKey);
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('novelData', JSON.stringify(novelData));
  }, [novelData]);

  useEffect(() => {
    if (userApiKey === null) {
        localStorage.removeItem(USER_API_KEY);
    } else if (userApiKey) {
        localStorage.setItem(USER_API_KEY, userApiKey);
    }
  }, [userApiKey]);
  
  const BASE_URL = "https://novelweaver.deepseek.diy"; 

  const getCurrentPath = (view: AppView): string => {
    switch (view) {
      case 'home': return '/';
      case 'tool': return '/tool';
      case 'pricing': return '/pricing';
      case 'signIn': return '/signin';
      case 'signUp': return '/signup';
      case 'authCallback': return '/auth/callback';
      case 'privacy': return '/privacy-policy';
      case 'terms': return '/terms-of-service';
      case 'about': return '/about-us';
      case 'contact': return '/contact-us';
      default: return '/';
    }
  };

  const generateLdJson = (view: AppView, title: string, description: string, path: string, novelTitleProp?: string): string => {
    const url = `${BASE_URL}${path}`;
    const currentLanguage = i18n.language.split('-')[0]; 
    const baseData: any = { 
        "@context": "https://schema.org",
        "name": title,
        "description": description,
        "url": url,
        "inLanguage": currentLanguage,
    };

    if (view === 'home') {
      return JSON.stringify({
        ...baseData,
        "@type": "WebSite",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${BASE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      });
    }
    
    let pageType = "WebPage";
    let additionalProps: any = {
      "isPartOf": {
        "@type": "WebSite",
        "url": BASE_URL,
        "name": t('appTitle')
      }
    };

    if (view === 'tool' && novelTitleProp) {
      pageType = "CreativeWork"; 
      additionalProps.headline = novelTitleProp;
      additionalProps.author = { "@type": "Person", "name": t('ldJson.userPlaceholder') };
    } else if (view === 'pricing') {
      pageType = "Product";
      additionalProps.offers = {
        "@type": "Offer",
        "priceCurrency": "USD", 
        "price": t('ldJson.seePlans')
      };
    }
    
    return JSON.stringify({
      ...baseData,
      "@type": pageType,
      ...additionalProps
    });
  };


  useEffect(() => {
    const metaDescriptionTag = document.getElementById('meta-description') as HTMLMetaElement | null;
    const canonicalLinkTag = document.getElementById('canonical-link') as HTMLLinkElement | null;
    const ldJsonScriptTag = document.getElementById('ld-json-script') as HTMLScriptElement | null;
    const htmlTag = document.documentElement;

    htmlTag.lang = i18n.language;

    let title = `${t('appTitle')} - ${t('seo.defaultTagline')}`;
    let description = t('seo.defaultDescription');
    const path = getCurrentPath(currentView);
    let pageNovelTitle = novelData.title;

    switch (currentView) {
      case 'home':
        title = `${t('appTitle')} | ${t('seo.home.titleSuffix')}`;
        description = t('seo.home.description');
        break;
      case 'tool':
        const toolStageTitle = STAGE_INSTRUCTIONS[currentStage] ? t(STAGE_INSTRUCTIONS[currentStage].titleKey) : currentStage;
        const toolTitle = pageNovelTitle ? `${pageNovelTitle} - ${toolStageTitle} | ${t('appTitle')}` : `${t('seo.tool.defaultTitle')} | ${t('appTitle')}`;
        title = toolTitle;
        description = t('seo.tool.description', { novelTitle: pageNovelTitle || t('seo.tool.yourNovel'), currentStage: toolStageTitle });
        break;
      case 'pricing':
        title = `${t('seo.pricing.title')} | ${t('appTitle')}`;
        description = t('seo.pricing.description', { appTitle: t('appTitle') });
        break;
      case 'signIn':
        title = `${t('seo.signIn.title')} | ${t('appTitle')}`;
        description = t('seo.signIn.description', { appTitle: t('appTitle') });
        break;
      case 'signUp':
        title = `${t('seo.signUp.title')} | ${t('appTitle')}`;
        description = t('seo.signUp.description', { appTitle: t('appTitle') });
        break;
      case 'authCallback':
        title = `${t('seo.authCallback.title')} | ${t('appTitle')}`;
        description = t('seo.authCallback.description', { appTitle: t('appTitle') });
        break;
      case 'privacy':
        title = `${t('seo.privacy.title')} | ${t('appTitle')}`;
        description = t('seo.privacy.description', { appTitle: t('appTitle') });
        break;
      case 'terms':
        title = `${t('seo.terms.title')} | ${t('appTitle')}`;
        description = t('seo.terms.description', { appTitle: t('appTitle') });
        break;
      case 'about':
        title = `${t('seo.about.title')} | ${t('appTitle')}`;
        description = t('seo.about.description', { appTitle: t('appTitle') });
        break;
      case 'contact':
        title = `${t('seo.contact.title')} | ${t('appTitle')}`;
        description = t('seo.contact.description', { appTitle: t('appTitle') });
        break;
    }

    document.title = title;
    if (metaDescriptionTag) metaDescriptionTag.content = description;
    if (canonicalLinkTag) canonicalLinkTag.href = `${BASE_URL}${path}`;
    if (ldJsonScriptTag) {
        ldJsonScriptTag.textContent = generateLdJson(currentView, title, description, path, currentView === 'tool' ? pageNovelTitle : undefined);
    }

  }, [currentView, novelData.title, currentStage, i18n.language, t]); 

  useEffect(() => {
    console.log(`[App.tsx] currentView changed to: ${currentView}`);
  }, [currentView]);

  useEffect(() => {
    console.log(`[App.tsx] currentUser changed to:`, currentUser);
  }, [currentUser]);

  const handleSetNovelData = useCallback((data: NovelData | ((prevData: NovelData) => NovelData)) => {
    setNovelData(data);
  }, []);

  const updateStage1Data = useCallback((s1Data: Stage1Data) => {
    setNovelData(prev => ({ ...prev, stage1: s1Data }));
  }, []);

  const updateStage2Data = useCallback((s2Data: Stage2Data) => {
    setNovelData(prev => ({ ...prev, stage2: s2Data }));
  }, []);

  const updateStage3Data = useCallback((s3Data: Stage3Data) => {
    setNovelData(prev => ({ ...prev, stage3: s3Data }));
  }, []);
  
  const handleChapterUpdate = useCallback((chapterId: string, updatedContent: string) => {
    setNovelData(prev => ({
      ...prev,
      stage3: {
        ...prev.stage3,
        chapters: prev.stage3.chapters.map(c => 
          c.id === chapterId ? { ...c, content: updatedContent, isWriting: false } : c
        ),
      }
    }));
  }, []);

  const handleChapterGenerateStart = useCallback((chapterId: string) => {
     setNovelData(prev => ({
      ...prev,
      stage3: {
        ...prev.stage3,
        chapters: prev.stage3.chapters.map(c => 
          c.id === chapterId ? { ...c, isWriting: true } : c
        ),
      }
    }));
  }, []);
  
  const handleChapterGenerateEnd = useCallback((chapterId: string, content: string) => {
     setNovelData(prev => ({
      ...prev,
      stage3: {
        ...prev.stage3,
        chapters: prev.stage3.chapters.map(c => 
          c.id === chapterId ? { ...c, content: content, isWriting: false } : c
        ),
      }
    }));
  }, []);

  const downloadNovel = useCallback(() => {
    console.log('[App.tsx] downloadNovel called.');
    let content = `${t('download.title')}: ${novelData.title}\n\n`; 
    content += `## ${t(STAGE_INSTRUCTIONS[NovelStage.FOUNDATION].titleKey)} ##\n`; 
    content += `${t('download.stage1.coreIdea')}: ${novelData.stage1.coreIdea}\n`;
    content += `${t('download.stage1.genre')}: ${novelData.stage1.genre}, ${t('download.stage1.tone')}: ${novelData.stage1.tone}\n`;
    content += `${t('download.stage1.targetAudience')}: ${novelData.stage1.targetAudience}\n`;
    content += `${t('download.stage1.theme')}: ${novelData.stage1.theme}\n`;
    content += `${t('download.stage1.logline')}: ${novelData.stage1.logline}\n\n`;
    content += `### ${t('download.stage1.characters')} ###\n`;
    novelData.stage1.characters.forEach(char => {
      content += `${t('download.character.name')}: ${char.name} (${char.role})\n`;
      Object.entries(char).forEach(([key, value]) => {
        if (key !== 'id' && key !== 'name' && key !== 'role' && value) {
          const translatedKey = t(`download.character.fields.${key}`, { defaultValue: key.charAt(0).toUpperCase() + key.slice(1) });
          content += `  ${translatedKey}: ${value}\n`;
        }
      });
      content += "\n";
    });
    content += `### ${t('download.stage1.worldBuilding')} ###\n`;
    Object.entries(novelData.stage1.worldBuilding).forEach(([key, value]) => {
       if (value) {
        const translatedKey = t(`download.worldBuilding.fields.${key}`, { defaultValue: key.charAt(0).toUpperCase() + key.slice(1) });
        content += `${translatedKey}: ${value}\n`;
       }
    });

    content += `\n## ${t(STAGE_INSTRUCTIONS[NovelStage.OUTLINE].titleKey)} ##\n`;
    for (const actKey in novelData.stage2) {
      content += `\n### ${t(`download.stage2.actKey.${actKey}`, {defaultValue: actKey.toUpperCase()})} ###\n`;
      const act = novelData.stage2[actKey as keyof Stage2Data];
      for (const plotPointKey in act) {
         const translatedKey = t(`download.stage2.plotPointKey.${plotPointKey}`, { defaultValue: plotPointKey.charAt(0).toUpperCase() + plotPointKey.slice(1).replace(/([A-Z])/g, ' $1').trim() });
        content += `${translatedKey}: ${(act as any)[plotPointKey]}\n`;
      }
    }

    content += `\n## ${t(STAGE_INSTRUCTIONS[NovelStage.WRITING].titleKey)} ##\n`;
    novelData.stage3.chapters.sort((a, b) => a.number - b.number).forEach(chapter => {
      content += `\n### ${t('download.stage3.chapter')} ${chapter.number}: ${chapter.title} ###\n`;
      content += `${t('download.stage3.pov')}: ${chapter.povCharacter}\n`;
      content += `${t('download.stage3.goal')}: ${chapter.coreGoal}\n`;
      content += `${t('download.stage3.keyPlotPoints')}: ${chapter.keyPlotPoints}\n`;
      content += `${t('download.stage3.startingScene')}: ${chapter.startingScene}\n`;
      content += `${t('download.stage3.endingScene')}: ${chapter.endingScene}\n`;
      content += `${t('download.stage3.atmosphere')}: ${chapter.atmosphere}\n`;
      if (chapter.wordCount) content += `${t('download.stage3.targetWordCount')}: ${chapter.wordCount}\n`;
      content += "\n---\n";
      content += `${chapter.content}\n`;
      content += "---\n";
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const sanitizedTitle = novelData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${sanitizedTitle || t('download.defaultFilename')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [novelData, t]); 

  const navigateToHome = useCallback(() => setCurrentView('home'), []);
  const navigateToTool = useCallback(() => setCurrentView('tool'), []);
  const navigateToPricing = useCallback(() => setCurrentView('pricing'), []);
  const navigateToSignIn = useCallback((message?: string) => { 
    setSignInRedirectMessage(message);
    setCurrentView('signIn'); 
  }, []);
  const navigateToSignUp = useCallback(() => setCurrentView('signUp'), []);
  const navigateToPrivacy = useCallback(() => setCurrentView('privacy'), []);
  const navigateToTerms = useCallback(() => setCurrentView('terms'), []);
  const navigateToAbout = useCallback(() => setCurrentView('about'), []);
  const navigateToContact = useCallback(() => setCurrentView('contact'), []);


  const handleSignInSuccess = useCallback((userData: { user: User; token: string }) => {
    const userWithToken = { ...userData.user, token: userData.token };
    setCurrentUser(userWithToken);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithToken));
    setCurrentView('tool'); 
  }, []);
  
  const handleSignOut = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
    setCurrentView('home'); 
  }, []);

  const handleUpgradeModalClick = () => {
    setShowUpgradeModal(false);
    if (!currentUser) {
      navigateToSignIn(t('upgradeModal.signInPrompt'));
    } else {
      navigateToPricing();
    }
  };

  const handleSetUserApiKey = useCallback((key: string | null) => {
    setUserApiKey(key);
  }, []);

  if (authLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xl">{t('loading.application')}</div>;
  }

  const commonPageProps = {
    onNavigateToPrivacy: navigateToPrivacy,
    onNavigateToTerms: navigateToTerms,
    onNavigateToAbout: navigateToAbout,
    onNavigateToContact: navigateToContact,
  };

  if (currentView === 'home') {
    return <HomePage 
              onStartCreating={navigateToTool} 
              onNavigateToPricing={navigateToPricing}
              currentUser={currentUser}
              onSignOut={handleSignOut}
              onNavigateToSignIn={navigateToSignIn}
              onNavigateToSignUp={navigateToSignUp}
              onNavigateToPrivacy={navigateToPrivacy}
              onNavigateToTerms={navigateToTerms}
              onNavigateToAbout={navigateToAbout}
              onNavigateToContact={navigateToContact}
            />;
  }
  if (currentView === 'tool') {
    return <ToolPage 
              novelData={novelData} 
              currentStage={currentStage} 
              userApiKey={userApiKey} 
              onSetUserApiKey={handleSetUserApiKey} 
              onSetNovelData={handleSetNovelData} 
              onSetCurrentStage={setCurrentStage}
              onUpdateStage1Data={updateStage1Data}
              onUpdateStage2Data={updateStage2Data}
              onUpdateStage3Data={updateStage3Data}
              onChapterUpdate={handleChapterUpdate}
              onChapterGenerateStart={handleChapterGenerateStart}
              onChapterGenerateEnd={handleChapterGenerateEnd}
              onDownloadNovel={downloadNovel}
              onNavigateHome={navigateToHome}
              currentUser={currentUser}
              onSignOut={handleSignOut}
              onNavigateToPrivacy={navigateToPrivacy}
              onNavigateToTerms={navigateToTerms}
              onNavigateToAbout={navigateToAbout}
              onNavigateToContact={navigateToContact}
           />;
  }
  if (currentView === 'pricing') {
    return <PricingPage 
                onNavigateHome={navigateToHome} 
                onStartCreating={navigateToTool} 
                currentUser={currentUser}
                onNavigateToSignIn={navigateToSignIn}
                onNavigateToPrivacy={navigateToPrivacy}
                onNavigateToTerms={navigateToTerms}
                onNavigateToAbout={navigateToAbout}
                onNavigateToContact={navigateToContact}
            />;
  }
  if (currentView === 'signIn') {
    return <SignInPage 
                onSignInSuccess={handleSignInSuccess} 
                onNavigateToSignUp={navigateToSignUp} 
                onNavigateHome={navigateToHome}
                initialMessage={signInRedirectMessage}
            />;
  }
  if (currentView === 'signUp') {
    return <SignUpPage 
                onNavigateToSignIn={navigateToSignIn} 
                onNavigateHome={navigateToHome}
            />;
  }
  if (currentView === 'authCallback') {
    return <AuthCallbackPage 
                onSignInSuccess={handleSignInSuccess} 
                onNavigateHome={navigateToHome}
                onNavigateToSignIn={navigateToSignIn}
            />;
  }
  if (currentView === 'privacy') {
    return <PrivacyPage onNavigateHome={navigateToHome} {...commonPageProps} />;
  }
  if (currentView === 'terms') {
    return <TermsPage onNavigateHome={navigateToHome} {...commonPageProps} />;
  }
  if (currentView === 'about') {
    return <AboutPage onNavigateHome={navigateToHome} {...commonPageProps} />;
  }
  if (currentView === 'contact') {
    return <ContactPage onNavigateHome={navigateToHome} {...commonPageProps} />;
  }
  
  return (
    <>
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeClick={handleUpgradeModalClick}
      />
      <div className="text-center p-8 text-red-400">{t('error.unknownView')} <button onClick={navigateToHome} className="underline">{t('navigation.goHome')}</button></div>
    </>
  );
};

export default App;
