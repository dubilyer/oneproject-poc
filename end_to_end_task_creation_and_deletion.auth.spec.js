import 'dotenv/config';
import { test, expect } from '@playwright/test';
const BASE_HOST_URL = process.env.BASE_HOST_URL;
const BASE_URL = process.env.BASE_URL;

// Capture accessibility tree on failure

test.setTimeout(120000);

test('End-to-End Task Creation and Deletion', async ({ page }) => {
  const taskSubject = `Auto WP new test ${Date.now()}`;
  const taskDescription = `Auto description ${new Date().toISOString()}`;
  
  // Step 1: Navigate to website homepage
  // Using BASE_URL for initial navigation to the app's entry point
  await page.goto(BASE_URL || BASE_HOST_URL);
  await page.waitForURL(new RegExp(BASE_HOST_URL));
  await page.waitForLoadState('networkidle');

  // Step 2: Navigate to the 'Work packages' section
  // Captured selectors:
  //   1. page.getByRole('link', { name: /Work packages/ }) (confidence: 95%, strategy: role)
  //   2. page.locator('#work_packages-wrapper').getByRole('link', { name: 'Work packages' }) (confidence: 82%, strategy: locator)
  //   3. page.locator('a.work-packages-menu-item') (confidence: 78%, strategy: css)
  //   4. page.locator('a').filter({ hasText: /^Work packages$/ }) (confidence: 74%, strategy: locator)
  await page.getByRole('link', { name: /Work packages/ }).click();
  await page.waitForURL(`${BASE_HOST_URL}/work_packages`);

  // Step 3: Click the 'Create' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: /Create new work package/ }) (confidence: 96%, strategy: role)
  //   2. page.locator('button.button.-primary') (confidence: 80%, strategy: css)
  //   3. page.locator('button, input[type=\"submit\"], input[type=\"button\"]').filter({ hasText: /^Create$/ }) (confidence: 75%, strategy: locator)
  await page.getByRole('button', { name: /Create new work package/ }).first().click();
  
  // Step 4: Select 'Task' from the dropdown menu
  // Captured selectors:
  //   1. page.getByRole('menuitem', { name: 'Task', exact: true }) (confidence: 96%, strategy: role)
  //   2. page.locator('#types-context-menu').getByRole('menuitem', { name: 'Task' }) (confidence: 82%, strategy: locator)
  //   3. page.locator('a').filter({ hasText: /^Task$/ }) (confidence: 74%, strategy: locator)
  await page.getByRole('menuitem', { name: 'Task', exact: true }).click();
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/work_packages/create_new`));

  // Step 5: Enter the subject for the new task
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: 'Subject' }) (confidence: 95%, strategy: role)
  //   2. page.getByLabel('Subject', { exact: true }) (confidence: 92%, strategy: label)
  //   3. page.locator('[role=\"form\"]').getByRole('textbox', { name: 'Subject' }) (confidence: 88%, strategy: locator)
  //   4. page.locator('#wp-new-inline-edit--field-subject') (confidence: 75%, strategy: id)
  await page.getByRole('textbox', { name: 'Subject' }).fill(taskSubject);
  
  // Step 6: Click the project selection input
  // Captured selectors:
  //   1. page.getByRole('combobox', { name: 'Search', exact: true }) (confidence: 96%, strategy: role)
  //   2. page.locator('[role=\"form\"]').getByRole('combobox', { name: 'Search' }) (confidence: 88%, strategy: locator)
  await page.getByRole('combobox', { name: 'Search', exact: true }).click();
  
  // Step 7: Select 'Demo project' from the list
  // Captured selectors:
  //   1. page.locator('#a67f7fc77000-2').locator('div') (confidence: 78%, strategy: locator)
  //   2. page.locator('div').filter({ hasText: /^Demo project$/ }) (confidence: 68%, strategy: locator)
  //   3. page.locator('xpath=html/body/div[3]/ng-dropdown-panel/div/div[2]/div[3]/div') (confidence: 50%, strategy: xpath)
  // Using a more robust role-based selector to find the dropdown option
  await page.getByRole('option', { name: 'Demo project' }).click();
  
  // Step 8: Enter a description
  // Captured selectors:
  //   1. page.getByRole('textbox', { name: /Rich Text Editor.../ }) (confidence: 96%, strategy: role)
  //   2. page.locator('[role=\"form\"]').getByRole('textbox', { name: /Rich Text Editor.../ }) (confidence: 88%, strategy: locator)
  //   3. page.locator('div.ck-blurred') (confidence: 78%, strategy: css)
  await page.getByRole('textbox', { name: /Rich Text Editor/ }).click();
  await page.getByRole('textbox', { name: /Rich Text Editor/ }).fill(taskDescription);
  
  // Step 9: Click the 'Save' button
  // Captured selectors:
  //   1. page.getByRole('button', { name: 'Save' }) (confidence: 95%, strategy: role)
  //   2. page.getByText('Save') (confidence: 88%, strategy: text)
  //   3. page.locator('#work-packages--edit-actions-save') (confidence: 75%, strategy: id)
  await page.getByRole('button', { name: 'Save' }).click();
  // Wait for navigation to the new task's detail page (URL will have a dynamic ID)
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/work_packages/details/\\d+/overview`));
  await expect(page.getByText(taskSubject).first()).toBeVisible();

  // Step 10: Click the 'More' actions button
  // Captured selectors:
  //   1. page.locator('button.button.dropdown-relative') (confidence: 80%, strategy: css)
  //   2. page.locator('#action-show-more-dropdown-menu').locator('button') (confidence: 78%, strategy: locator)
  await page.locator('button.button.dropdown-relative').click();

  // Implicit step: Click 'Delete' from the dropdown menu to open the confirmation dialog
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  
  // Step 11: Click the 'Delete' button within the confirmation dialog
  // Captured selectors:
  //   1. page.locator('[role="dialog"]').getByRole('button', { name: 'Delete' }) (confidence: 95%, strategy: locator)
  //   2. page.getByRole('button', { name: 'Delete' }) (confidence: 95%, strategy: role)
  //   3. page.locator('#wp_destroy_modal').getByRole('button', { name: 'Delete' }) (confidence: 82%, strategy: locator)
  const deleteDialog = page.locator('[role="dialog"]');
  await deleteDialog.waitFor({ state: 'visible' });
  await deleteDialog.getByRole('button', { name: 'Delete' }).click();

  // Final verification: Ensure redirection to the work packages list and the task is gone
  await page.waitForURL(new RegExp(`${BASE_HOST_URL}/work_packages`));
  await expect(page).toHaveURL(new RegExp(`${BASE_HOST_URL}/work_packages`));
  
  // Wait for the page to potentially reload the list after deletion
  await page.waitForLoadState('networkidle');
  
  // Assert that the created task is no longer visible on the page
  await expect(page.getByText(new RegExp(`${taskSubject} #\\d+`))).not.toBeVisible();
});