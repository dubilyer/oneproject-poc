import { expect } from '@playwright/test';
import { EnvironmentValidator } from '../utils/EnvironmentValidator.js';
import { PathSanitizer } from '../utils/PathSanitizer.js';

/**
 * Page Object Model for the Login page
 */
export class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Validate environment on construction
    EnvironmentValidator.validateEnvironment();
    
    // Locators
    this.usernameField = page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' });
    this.passwordField = page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' });
    this.signInButton = page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ });
  }

  /**
   * Navigate to the login page
   */
  async navigate() {
    const loginUrl = EnvironmentValidator.getVar('LOGIN_URL') || EnvironmentValidator.getVar('BASE_URL');
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
    const sanitizedUsername = EnvironmentValidator.sanitizeCredential(username);
    await this.usernameField.fill(sanitizedUsername);
  }

  /**
   * Fill password field
   * @param {string} password - The password to enter
   */
  async fillPassword(password) {
    const sanitizedPassword = EnvironmentValidator.sanitizeCredential(password);
    await this.passwordField.fill(sanitizedPassword);
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
    
    const safeUsername = username || EnvironmentValidator.getVar('UI_SITE_USERNAME');
    const safePassword = password || EnvironmentValidator.getVar('UI_SITE_PASSWORD');
    
    await this.fillUsername(safeUsername);
    await this.fillPassword(safePassword);
    await this.clickSignIn();
    
    // Wait for successful login
    const loginHostUrl = EnvironmentValidator.getVar('LOGIN_HOST_URL') || EnvironmentValidator.getVar('BASE_HOST_URL');
    const expectedUrl = new RegExp(`^${loginHostUrl}/?$`);
    await this.page.waitForURL(expectedUrl, { timeout: 30000 });
  }

  /**
   * Save authentication state for reuse
   * @param {object} context - Browser context
   */
  async saveAuthState(context) {
    await this.page.waitForLoadState('networkidle');
    const safePath = PathSanitizer.getStorageStatePath();
    await context.storageState({ path: safePath });
  }
}
