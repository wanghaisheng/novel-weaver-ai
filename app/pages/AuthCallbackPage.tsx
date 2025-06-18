import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchUserProfile } from '../services/authService';
import type { User } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
// import { APP_TITLE } from '../constants'; // Removed

interface AuthCallbackPageProps {
  onSignInSuccess: (userData: { user: User; token: string }) => void;
  onNavigateHome: () => void;
  onNavigateToSignIn: (message?: string) => void;
}

const AuthCallbackPage: React.FC<AuthCallbackPageProps> = ({ onSignInSuccess, onNavigateHome, onNavigateToSignIn }) => {
  const { t } = useTranslation();
  const [statusMessage, setStatusMessage] = useState(t('authCallbackPage.processing'));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[AuthCallbackPage.tsx] Mounted. Processing authentication...');
    const processAuth = async () => {
      try {
        const hash = window.location.hash.substring(1); // Remove #
        console.log('[AuthCallbackPage.tsx] URL hash:', hash);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const errorParam = params.get('error');
        const errorDescriptionParam = params.get('error_description');

        if (errorParam) {
          throw new Error(errorDescriptionParam || errorParam || t('authCallbackPage.errors.oauthProviderError'));
        }

        if (!accessToken) {
          throw new Error(t('authCallbackPage.errors.tokenNotFound'));
        }
        
        console.log('[AuthCallbackPage.tsx] Access token found:', accessToken ? 'Yes (length ' + accessToken.length + ')' : 'No');

        setStatusMessage(t('authCallbackPage.verifyingToken'));
        console.log('[AuthCallbackPage.tsx] Fetching user profile with access token...');
        const userProfile = await fetchUserProfile(accessToken);
        console.log('[AuthCallbackPage.tsx] User profile fetched successfully:', userProfile);
        
        onSignInSuccess({ user: userProfile, token: accessToken });
        console.log('[AuthCallbackPage.tsx] Authentication successful, calling onSignInSuccess.');

      } catch (err) {
        console.error("[AuthCallbackPage.tsx] Auth callback error:", err);
        const errorMessage = err instanceof Error ? err.message : t('authCallbackPage.errors.unknownError');
        setError(errorMessage);
        setStatusMessage(t('authCallbackPage.failed', { error: errorMessage }));
        setTimeout(() => {
          console.log('[AuthCallbackPage.tsx] Navigating to SignInPage due to error.');
          onNavigateToSignIn(t('authCallbackPage.signInRetryMessage', { error: errorMessage }));
        }, 3000);
      }
    };

    processAuth();
  }, [onSignInSuccess, onNavigateToSignIn, t]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 cursor-pointer" onClick={() => { console.log('[AuthCallbackPage.tsx] App title clicked, navigating home.'); onNavigateHome(); }}>
          <h1 className="text-4xl font-extrabold text-sky-400 hover:text-sky-300 transition-colors tracking-tight">
            {t('appTitle')}
          </h1>
        </div>
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 space-y-6">
          {!error && <LoadingSpinner />}
          <p className={`text-lg ${error ? 'text-red-400' : 'text-slate-300'}`}>
            {statusMessage}
          </p>
          {error && (
            <button
              onClick={() => { console.log('[AuthCallbackPage.tsx] "Try Signing In Again" clicked.'); onNavigateToSignIn(); }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 active:scale-[0.98] transition-colors"
            >
              {t('authCallbackPage.buttons.trySignInAgain')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;