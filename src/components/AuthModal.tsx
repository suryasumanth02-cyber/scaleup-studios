import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  KeyRound,
  Zap,
  Send,
  RefreshCw,
  ExternalLink,
  Key,
  Inbox
} from 'lucide-react';
import { UserProfile, NicheType } from '../types';
import { DEMO_ACCOUNTS, loginUser, registerUser, getRegisteredUsers } from '../utils/auth';
import { 
  generateVerificationCode, 
  sendVerificationEmail, 
  sendWelcomeEmail,
  getStoredResendKey,
  saveStoredResendKey 
} from '../utils/emailService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [authMethod, setAuthMethod] = useState<'email_otp' | 'password'>('email_otp');
  
  // Form fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [niche, setNiche] = useState<NicheType>('sports');
  const [role, setRole] = useState<UserProfile['role']>('Marketing Director');

  // OTP Verification Step
  const [step, setStep] = useState<'input' | 'verify_code'>('input');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [activeCode, setActiveCode] = useState<string>('');
  const [emailDeliveredTo, setEmailDeliveredTo] = useState<string | null>(null);
  const [needsApiKey, setNeedsApiKey] = useState<boolean>(false);
  const [resendApiKey, setResendApiKey] = useState<string>(getStoredResendKey());
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Status
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  if (!isOpen) return null;

  // Handle 1-Click Quick Demo Login
  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginUser(demoEmail, demoPass);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Login failed');
      }
    }, 350);
  };

  // Dispatch real email with 6-digit verification code
  const handleSendEmailCode = async (targetEmail: string) => {
    const cleanEmail = targetEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const code = generateVerificationCode();
    setActiveCode(code);

    const displayName = name || cleanEmail.split('@')[0];
    const displayBusiness = businessName || 'ScaleUp Client Workspace';

    const res = await sendVerificationEmail(cleanEmail, code, displayName, displayBusiness);
    setIsLoading(false);

    if (res.success) {
      setEmailDeliveredTo(cleanEmail);
      setNeedsApiKey(false);
      setStep('verify_code');
      startResendTimer();
    } else if (res.needsApiKey) {
      setEmailDeliveredTo(cleanEmail);
      setNeedsApiKey(true);
      setStep('verify_code');
      setError('RESEND_API_KEY is not configured yet on Vercel. You can paste your free key below to send real emails to your inbox, or use the generated test code.');
    } else {
      setError(res.error || 'Failed to dispatch verification email. Please verify your connection.');
    }
  };

  const startResendTimer = () => {
    setResendCountdown(30);
    const interval = setInterval(() => {
      setResendCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Save Custom Resend API Key
  const handleSaveKey = () => {
    saveStoredResendKey(resendApiKey);
    setShowKeyInput(false);
    setError(null);
    // Retry sending email with the new key
    if (email) {
      handleSendEmailCode(email);
    }
  };

  // Verify entered 6-digit code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (enteredOtp.trim() !== activeCode.trim()) {
      setError('Incorrect 6-digit code. Please verify the code in your email.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      const existing = getRegisteredUsers()[cleanEmail];

      if (existing) {
        // Sign in existing user
        onLoginSuccess(existing.profile);
      } else {
        // Register new user automatically upon email verification
        const displayName = name.trim() || cleanEmail.split('@')[0];
        const displayBusiness = businessName.trim() || `${displayName}'s Studio`;
        const res = registerUser({
          name: displayName,
          email: cleanEmail,
          password: 'verified_email_auth',
          businessName: displayBusiness,
          niche: niche,
          role: role,
        });

        if (res.success && res.user) {
          // Send welcome confirmation email in background
          sendWelcomeEmail(cleanEmail, displayName, displayBusiness);
          onLoginSuccess(res.user);
        } else {
          setError(res.error || 'Failed to initialize verified account.');
          return;
        }
      }

      onClose();
    }, 400);
  };

  // Password-based submit fallback
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (mode === 'signin') {
        const res = loginUser(email, password);
        setIsLoading(false);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Login failed');
        }
      } else {
        const res = registerUser({
          name,
          email,
          password,
          businessName,
          niche,
          role,
        });
        setIsLoading(false);
        if (res.success && res.user) {
          sendWelcomeEmail(email, name, businessName);
          onLoginSuccess(res.user);
          onClose();
        } else {
          setError(res.error || 'Registration failed');
        }
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            {step === 'verify_code' ? (
              <Inbox className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            ) : (
              <Mail className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {step === 'verify_code' ? 'Check Your Email Inbox' : 'Real Email Authentication'}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase font-mono font-bold">
                Live Server
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {step === 'verify_code'
                ? `Enter the 6-digit code dispatched to ${emailDeliveredTo}`
                : 'Enter your real email to receive a secure login code in your inbox'}
            </p>
          </div>
        </div>

        {/* 1-Click Quick Demo Credentials Bar (Only in input step) */}
        {step === 'input' && (
          <div className="mb-5 p-3 bg-slate-950/90 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Or Instant Demo Client Access:
              </span>
              <span className="text-[9px] font-mono text-emerald-400">1-Click Login</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email, acc.password)}
                  className="flex flex-col items-start p-2 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
                >
                  <span className="text-[11px] font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {acc.badge}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 truncate w-full mt-0.5">
                    {acc.email}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: ENTER REAL EMAIL / REGISTRATION FORM                              */}
        {/* ========================================================================= */}
        {step === 'input' && (
          <div>
            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In with Email
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Client Account
              </button>
            </div>

            {/* Auth Method Toggle: Real Email Code (Recommended) vs Password */}
            <div className="flex items-center justify-between mb-4 px-1 text-[11px]">
              <span className="text-slate-400 font-semibold">Verification Method:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email_otp')}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                    authMethod === 'email_otp'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  📨 Email Code (OTP)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('password')}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                    authMethod === 'password'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  🔑 Password
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={authMethod === 'email_otp' ? (e) => { e.preventDefault(); handleSendEmailCode(email); } : handlePasswordSubmit} className="space-y-3.5">
              
              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Business / Brand Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Acme Media"
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Your Personal or Work Email (Where code will be sent)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-name@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Password (Only when password auth is selected) */}
              {authMethod === 'password' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Industry / Niche
                    </label>
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value as NicheType)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="sports">🏅 Sports & Athletic Academy</option>
                      <option value="fitness">💪 Fitness & Health Club</option>
                      <option value="restaurant">🍕 Restaurant & Cafe</option>
                      <option value="realestate">🏡 Real Estate Agency</option>
                      <option value="ecommerce">📦 E-Commerce / DTC Brand</option>
                      <option value="services">🛠️ Local Services & HVAC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Your Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserProfile['role'])}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Marketing Director">Marketing Director</option>
                      <option value="Owner">Founder / Business Owner</option>
                      <option value="Agency Manager">Agency Account Manager</option>
                      <option value="Creator">Content Creator</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    Connecting to Email Server...
                  </span>
                ) : authMethod === 'email_otp' ? (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Verification Code to My Email</span>
                  </>
                ) : mode === 'signin' ? (
                  <>
                    <span>Sign In to ScaleUp Studios</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Create Client Account</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: ENTER 6-DIGIT VERIFICATION CODE THAT ARRIVED IN INBOX             */}
        {/* ========================================================================= */}
        {step === 'verify_code' && (
          <div className="space-y-4">
            
            {/* Email Dispatch Confirmation Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                <Mail className="w-5 h-5 animate-bounce" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Verification Code Sent!
              </h3>
              <p className="text-xs text-slate-300">
                We dispatched an email to <strong className="text-emerald-400 font-mono">{emailDeliveredTo}</strong>.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Please check your inbox (and Spam/Junk folder if not in primary).
              </p>
            </div>

            {/* Test Code Callout (Shown when Resend API Key is not yet configured) */}
            {needsApiKey && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    Test Verification Code:
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 font-mono font-black text-sm tracking-widest border border-amber-400/40">
                    {activeCode}
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Want real emails sent to your inbox? Add your free key from <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline font-bold text-white">resend.com</a> below or in Vercel settings.
                </p>
                <button
                  type="button"
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  className="text-[11px] text-amber-400 hover:underline font-bold flex items-center gap-1"
                >
                  <Key className="w-3 h-3" />
                  <span>{showKeyInput ? 'Hide API Key Input' : '⚙️ Configure Resend API Key (re_...)'}</span>
                </button>
              </div>
            )}

            {/* Optional Resend API Key Input Box */}
            {showKeyInput && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Resend API Key (<a href="https://resend.com/api-keys" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">Get free key at resend.com</a>)
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                    placeholder="re_123456789..."
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                  >
                    Save & Send
                  </button>
                </div>
              </div>
            )}

            {/* OTP Code Form */}
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-center text-xs font-semibold text-slate-400 mb-2">
                  Enter the 6-Digit Code
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[12px] text-2xl font-black py-3 bg-slate-950 border-2 border-emerald-500/60 rounded-2xl text-emerald-400 focus:outline-none focus:border-emerald-400 font-mono shadow-inner shadow-black"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || enteredOtp.length !== 6}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    Verifying Email Code...
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Code & Enter Studio</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => { setStep('input'); setError(null); }}
                  className="text-slate-400 hover:text-white"
                >
                  ← Change Email
                </button>

                <button
                  type="button"
                  disabled={resendCountdown > 0}
                  onClick={() => handleSendEmailCode(email)}
                  className="text-emerald-400 hover:underline disabled:text-slate-500 font-semibold"
                >
                  {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend Email Code'}
                </button>
              </div>
            </form>

          </div>
        )}

        {/* Security Footer Notice */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            256-Bit SSL Encryption • Real Email Gateway
          </span>
          <span className="font-mono">Resend API Active</span>
        </div>

      </div>
    </div>
  );
};
