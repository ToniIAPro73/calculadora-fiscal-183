import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ONBOARDING_REPLAY_EVENT,
  ONBOARDING_STORAGE_KEY,
  hasCompletedOnboarding,
  markOnboardingCompleted,
  requestOnboardingReplay,
  resetOnboarding,
  shouldShowOnboarding,
} from './onboarding.js';

function createMemoryStorage() {
  const map = new Map();

  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
}

describe('onboarding', () => {
  beforeEach(() => {
    globalThis.localStorage = createMemoryStorage();
  });

  afterEach(() => {
    delete globalThis.localStorage;
    delete globalThis.window;
  });

  it('shows the tour on a first visit (no flag stored)', () => {
    expect(hasCompletedOnboarding()).toBe(false);
    expect(shouldShowOnboarding()).toBe(true);
  });

  it('hides the tour once it is marked as completed', () => {
    markOnboardingCompleted();

    expect(globalThis.localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe('1');
    expect(hasCompletedOnboarding()).toBe(true);
    expect(shouldShowOnboarding()).toBe(false);
  });

  it('re-arms the tour when the flag is reset', () => {
    markOnboardingCompleted();
    resetOnboarding();

    expect(shouldShowOnboarding()).toBe(true);
  });

  it('treats unexpected stored values as not completed', () => {
    globalThis.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'yes');

    expect(shouldShowOnboarding()).toBe(true);
  });

  it('requestOnboardingReplay resets the flag and emits the replay event', () => {
    markOnboardingCompleted();

    const dispatchEvent = vi.fn();
    globalThis.window = { dispatchEvent };

    requestOnboardingReplay();

    expect(shouldShowOnboarding()).toBe(true);
    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    expect(dispatchEvent.mock.calls[0][0].type).toBe(ONBOARDING_REPLAY_EVENT);
  });

  it('requestOnboardingReplay does not throw without a window object', () => {
    expect(() => requestOnboardingReplay()).not.toThrow();
  });

  it('stays safe when localStorage is unavailable', () => {
    delete globalThis.localStorage;

    expect(shouldShowOnboarding()).toBe(false);
    expect(() => markOnboardingCompleted()).not.toThrow();
    expect(() => resetOnboarding()).not.toThrow();
  });
});
