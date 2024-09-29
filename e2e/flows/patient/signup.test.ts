import { by, device, element, expect } from 'detox';

describe('Patient Login Flow', () => {
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
    const patientButton = element(by.text('Patient'));
    await patientButton.tap();

    await expect(element(by.id('signup-screen'))).toBeVisible();
  });

  // TODO: Add case for invalid login
});
