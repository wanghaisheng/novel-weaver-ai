
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TOOL_PAGE_SECTIONS, NOVEL_EDITOR_SUB_SECTIONS } from '../../constants';
import type { ToolSectionId, User } from '../../types';
import { TextInput } from '../common/TextInput'; 

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
  
  return (
    <div
      className={`bg-slate-800 text-white flex flex-col h-full border-r border-slate-700 shadow-lg transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'w-16 md:w-20' : 'w-60 md:w-72'}`}
    >
      <div className={`p-4 border-b border-slate-700 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex-grow min-w-0">
            <h1 className="text-xl md:text-2xl font-extrabold text-sky-400 cursor-pointer truncate tracking-tight" onClick={() => { onNavigateHome();}} title={t('toolSidebar.backToHomeTitle', { appTitle: t('appTitle')})}>
              {t('appTitle')}
            </h1>
            <p className="text-xs text-slate-400 truncate">{t('toolSidebar.creativeStudio')}</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-2 rounded-md hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-800 ${isCollapsed ? 'w-full' : ''}`}
          aria-label={isCollapsed ? t('toolSidebar.expandAriaLabel') : t('toolSidebar.collapseAriaLabel')}
          title={isCollapsed ? t('toolSidebar.expandTitle') : t('toolSidebar.collapseTitle')}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 mx-auto text-slate-400 hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-slate-400 hover:text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          )}
        </button>
      </div>

      <nav className={`flex-grow p-2 space-y-1 ${isCollapsed ? 'overflow-x-hidden' : 'overflow-y-auto'}`}>
        {TOOL_PAGE_SECTIONS.map((section) => (
          <React.Fragment key={section.id}>
            <button
              onClick={() => onSelectNavigation(section.id, section.id)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out group relative focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-800 ${isCollapsed ? 'justify-center' : ''} ${activeDisplayId === section.id && activeToolId === section.id ? 'bg-sky-600 text-white shadow-md border-l-4 border-sky-400' : 'bg-transparent hover:bg-slate-700 text-slate-300 hover:text-white'}`}
              aria-current={activeDisplayId === section.id ? 'page' : undefined}
              title={isCollapsed ? t(section.titleKey) : undefined}
            >
              <span className="text-xl md:text-2xl" aria-hidden="true">{section.icon}</span>
              {!isCollapsed && <span className="font-medium text-sm md:text-base truncate">{t(section.titleKey)}</span>}
              {isCollapsed && <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-white bg-slate-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">{t(section.titleKey)}</span>}
            </button>
            {section.id === 'novel-editor' && activeToolId === 'novel-editor' && !isCollapsed && (
              <div className="pl-4 mt-1 space-y-1 border-l-2 border-slate-700 ml-3 py-1">
                {NOVEL_EDITOR_SUB_SECTIONS.map(subSection => (
                  <button key={subSection.id} onClick={() => onSelectNavigation('novel-editor', subSection.id)} className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md transition-all duration-200 ease-in-out group relative focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-800 text-left ${activeDisplayId === subSection.id ? 'bg-sky-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-600/70 hover:text-slate-200'}`} aria-current={activeDisplayId === subSection.id ? 'page' : undefined} title={t(subSection.titleKey)}>
                    <span className="text-lg" aria-hidden="true">{subSection.icon}</span>
                    <span className="font-normal text-xs md:text-sm truncate">{t(subSection.titleKey)}</span>
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

        {!isCollapsed && (
            <div className="mt-3 pt-3 border-t border-slate-700">
                 <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('toolSidebar.navigationTitle')}</h3>
            </div>
        )}
         <button
            onClick={() => { onNavigateHome();}}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ease-in-out group relative focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-800 ${isCollapsed ? 'justify-center' : ''} bg-transparent hover:bg-slate-700 text-slate-300 hover:text-white`}
            title={isCollapsed ? t('toolSidebar.homePageNavTitleCollapsed') : t('toolSidebar.homePageNavTitle')}
          >
            <span className="text-xl md:text-2xl" aria-hidden="true">🏠</span>
            {!isCollapsed && <span className="font-medium text-sm md:text-base truncate">{t('toolSidebar.homePageNavTitle')}</span>}
            {isCollapsed && <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-white bg-slate-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">{t('toolSidebar.homePageNavTitle')}</span>}
        </button>

        {!isCollapsed && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t('toolSidebar.settingsTitle')}</h3>
            <div className="px-3">
              <label htmlFor="userApiKeyInput" className="block text-sm font-medium text-slate-300 mb-1.5">{t('toolSidebar.apiKey.label')}</label>
              <input
                  type="password"
                  id="userApiKeyInput"
                  value={localApiKeyInput}
                  onChange={(e) => setLocalApiKeyInput(e.target.value)}
                  placeholder={t('toolSidebar.apiKey.placeholder')}
                  className="w-full p-2.5 text-xs border border-slate-600 rounded-lg bg-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
              />
              <div className="flex space-x-2 mt-2">
                  <button
                      onClick={handleSaveApiKey}
                      className="flex-1 px-3 py-1.5 text-xs bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-400"
                  >
                      {t('toolSidebar.apiKey.saveButton')}
                  </button>
                  <button
                      onClick={handleClearApiKey}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-600 hover:bg-slate-500 text-slate-200 font-semibold rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                  >
                      {t('toolSidebar.apiKey.clearButton')}
                  </button>
              </div>
              {apiKeyStatus && <p className="text-xs text-sky-300 mt-2 italic">{apiKeyStatus}</p>}
              <p className="text-xs text-slate-500 mt-2">
                  {t('toolSidebar.apiKey.description')}
              </p>
            </div>
          </div>
        )}
      </nav>

      <div className={`p-3 border-t border-slate-700 mt-auto ${isCollapsed ? 'overflow-x-hidden' : ''}`}>
        {currentUser && !isCollapsed && (
            <div className="mb-2 p-2 bg-slate-700/50 rounded-md">
                <p className="text-xs text-slate-400">{t('toolSidebar.user.signedInAs')}:</p>
                <p className="text-sm text-sky-300 font-medium truncate" title={currentUser.email}>{currentUser.email}</p>
            </div>
        )}
        {currentUser && (
            <button
            onClick={() => { onSignOut();}}
            className={`w-full text-sm py-2.5 px-3 rounded-lg transition-colors group relative hover:bg-red-700/80 bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-slate-800
                ${isCollapsed ? 'flex justify-center items-center' : 'text-slate-300 hover:text-white'}
            `}
            title={isCollapsed ? t('toolSidebar.user.signOut') : undefined}
            >
            {isCollapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 group-hover:text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
            ) : (
                <span className='flex items-center space-x-2'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                <span>{t('toolSidebar.user.signOut')}</span>
                </span>
            )}
            {isCollapsed && currentUser && (
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-white bg-slate-900 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {t('toolSidebar.user.signOut')}
                </span>
                )}
            </button>
        )}
      </div>
    </div>
  );
};