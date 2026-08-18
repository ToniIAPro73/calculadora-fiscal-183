export const ONBOARDING_STORAGE_KEY = 'taxnomad_onboarding_completed';
export const ONBOARDING_REPLAY_EVENT = 'taxnomad:onboarding-replay';
export const ONBOARDING_TOTAL_STEPS = 3;

function getStorage() {
  try {
    const storage = globalThis.localStorage;
    return storage ?? null;
  } catch {
    return null;
  }
}

/**
 * True when the guided tour was already finished or skipped on this browser.
 */
export function hasCompletedOnboarding() {
  const storage = getStorage();
  if (!storage) return true;

  try {
    return storage.getItem(ONBOARDING_STORAGE_KEY) === '1';
  } catch {
    return true;
  }
}

export function shouldShowOnboarding() {
  return !hasCompletedOnboarding();
}

export function markOnboardingCompleted() {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(ONBOARDING_STORAGE_KEY, '1');
  } catch {
    // Storage full or unavailable: persistence is best-effort only.
  }
}

export function resetOnboarding() {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    // Persistence is best-effort only.
  }
}

/**
 * Re-arms the first-visit flag and notifies any mounted wizard so the tour
 * can start again (used by the "How does it work?" footer link).
 */
export function requestOnboardingReplay() {
  resetOnboarding();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ONBOARDING_REPLAY_EVENT));
  }
}
