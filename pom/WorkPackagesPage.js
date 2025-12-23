import { expect } from '@playwright/test';
import { EnvironmentValidator } from '../utils/EnvironmentValidator.js';

/**
 * Page Object Model for the Work Packages page
 */
export class WorkPackagesPage {
  constructor(page) {
    this.page = page;
    
    // Validate environment on construction
    EnvironmentValidator.validateEnvironment();
    
    // Locators
    this.workPackagesLink = page.getByRole('link', { name: /Work packages/ });
    this.createButton = page.getByRole('button', { name: /Create new work package/ });
    this.taskMenuItem = page.getByRole('menuitem', { name: 'Task', exact: true });
    this.subjectField = page.getByRole('textbox', { name: 'Subject' });
    this.projectSearchCombobox = page.getByRole('combobox', { name: 'Search', exact: true });
    this.descriptionEditor = page.getByRole('textbox', { name: /Rich Text Editor/ });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.moreActionsButton = page.locator('button.button.dropdown-relative');
    this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
  }

  /**
   * Navigate to work packages page
   */
  async navigate() {
    const baseUrl = EnvironmentValidator.getVar('BASE_URL') || EnvironmentValidator.getVar('BASE_HOST_URL');
    const baseHostUrl = EnvironmentValidator.getVar('BASE_HOST_URL');
    
    await this.page.goto(baseUrl);
    await this.page.waitForURL(new RegExp(baseHostUrl));
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to work packages section
   */
  async navigateToWorkPackages() {
    await this.workPackagesLink.click();
    const baseHostUrl = EnvironmentValidator.getVar('BASE_HOST_URL');
    await this.page.waitForURL(`${baseHostUrl}/work_packages`);
  }

  /**
   * Click create new work package button
   */
  async clickCreate() {
    await this.createButton.first().click();
  }

  /**
   * Select task type from dropdown
   */
  async selectTaskType() {
    await this.taskMenuItem.click();
    const baseHostUrl = EnvironmentValidator.getVar('BASE_HOST_URL');
    await this.page.waitForURL(new RegExp(`${baseHostUrl}/work_packages/create_new`));
  }

  /**
   * Fill subject field
   * @param {string} subject - The task subject
   */
  async fillSubject(subject) {
    const sanitizedSubject = EnvironmentValidator.sanitizeValue(subject);
    await this.subjectField.fill(sanitizedSubject);
  }

  /**
   * Select project from dropdown
   * @param {string} projectName - The project name to select
   */
  async selectProject(projectName) {
    const sanitizedProjectName = EnvironmentValidator.sanitizeValue(projectName);
    await this.projectSearchCombobox.click();
    await this.page.getByRole('option', { name: sanitizedProjectName }).click();
  }

  /**
   * Fill description field
   * @param {string} description - The task description
   */
  async fillDescription(description) {
    const sanitizedDescription = EnvironmentValidator.sanitizeValue(description);
    await this.descriptionEditor.click();
    await this.descriptionEditor.fill(sanitizedDescription);
  }

  /**
   * Save the work package
   */
  async save() {
    await this.saveButton.click();
    const baseHostUrl = EnvironmentValidator.getVar('BASE_HOST_URL');
    await this.page.waitForURL(new RegExp(`${baseHostUrl}/work_packages/details/\\d+/overview`));
  }

  /**
   * Delete the work package
   */
  async deleteWorkPackage() {
    await this.moreActionsButton.click();
    await this.deleteMenuItem.click();
    
    const deleteDialog = this.page.locator('[role="dialog"]');
    await deleteDialog.waitFor({ state: 'visible' });
    await deleteDialog.getByRole('button', { name: 'Delete' }).click();
    
    const baseHostUrl = EnvironmentValidator.getVar('BASE_HOST_URL');
    await this.page.waitForURL(new RegExp(`${baseHostUrl}/work_packages`));
  }

  /**
   * Verify task subject is visible
   * @param {string} subject - The subject to verify
   */
  async verifyTaskVisible(subject) {
    const sanitizedSubject = EnvironmentValidator.sanitizeValue(subject);
    await expect(this.page.getByText(sanitizedSubject).first()).toBeVisible();
  }

  /**
   * Verify task is not visible
   * @param {string} subject - The subject to verify is not visible
   */
  async verifyTaskNotVisible(subject) {
    await this.page.waitForLoadState('networkidle');
    const sanitizedSubject = EnvironmentValidator.sanitizeValue(subject);
    await expect(this.page.getByText(new RegExp(`${sanitizedSubject} #\\d+`))).not.toBeVisible();
  }

  /**
   * Create a complete work package
   * @param {string} subject - The task subject
   * @param {string} description - The task description
   * @param {string} projectName - The project name
   */
  async createWorkPackage(subject, description, projectName = 'Demo project') {
    await this.navigate();
    await this.navigateToWorkPackages();
    await this.clickCreate();
    await this.selectTaskType();
    await this.fillSubject(subject);
    await this.selectProject(projectName);
    await this.fillDescription(description);
    await this.save();
    await this.verifyTaskVisible(subject);
  }
}
