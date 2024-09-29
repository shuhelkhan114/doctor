import { sleep } from '@core/utils/common';
import { by, device, element, expect } from 'detox';

describe('Doctor OAuth Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the initial state with initial text', async () => {
    const sloganText1 = element(by.id('slogan-1'));
    const sloganText2 = element(by.id('slogan-2'));
    const doximityLoginButton = element(by.text('Sign in with Doximity'));
    const patientLoginButton = element(by.text('Patient'));
    const loginLink = element(by.text('Already have an account? Login'));

    await expect(sloganText1).toBeVisible();
    await expect(sloganText2).toBeVisible();
    await expect(doximityLoginButton).toBeVisible();
    await expect(patientLoginButton).toBeVisible();
    await expect(loginLink).toBeVisible();

    await expect(sloganText1).toHaveText('Simplifying'.toUpperCase());
    await expect(sloganText2).toHaveText('your healthcare');
  });

  it('should login when valid credentials are provided!', async () => {
    const signInButton = element(by.text('Sign in with Doximity'));

    await signInButton.tap();

    await sleep(15000);

    await expect(element(by.id('start-screen'))).toBeVisible();
  });

  // TODO: Add case for invalid login
});
