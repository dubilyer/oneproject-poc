import { expect } from '@playwright/test';

/**
 * Page Object Model for the Login page
 */
export class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.usernameField = page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' });
    this.passwordField = page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' });
    this.signInButton = page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ });
  }

  /**
   * Navigate to the login page
   */
  async navigate() {
    const loginUrl = process.env.LOGIN_URL || process.env.BASE_URL;
    await this.page.goto(loginUrl);
    await expect(this.page).toHaveURL(loginUrl);
    
    // Wait for the login form to be ready
    await this.usernameField.waitFor({ state: 'visible' });
  }

  /**
   * Fill username field
   * @param {string} username - The username to enter
   */
  async fillUsername(username) {
    await this.usernameField.waitFor({ state: 'visible' });
    await this.usernameField.fill(username);
  }

  /**
   * Fill password field
   * @param {string} password - The password to enter
   */
  async fillPassword(password) {
    await this.passwordField.fill(password);
  }

  /**
   * Click the sign in button
   */
  async clickSignIn() {
    await this.signInButton.click();
  }

  /**
   * Perform complete login flow
   * @param {string} username - The username (optional, will use environment default)
   * @param {string} password - The password (optional, will use environment default)
   */
  async login(username = null, password = null) {
    await this.navigate();
    await this.fillUsername(username || process.env.UI_SITE_USERNAME);
    await this.fillPassword(password || process.env.UI_SITE_PASSWORD);
    await this.clickSignIn();
    
    // Wait for successful login
    const expectedUrl = new RegExp(`^${process.env.LOGIN_HOST_URL || process.env.BASE_HOST_URL}/?$`);
    await this.page.waitForURL(expectedUrl, { timeout: 30000 });
  }

  /**
   * Save authentication state for reuse
   * @param {object} context - Browser context
   */
  async saveAuthState(context) {
    await this.page.waitForLoadState('networkidle');
    await context.storageState({ path: '.auth/storage-state.json' });
  }
}
