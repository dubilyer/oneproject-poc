import { EnvironmentFactory } from '../config/env/EnvironmentFactory.js';

/**
 * Page Object Model for the Login page
 */
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.environment = EnvironmentFactory.create();
    
    // Locators
    this.usernameField = page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' });
    this.passwordField = page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' });
    this.signInButton = page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ });
  }

  /**
   * Navigate to the login page
   */
  async navigate() {
    await this.page.goto(this.environment.getLoginUrl() || this.environment.getBaseUrl());
    await this.page.waitForURL(this.environment.getLoginUrl() || this.environment.getBaseUrl());
  }

  /**
   * Fill username field
   * @param {string} username - The username to enter
   */
  async fillUsername(username) {
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
    await this.fillUsername(username || this.environment.getUsername());
    await this.fillPassword(password || this.environment.getPassword());
    await this.clickSignIn();
    
    // Wait for successful login
    const expectedUrl = new RegExp(`^${this.environment.getLoginHostUrl() || this.environment.getBaseHostUrl()}/?$`);
    await this.page.waitForURL(expectedUrl, { timeout: 30000 });
  }

  /**
   * Save authentication state for reuse
   * @param {object} context - Browser context
   */
  async saveAuthState(context) {
    await this.page.waitForLoadState('networkidle');
    await context.storageState({ path: '../.auth/storage-state.json' });
  }
}
