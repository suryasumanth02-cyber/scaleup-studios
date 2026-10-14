const RESEND_KEY_STORAGE = 'scaleup_resend_api_key';

export function getStoredResendKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(RESEND_KEY_STORAGE) || '';
}

export function saveStoredResendKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (key) {
    localStorage.setItem(RESEND_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(RESEND_KEY_STORAGE);
  }
}

export function generateVerificationCode(): string {
  // Generate cryptographically secure or pseudo-random 6-digit OTP code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export interface SendEmailResponse {
  success: boolean;
  needsApiKey?: boolean;
  messageId?: string;
  error?: string;
  code?: string;
}

/**
 * Dispatch real verification email with 6-digit OTP to user's personal inbox
 */
export async function sendVerificationEmail(
  email: string,
  code: string,
  userName?: string,
  businessName?: string
): Promise<SendEmailResponse> {
  const customKey = getStoredResendKey();

  try {
    const res = await fetch('/api/send-auth-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        code,
        type: 'verification_code',
        name: userName,
        businessName,
        apiKey: customKey || undefined
      })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `HTTP ${res.status}: Could not dispatch email.`,
        needsApiKey: data.needsApiKey,
        code
      };
    }

    return {
      success: true,
      messageId: data.messageId,
      code
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error connecting to email API endpoint.',
      code
    };
  }
}

/**
 * Dispatch welcome confirmation email to user's personal inbox
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string,
  businessName: string
): Promise<void> {
  const customKey = getStoredResendKey();
  try {
    await fetch('/api/send-auth-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        type: 'welcome',
        name: userName,
        businessName,
        apiKey: customKey || undefined
      })
    });
  } catch (_) {}
}
