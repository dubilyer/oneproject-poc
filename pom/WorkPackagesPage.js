import { expect } from '@playwright/test';
import { EnvironmentFactory } from '../config/env/EnvironmentFactory.js';

/**
 * Page Object Model for the Work Packages page
 */
export class WorkPackagesPage {
  constructor(page) {
    this.page = page;
    this.environment = EnvironmentFactory.create();
    
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
    await this.page.goto(`${this.environment.getBaseUrl() || this.environment.getBaseHostUrl()}`);
    await this.page.waitForURL(new RegExp(this.environment.getBaseHostUrl()));
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to work packages section
   */
  async navigateToWorkPackages() {
    await this.workPackagesLink.click();
    await this.page.waitForURL(`${this.environment.getBaseHostUrl()}/work_packages`);
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
    await this.page.waitForURL(new RegExp(`${this.environment.getBaseHostUrl()}/work_packages/create_new`));
  }

  /**
   * Fill subject field
   * @param {string} subject - The task subject
   */
  async fillSubject(subject) {
    await this.subjectField.fill(subject);
  }

  /**
   * Select project from dropdown
   * @param {string} projectName - The project name to select
   */
  async selectProject(projectName) {
    await this.projectSearchCombobox.click();
    await this.page.getByRole('option', { name: projectName }).click();
  }

  /**
   * Fill description field
   * @param {string} description - The task description
   */
  async fillDescription(description) {
    await this.descriptionEditor.click();
    await this.descriptionEditor.fill(description);
  }

  /**
   * Save the work package
   */
  async save() {
    await this.saveButton.click();
    await this.page.waitForURL(new RegExp(`${this.environment.getBaseHostUrl()}/work_packages/details/\\d+/overview`));
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
    
    await this.page.waitForURL(new RegExp(`${this.environment.getBaseHostUrl()}/work_packages`));
  }

  /**
   * Verify task subject is visible
   * @param {string} subject - The subject to verify
   */
  async verifyTaskVisible(subject) {
    await expect(this.page.getByText(subject).first()).toBeVisible();
  }

  /**
   * Verify task is not visible
   * @param {string} subject - The subject to verify is not visible
   */
  async verifyTaskNotVisible(subject) {
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByText(new RegExp(`${subject} #\\d+`))).not.toBeVisible();
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
