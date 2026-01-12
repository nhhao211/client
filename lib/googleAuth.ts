/**
 * Google OAuth utilities using Google Identity Services
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

let tokenResponseCallback: ((response: any) => void) | null = null;

/**
 * Initialize Google Identity Services
 */
export function initializeGoogleAuth(clientId: string, callback: (response: any) => void) {
  tokenResponseCallback = callback;
  
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      locale: 'vi', // Ép kiểu ngôn ngữ sang tiếng Việt
      use_fedcm_for_prompt: false,
    });
  }
}

/**
 * Handle credential response from Google
 */
function handleCredentialResponse(response: any) {
  if (tokenResponseCallback) {
    tokenResponseCallback(response);
  }
}

/**
 * Trigger Google One Tap prompt
 */
export function promptGoogleOneTap() {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.prompt();
  }
}

/**
 * Render Google Sign-In button
 */
export function renderGoogleButton(
  element: HTMLElement,
  options?: {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  }
) {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.renderButton(element, {
      theme: options?.theme || 'outline',
      size: options?.size || 'large',
      text: options?.text || 'continue_with',
      shape: options?.shape || 'rectangular',
    });
  }
}

/**
 * Load Google Identity Services script
 */
export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}
