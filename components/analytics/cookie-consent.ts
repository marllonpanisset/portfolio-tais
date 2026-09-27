export const COOKIE_CONSENT_KEY = "conjuga-cookie-consent";

export const COOKIE_CONSENT_ACCEPTED_EVENT = "cookie-consent-accepted";

export type CookieConsent = "accepted" | "rejected";

export function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = localStorage.getItem(COOKIE_CONSENT_KEY);

  if (value === "accepted" || value === "rejected") {
    return value;
  }

  return null;
}

export function storeConsent(consent: CookieConsent) {
  localStorage.setItem(COOKIE_CONSENT_KEY, consent);

  window.dispatchEvent(new Event(COOKIE_CONSENT_ACCEPTED_EVENT));
}

export function subscribe(callback: () => void) {
  window.addEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, callback);

  return () => {
    window.removeEventListener(COOKIE_CONSENT_ACCEPTED_EVENT, callback);
  };
}
