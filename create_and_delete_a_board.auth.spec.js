import 'dotenv/config';
import { test, expect } from '@playwright/test';
import testData from './create_and_delete_a_board.test-data.json';
const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure

test.setTimeout(120000);

// Use the first data variation and add a timestamp for uniqueness
const testData_0 = testData.variations[0];
const boardName = `${testData_0.boardName} ${Date.now()}`;
const projectName = 'Demo project';

test('Create and Delete a Board', async ({ page }) => {
  // Step 1: Navigate to website homepage
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(new RegExp(`^${BASE_HOST_URL}`));

  // Step 2: Navigate to boards page
  await page.goto(`${BASE_HOST_URL}/boards`);
  await page.waitForURL(`${BASE_HOST_URL}/boards`);

  // Step 3: Click the 'Create new board' button
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Create new board/ }) (confidence: 96%, strategy: aria_label_regex)
  //   2. page.getByRole('link', { name: /Create new board/ }) (confidence: 95%, strategy: role_name_regex)
  //   3. page.locator('#content-body').getByRole('link', { name: 'Create new board' }) (confidence: 82%, strategy: parent_id_role)
  //   4. page.locator('#add-board-button') (confidence: 75%, strategy: id)
  await page.getByRole('link', { name: /Create new board/ }).first().click();
  await page.waitForURL(`${BASE_HOST_URL}/boards/new`);

  // Step 4: Enter the board name
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('textbox', { name: 'Title' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.locator('form#board-form').getByRole('textbox', { name: 'Title' }) (confidence: 96%, strategy: form_id_role)
  //   3. page.getByRole('textbox', { name: 'Title' }) (confidence: 95%, strategy: role_name)
  //   4. page.getByLabel('Title') (confidence: 93%, strategy: label_text)
  //   5. page.locator('#boards_grid_name') (confidence: 75%, strategy: id)
  await page.getByLabel('Title').fill(boardName);

  // Step 5: Enter 'Demo project' into the project search field
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('combobox', { name: 'Search' }) (confidence: 98%, strategy: form_action_aria_role)
  //   2. page.locator('form#board-form').getByRole('combobox', { name: 'Search' }) (confidence: 96%, strategy: form_id_role)
  //   3. page.getByRole('combobox', { name: 'Search' }) (confidence: 95%, strategy: role_name)
  //   4. page.locator('#project_id').getByRole('combobox', { name: 'Search' }) (confidence: 82%, strategy: parent_id_role)
  await page.locator('form[action*="boards"]').getByRole('combobox', { name: 'Search' }).fill(projectName);

  // Step 6: Select 'Demo project' from the suggestion list
  // Captured selectors:
  //   1. page.locator('[role="listbox"]').getByRole('option', { name: 'Demo project' }) (confidence: 98%, strategy: portal_role_name)
  //   2. page.getByRole('option', { name: /Demo project/ }) (confidence: 95%, strategy: role_name_regex)
  //   3. page.getByText('Demo project') (confidence: 88%, strategy: text)
  //   4. page.locator('#a97ccf9aa3b8-0') (confidence: 75%, strategy: id)
  await page.locator('[role="listbox"]').getByRole('option', { name: projectName }).click();

  // Step 7: Click the 'Create' button
  // Captured selectors:
  //   1. page.locator('form[action*="boards"]').getByRole('button', { name: 'Create' }) (confidence: 97%, strategy: form_action_role)
  //   2. page.locator('form#board-form').getByRole('button', { name: 'Create' }) (confidence: 96%, strategy: form_id_role)
  //   3. page.getByRole('button', { name: 'Create' }) (confidence: 95%, strategy: role_name)
  //   4. page.locator('button.-primary.button') (confidence: 80%, strategy: css_combined_classes)
  await page.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/projects/demo-project/boards/\\d+`));

  // Step 8: Click the 'Boards' link to return to the list
  // Captured selectors:
  //   1. page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }) (confidence: 82%, strategy: parent_id_role)
  //   2. page.getByRole('link', { name: 'Boards' }) (confidence: 85%, strategy: role_name)
  //   3. page.getByText('Boards') (confidence: 78%, strategy: text)
  //   4. page.locator('xpath=html/body/div[2]/div[1]/div[1]/div/ul/li[5]/div[2]/a[2]') (confidence: 50%, strategy: xpath)
  await page.locator('#menu-sidebar').getByRole('link', { name: 'Boards' }).click();
  await page.waitForURL(`${BASE_HOST_URL}/projects/demo-project/boards`);

  // Step 9: Click the delete icon for the new board
  // Listen for the confirmation dialog and accept it
  page.on('dialog', dialog => dialog.accept());
  
  // Dynamically find the row with the board name and click delete within it
  // Captured selectors (for inspiration, as the original is not dynamic):
  //   1. page.locator('a.icon-delete[href*="/boards/58"]') (confidence: 88%, strategy: css_class_href_combined)
  //   2. page.locator('a[href*="58"]') (confidence: 79%, strategy: href_relative)
  //   3. page.locator('a[data-turbo-method="delete"]') (confidence: 75%, strategy: data_attr_turbo-method)
  const boardRow = page.locator('tr').filter({ hasText: boardName });
  await boardRow.locator('a.icon-delete').click();

  // Step 10: Verify that the board is no longer visible
  await page.waitForLoadState('networkidle');
  await expect(page.getByText(boardName, { exact: true })).toBeHidden();
});