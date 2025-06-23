

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TOOL_PAGE_SECTIONS, NOVEL_EDITOR_SUB_SECTIONS } from '../../constants';
import type { ToolSectionId, User } from '../../types';
// TextInput is not used here anymore directly.

interface ToolSidebarProps {
  activeToolId: ToolSectionId;
  activeDisplayId: string;
  userApiKey: string | null; 
  onSetUserApiKey: (key: string | null) => void; 
  onSelectNavigation: (toolId: ToolSectionId, displayId: string) => void;
  onNavigateHome: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentUser: (User & { token: string }) | null;
  onSignOut: () => void;
}

export const ToolSidebar: React.FC<ToolSidebarProps> = ({
  activeToolId,
  activeDisplayId,
  userApiKey,
  onSetUserApiKey,
  onSelectNavigation,
  onNavigateHome,
  isCollapsed,
  onToggleCollapse,
  currentUser,
  onSignOut
}) => {
  const { t } = useTranslation();
  const [localApiKeyInput, setLocalApiKeyInput] = useState(userApiKey || '');
  const [apiKeyStatus, setApiKeyStatus] = useState('');

  const handleSaveApiKey = () => {
    onSetUserApiKey(localApiKeyInput.trim() || null);
    setApiKeyStatus(localApiKeyInput.trim() ? t('toolSidebar.apiKey.customSaved') : t('toolSidebar.apiKey.customCleared'));
    setTimeout(() => setApiKeyStatus(''), 3000);
  };

  const handleClearApiKey = () => {
    setLocalApiKeyInput('');
    onSetUserApiKey(null);
    setApiKeyStatus(t('toolSidebar.apiKey.customCleared'));
    setTimeout(() => setApiKeyStatus(''), 3000);
  };
  
  const sidebarStyles: React.CSSProperties = {
    backgroundColor: 'hsl(var(--sidebar-background))',
    color: 'hsl(var(--sidebar-foreground))',
    borderColor: 'hsl(var(--sidebar-border))',
  };

  const navButtonBase = `w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-150 ease-in-out group relative focus:outline-none focus:ring-2 focus:ring-offset-1`;
  const navButtonFocusRing = `focus:ring-[hsl(var(--sidebar-ring))] focus:ring-offset-[hsl(var(--sidebar-background))]`; 
  
  const getNavButtonDynamicStyles = (isActive: boolean): React.CSSProperties => {
    if (isActive) {
      return {
        backgroundColor: 'hsl(var(--sidebar-primary))',
        color: 'hsl(var(--sidebar-primary-foreground))',
      };
    }
    return {
      backgroundColor: 'transparent',
      color: 'hsl(var(--sidebar-foreground))',
    };
  };
  
  const getNavButtonHoverStyles = (isActive: boolean) => {
    return !isActive ? 'hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]' : '';
  };


  return (
    <div
      className={`flex flex-col h-full shadow-lg transition-all duration-300 ease-in-out border-r
                  ${isCollapsed ? 'w-16 md:w-20' : 'w-60 md:w-72'}`}
      style={sidebarStyles}
    >
      <div className={`p-3 border-b flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`} style={{borderColor: 'hsl(var(--sidebar-border))', height: '65px'}}>
        {!isCollapsed && (
          <div className="flex-grow min-w-0 cursor-pointer" onClick={() => { onNavigateHome();}} title={t('toolSidebar.backToHomeTitle', { appTitle: t('appTitle')})}>
            <h1 className="text-xl md:text-2xl font-extrabold truncate tracking-tight" style={{color: 'hsl(var(--sidebar-primary))'}}>
              {t('appTitle')}
            </h1>
            <p className="text-xs truncate" style={{color: 'hsl(var(--sidebar-foreground)/0.6)'}}>{t('toolSidebar.creativeStudio')}</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 ${navButtonFocusRing} ${getNavButtonHoverStyles(false)}`}
          aria-label={isCollapsed ? t('toolSidebar.expandAriaLabel') : t('toolSidebar.collapseAriaLabel')}
          title={isCollapsed ? t('toolSidebar.expandTitle') : t('toolSidebar.collapseTitle')}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 mx-auto" style={{color: 'hsl(var(--sidebar-foreground)/0.7)'}}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6" style={{color: 'hsl(var(--sidebar-foreground)/0.7)'}}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          )}
        </button>
      </div>

      <nav className={`flex-grow p-2 space-y-1.5 ${isCollapsed ? 'overflow-x-hidden' : 'overflow-y-auto'}`}>
        {TOOL_PAGE_SECTIONS.map((section) => (
          <React.Fragment key={section.id}>
            <button
              onClick={() => onSelectNavigation(section.id, section.id === 'novel-editor' ? (NOVEL_EDITOR_SUB_SECTIONS[0]?.id || 'novel-workflow-editor-section') : section.id)}
              className={`${navButtonBase} ${navButtonFocusRing} ${getNavButtonHoverStyles(activeToolId === section.id)} ${isCollapsed ? 'justify-center' : ''} ${activeToolId === section.id ? 'border-l-4' : ''}`}
              style={{
                ...getNavButtonDynamicStyles(activeToolId === section.id),
                borderColor: activeToolId === section.id ? 'hsl(var(--sidebar-primary))' : 'transparent',
              }}
              aria-current={activeToolId === section.id ? 'page' : undefined}
              title={isCollapsed ? t(section.titleKey) : undefined}
            >
              <span className="text-xl md:text-2xl" aria-hidden="true">{section.icon}</span>
              {!isCollapsed && <span className="font-medium text-sm md:text-base truncate">{t(section.titleKey)}</span>}
              {isCollapsed && <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-[hsl(var(--sidebar-border))]">{t(section.titleKey)}</span>}
            </button>
            {section.id === 'novel-editor' && activeToolId === 'novel-editor' && !isCollapsed && (
              <div className="pl-4 mt-1 space-y-1 ml-3 py-1" style={{borderLeft: `2px solid hsl(var(--sidebar-border)/0.5)`}}>
                {NOVEL_EDITOR_SUB_SECTIONS.map(subSection => (
                  <button key={subSection.id} onClick={() => onSelectNavigation('novel-editor', subSection.id)} 
                    className={`${navButtonBase} text-left ${navButtonFocusRing} ${getNavButtonHoverStyles(activeDisplayId === subSection.id)}`}
                    style={getNavButtonDynamicStyles(activeDisplayId === subSection.id)}
                    aria-current={activeDisplayId === subSection.id ? 'page' : undefined} title={t(subSection.titleKey)}>
                    <span className="text-lg" aria-hidden="true">{subSection.icon}</span>
                    <span className="font-normal text-xs md:text-sm truncate">{t(subSection.titleKey)}</span>
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

        {!isCollapsed && (
            <div className="mt-3 pt-3" style={{borderTop: `1px solid hsl(var(--sidebar-border))`}}>
                 <h3 className="px-3 text-xs font-semibold uppercase tracking-wider mb-1" style={{color: 'hsl(var(--sidebar-foreground)/0.6)'}}>{t('toolSidebar.navigationTitle')}</h3>
            </div>
        )}
         <button
            onClick={() => { onNavigateHome();}}
            className={`${navButtonBase} ${navButtonFocusRing} ${getNavButtonHoverStyles(false)} ${isCollapsed ? 'justify-center' : ''}`}
            style={getNavButtonDynamicStyles(false)}
            title={isCollapsed ? t('toolSidebar.homePageNavTitleCollapsed') : t('toolSidebar.homePageNavTitle')}
          >
            <span className="text-xl md:text-2xl" aria-hidden="true">🏠</span>
            {!isCollapsed && <span className="font-medium text-sm md:text-base truncate">{t('toolSidebar.homePageNavTitle')}</span>}
            {isCollapsed && <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-[hsl(var(--sidebar-border))]">{t('toolSidebar.homePageNavTitle')}</span>}
        </button>

        {!isCollapsed && (
          <div className="mt-3 pt-3" style={{borderTop: `1px solid hsl(var(--sidebar-border))`}}>
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider mb-2" style={{color: 'hsl(var(--sidebar-foreground)/0.6)'}}>{t('toolSidebar.settingsTitle')}</h3>
            <div className="px-3">
              <label htmlFor="userApiKeyInput" className="block text-sm font-medium mb-1.5" style={{color: 'hsl(var(--sidebar-foreground))'}}>{t('toolSidebar.apiKey.label')}</label>
              <input
                  type="password"
                  id="userApiKeyInput"
                  value={localApiKeyInput}
                  onChange={(e) => setLocalApiKeyInput(e.target.value)}
                  placeholder={t('toolSidebar.apiKey.placeholder')}
                  className={`w-full p-2.5 text-xs border rounded-lg shadow-sm focus:outline-none focus:ring-1 ${navButtonFocusRing}`}
                  style={{
                    backgroundColor: 'hsl(var(--sidebar-accent))', 
                    color: 'hsl(var(--sidebar-accent-foreground))',
                    borderColor: 'hsl(var(--sidebar-border))',
                    '--tw-ring-color': 'hsl(var(--sidebar-ring))' // For Tailwind focus ring compatibility
                  } as React.CSSProperties}
              />
              <div className="flex space-x-2 mt-2">
                  <button
                      onClick={handleSaveApiKey}
                      className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm focus:outline-none focus:ring-1 ${navButtonFocusRing} ${getNavButtonHoverStyles(false)}`}
                      style={{backgroundColor: 'hsl(var(--sidebar-primary))', color: 'hsl(var(--sidebar-primary-foreground))', '--tw-ring-color': 'hsl(var(--sidebar-ring))'}  as React.CSSProperties }
                  >
                      {t('toolSidebar.apiKey.saveButton')}
                  </button>
                  <button
                      onClick={handleClearApiKey}
                      className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm focus:outline-none focus:ring-1 ${navButtonFocusRing} ${getNavButtonHoverStyles(false)}`}
                      style={{backgroundColor: 'hsl(var(--sidebar-accent))', color: 'hsl(var(--sidebar-accent-foreground))', '--tw-ring-color': 'hsl(var(--sidebar-ring))'} as React.CSSProperties}
                  >
                      {t('toolSidebar.apiKey.clearButton')}
                  </button>
              </div>
              {apiKeyStatus && <p className="text-xs mt-2 italic" style={{color: 'hsl(var(--sidebar-primary))'}}>{apiKeyStatus}</p>}
              <p className="text-xs mt-2" style={{color: 'hsl(var(--sidebar-foreground)/0.6)'}}>
                  {t('toolSidebar.apiKey.description')}
              </p>
            </div>
          </div>
        )}
      </nav>

      <div className={`p-3 mt-auto ${isCollapsed ? 'overflow-x-hidden' : ''}`} style={{borderTop: `1px solid hsl(var(--sidebar-border))`}}>
        {currentUser && !isCollapsed && (
            <div className="mb-2 p-2 rounded-md" style={{backgroundColor: 'hsl(var(--sidebar-accent)/0.5)'}}>
                <p className="text-xs" style={{color: 'hsl(var(--sidebar-foreground)/0.7)'}}>{t('toolSidebar.user.signedInAs')}:</p>
                <p className="text-sm font-medium truncate" style={{color: 'hsl(var(--sidebar-primary))'}} title={currentUser.email}>{currentUser.email}</p>
            </div>
        )}
        {currentUser && (
            <button
            onClick={() => { onSignOut();}}
            className={`w-full text-sm py-2.5 px-3 rounded-lg transition-colors group relative focus:outline-none focus:ring-2 ${navButtonFocusRing}
                ${isCollapsed ? 'flex justify-center items-center' : ''}
            `}
            style={{
                backgroundColor: 'hsl(var(--sidebar-accent)/0.5)', 
                color: 'hsl(var(--sidebar-foreground))',
                '--tw-ring-color': 'hsl(var(--sidebar-ring))'
            } as React.CSSProperties}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'hsl(var(--destructive))'; e.currentTarget.style.color = 'hsl(var(--destructive-foreground))'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'hsl(var(--sidebar-accent)/0.5)'; e.currentTarget.style.color = 'hsl(var(--sidebar-foreground))'; }}
            title={isCollapsed ? t('toolSidebar.user.signOut') : undefined}
            >
            {isCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:text-destructive-foreground" style={{color: 'hsl(var(--sidebar-foreground)/0.7)'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
            ) : (
                <span className='flex items-center space-x-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                <span>{t('toolSidebar.user.signOut')}</span>
                </span>
            )}
            {isCollapsed && currentUser && (
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 border border-[hsl(var(--sidebar-border))]">
                    {t('toolSidebar.user.signOut')}
                </span>
                )}
            </button>
        )}
      </div>
    </div>
  );
};