import { expect } from '@playwright/test';
import { EnvironmentFactory } from '../config/env/EnvironmentFactory.js';

/**
 * Page Object Model for the Boards page
 */
export class BoardsPage {
  constructor(page) {
    this.page = page;
    this.environment = EnvironmentFactory.create();
    
    // Locators
    this.createNewBoardButton = page.getByRole('link', { name: /Create new board/ });
    this.titleField = page.getByLabel('Title');
    this.projectSearchField = page.locator('form[action*="boards"]').getByRole('combobox', { name: 'Search' });
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.boardsLink = page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' });
  }

  /**
   * Navigate to the boards page
   */
  async navigate() {
    await this.page.goto(`${this.environment.getBaseHostUrl()}/boards`);
    await this.page.waitForURL(`${this.environment.getBaseHostUrl()}/boards`);
  }

  /**
   * Click the create new board button
   */
  async clickCreateNewBoard() {
    await this.createNewBoardButton.first().click();
    await this.page.waitForURL(`${this.environment.getBaseHostUrl()}/boards/new`);
  }

  /**
   * Fill the board title
   * @param {string} title - The board title
   */
  async fillTitle(title) {
    await this.titleField.fill(title);
  }

  /**
   * Search and select a project
   * @param {string} projectName - The project name to search and select
   */
  async selectProject(projectName) {
    await this.projectSearchField.fill(projectName);
    await this.page.locator('[role="listbox"]').getByRole('option', { name: projectName }).click();
  }

  /**
   * Click the create button
   */
  async clickCreate() {
    await this.createButton.click();
    await this.page.waitForURL(new RegExp(`${this.environment.getBaseHostUrl()}/projects/demo-project/boards/\\d+`));
  }

  /**
   * Navigate back to boards list
   */
  async navigateToBoards() {
    await this.boardsLink.click();
    await this.page.waitForURL(`${this.environment.getBaseHostUrl()}/projects/demo-project/boards`);
  }

  /**
   * Delete a board by name
   * @param {string} boardName - The name of the board to delete
   */
  async deleteBoard(boardName) {
    // Listen for confirmation dialog and accept it
    this.page.on('dialog', dialog => dialog.accept());
    
    // Find the board row and click delete
    const boardRow = this.page.locator('tr').filter({ hasText: boardName });
    await boardRow.locator('a.icon-delete').click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify board is not visible
   * @param {string} boardName - The name of the board to verify is hidden
   */
  async verifyBoardNotVisible(boardName) {
    await expect(this.page.getByText(boardName, { exact: true })).toBeHidden();
  }

  /**
   * Create a complete board
   * @param {string} boardName - The board name
   * @param {string} projectName - The project name
   */
  async createBoard(boardName, projectName) {
    await this.navigate();
    await this.clickCreateNewBoard();
    await this.fillTitle(boardName);
    await this.selectProject(projectName);
    await this.clickCreate();
    await this.navigateToBoards();
  }
}
