import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signUpUser, verifySignUpCode, OPENAUTH_SERVER_URL, OAUTH_REDIRECT_URI, OAUTH_CLIENT_ID } from '../services/authService';
// import { APP_TITLE } from '../constants'; // Removed
import { TextInput } from '../components/common/TextInput';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import type { OAuthProvider } from '../types';


interface SignUpPageProps {
  onNavigateToSignIn: (message?: string) => void;
  onNavigateHome: () => void;
}

type SignUpStep = 'register' | 'verify';

const oAuthProviders: { id: OAuthProvider; name: string; icon?: string, bgColor: string, textColor: string, hoverBgColor: string }[] = [
  { id: 'google', name: 'Google', bgColor: 'bg-red-600', hoverBgColor: 'hover:bg-red-700', textColor: 'text-white' },
  { id: 'microsoft', name: 'Microsoft', bgColor: 'bg-blue-600', hoverBgColor: 'hover:bg-blue-700', textColor: 'text-white' },
  { id: 'apple', name: 'Apple', bgColor: 'bg-black', hoverBgColor: 'hover:bg-gray-800', textColor: 'text-white' },
  { id: 'github', name: 'GitHub', bgColor: 'bg-gray-800', hoverBgColor: 'hover:bg-gray-900', textColor: 'text-white' },
];

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigateToSignIn, onNavigateHome }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<SignUpStep>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    console.log('[SignUpPage.tsx] Registration form submitted for email:', email);

    if (password !== confirmPassword) {
      console.warn('[SignUpPage.tsx] Passwords do not match.');
      setError(t('signUpPage.errors.passwordsMismatch'));
      return;
    }
    if (password.length < 6) {
        console.warn('[SignUpPage.tsx] Password too short.');
        setError(t('signUpPage.errors.passwordTooShort'));
        return;
    }

    setIsLoading(true);
    try {
      const response = await signUpUser({ email, password });
      console.log('[SignUpPage.tsx] Sign-up initiation successful:', response.message);
      setSuccessMessage(response.message || t('signUpPage.messages.verificationSent'));
      setCurrentStep('verify');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('signUpPage.errors.unknownInitiationError');
      console.error('[SignUpPage.tsx] Sign-up initiation error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    console.log('[SignUpPage.tsx] Verification form submitted for email:', email, 'code:', verificationCode);

    if (!verificationCode.trim()) {
        console.warn('[SignUpPage.tsx] Verification code empty.');
        setError(t('signUpPage.errors.codeEmpty'));
        return;
    }
    setIsLoading(true);
    try {
        const response = await verifySignUpCode({ email, code: verificationCode });
        console.log('[SignUpPage.tsx] Verification successful:', response.message);
        setSuccessMessage(response.message || t('signUpPage.messages.verificationSuccess'));
        setTimeout(() => {
            console.log('[SignUpPage.tsx] Navigating to Sign In after verification.');
            onNavigateToSignIn(t('signUpPage.messages.signInAfterVerification'));
        }, 2500);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('signUpPage.errors.unknownVerificationError');
        console.error('[SignUpPage.tsx] Verification error:', errorMessage);
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  const handleOAuthSignUp = (provider: OAuthProvider) => {
    console.log(`[SignUpPage.tsx] Attempting OAuth sign-up with provider: ${provider}`);
    const authUrl = `${OPENAUTH_SERVER_URL}/${provider}/authorize?response_type=token&client_id=${OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URI)}`;
    window.location.href = authUrl;
  };


  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 cursor-pointer" onClick={() => { console.log('[SignUpPage.tsx] App title clicked, navigating home.'); onNavigateHome();}}>
          <h1 className="text-4xl font-extrabold text-sky-400 hover:text-sky-300 transition-colors tracking-tight">
            {t('appTitle')}
          </h1>
          <p className="text-slate-400">
            {currentStep === 'register' ? t('signUpPage.titles.createAccount') : t('signUpPage.titles.verifyEmail')}
          </p>
        </div>

        {currentStep === 'register' && (
            <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 space-y-6">
              <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                <TextInput
                    label={t('signUpPage.labels.email')}
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('signUpPage.placeholders.email')}
                    autoComplete="email"
                />
                <TextInput
                    label={t('signUpPage.labels.password')}
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="new-password"
                    instruction={t('signUpPage.instructions.passwordMinLength')}
                />
                <TextInput
                    label={t('signUpPage.labels.confirmPassword')}
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="new-password"
                />

                {error && <p className="text-sm text-red-400 bg-red-900/50 border border-red-700 p-3 rounded-md text-center">{error}</p>}
                {successMessage && <p className="text-sm text-sky-300 bg-sky-900/50 border border-sky-700 p-3 rounded-md text-center">{successMessage}</p>}


                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70 transition-all duration-200 ease-in-out"
                >
                    {isLoading ? <LoadingSpinner /> : t('signUpPage.buttons.registerAndSendCode')}
                </button>
              </form>
              
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-400">{t('signUpPage.orSignUpWith')}</span>
                </div>
              </div>

              <div className="space-y-3">
                {oAuthProviders.map(provider => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleOAuthSignUp(provider.id)}
                    className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium ${provider.textColor} ${provider.bgColor} ${provider.hoverBgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 transition-colors duration-200`}
                  >
                    {provider.id === 'google' && <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /><path d="M1 1h22v22H1z" fill="none" /></svg>}
                    {provider.id === 'microsoft' && <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 22.5H2.6V13.7h8.8v8.8zm0-9.9H2.6V3.8h8.8v8.8zm9.9 9.9H12.5V13.7h8.8v8.8zm0-9.9H12.5V3.8h8.8v8.8z" /></svg>}
                    {provider.id === 'apple' && <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.22 6.55c-.56-.67-1.28-1.1-2.09-1.12-.05-.07-.12-.12-.19-.15-1.13-.53-2.61-.21-3.39.63-.39.42-.68.96-.86 1.5H10.6c-.19-.54-.48-1.08-.87-1.5-.78-.84-2.26-1.16-3.39-.63-.07.03-.14.08-.19.15-.81.02-1.53.45-2.09 1.12C2.17 8.07 2.02 10.16 3.1 11.75c.6.9 1.48 1.57 2.52 1.71.32.04.64-.01.95-.12.35.63.85 1.13 1.45 1.47.88.5 1.93.53 2.85.09.92-.44 1.56-1.25 1.76-2.21h.02c.2 1 .84 1.77 1.76 2.21.92.44 1.97.41 2.85-.09.6-.34 1.1-.84 1.45-1.47.31.11.63.16.95.12 1.04-.14 1.92-.81 2.52-1.71 1.08-1.59.93-3.68-.08-5.2zM12 2.18c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5z" /></svg>}
                    {provider.id === 'github' && <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1.27a11 11 0 00-3.48 21.46c.55.1.73-.24.73-.53v-1.84c-3 .65-3.64-1.45-3.64-1.45-.5-1.27-1.22-1.61-1.22-1.61-1-.68.08-.67.08-.67 1.11.08 1.69 1.14 1.69 1.14 1 .71 2.61.51 3.25.39.1-.3.39-.51.71-.63-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.97 0 0 .94-.3 3.08 1.14a10.5 10.5 0 015.62 0c2.14-1.44 3.08-1.14 3.08-1.14.61 1.55.23 2.69.11 2.97.71.78 1.15 1.78 1.15 3 0 4.29-2.61 5.24-5.1 5.52.4.34.76 1.01.76 2.02v2.96c0 .3.18.63.73.53A11 11 0 0012 1.27z" /></svg>}
                    {t('signUpPage.buttons.signUpWith', { providerName: provider.name })}
                  </button>
                ))}
              </div>

              <p className="text-sm text-center text-slate-400">
                  {t('signUpPage.alreadyHaveAccount')}{' '}
                  <button
                  type="button"
                  onClick={() => { console.log('[SignUpPage.tsx] Navigating to Sign In.'); onNavigateToSignIn();}}
                  className="font-medium text-sky-400 hover:text-sky-300 hover:underline focus:outline-none"
                  >
                  {t('signUpPage.buttons.signIn')}
                  </button>
              </p>
            </div>
        )}

        {currentStep === 'verify' && (
            <form
            onSubmit={handleVerificationSubmit}
            className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 space-y-6"
            >
            <p className="text-sm text-slate-300 text-center">
                {t('signUpPage.messages.codeSentTo', { email: email })}
            </p>
            <TextInput
                label={t('signUpPage.labels.verificationCode')}
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                placeholder={t('signUpPage.placeholders.verificationCode')}
                autoComplete="one-time-code"
            />
            
            {error && <p className="text-sm text-red-400 bg-red-900/50 border border-red-700 p-3 rounded-md text-center">{error}</p>}
            {successMessage && <p className="text-sm text-green-400 bg-green-900/50 border border-green-700 p-3 rounded-md text-center">{successMessage}</p>}


            <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-800 active:scale-[0.98] disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-70 transition-all duration-200 ease-in-out"
            >
                {isLoading ? <LoadingSpinner /> : t('signUpPage.buttons.verifyCode')}
            </button>
            <button
                type="button"
                onClick={() => {console.log('[SignUpPage.tsx] Navigating back to registration step.'); setCurrentStep('register'); setError(null); setSuccessMessage(null);}}
                className="w-full text-sm text-slate-400 hover:text-sky-300 py-2 focus:outline-none"
            >
                {t('signUpPage.buttons.backToRegistration')}
            </button>
            </form>
        )}
      </div>
       <footer className="text-center text-xs text-slate-500 py-10 mt-8">
          {t('footer.copyrightSimple', { year: new Date().getFullYear(), appTitle: t('appTitle') })}
        </footer>
    </div>
  );
};

export default SignUpPage;