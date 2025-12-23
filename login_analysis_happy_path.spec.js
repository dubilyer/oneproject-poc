import 'dotenv/config';
import { test, expect } from '@playwright/test';


test('login_analysis_happy_path', async ({ page, context }) => {
  try {
    // Step 1: Navigate to the OpenProject login page.
    await page.goto(process.env.LOGIN_URL || process.env.BASE_URL);
    await expect(page).toHaveURL(process.env.LOGIN_URL || process.env.BASE_URL);

    // Step 2: Enter the username into the username field.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' }) (confidence: 97%, strategy: form_action_role)
    //   2. page.getByRole('textbox', { name: 'Username' }) (confidence: 95%, strategy: role_name)
    //   3. page.getByLabel('Username') (confidence: 93%, strategy: label_text)
    //   4. page.locator('input[type="text"][name="username"]') (confidence: 89%, strategy: css_combined)
    //   5. page.locator('#username') (confidence: 75%, strategy: id)
    await page.locator('form[action*="login"]').getByRole('textbox', { name: 'Username' }).fill(process.env.UI_SITE_USERNAME);

    // Step 3: Enter the password into the password field.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' }) (confidence: 97%, strategy: form_action_role)
    //   2. page.getByRole('textbox', { name: 'Password' }) (confidence: 95%, strategy: role_name)
    //   3. page.getByLabel('Password') (confidence: 93%, strategy: label_text)
    //   4. page.locator('input[type="password"][name="password"]') (confidence: 89%, strategy: css_combined)
    //   5. page.locator('#password') (confidence: 75%, strategy: id)
    await page.locator('form[action*="login"]').getByRole('textbox', { name: 'Password' }).fill(process.env.UI_SITE_PASSWORD);

    // Step 4: Click the 'Sign in' button to submit credentials.
    // Captured selectors:
    //   1. page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }) (confidence: 97%, strategy: form_action_role_regex)
    //   2. page.getByRole('button', { name: /Sign in/ }) (confidence: 95%, strategy: role_name_regex)
    //   3. page.locator('input[value="Sign in"]') (confidence: 89%, strategy: css_tag_value)
    //   4. page.locator('input[data-controller="disable-when-clicked"]') (confidence: 85%, strategy: data_attr_controller)
    //   5. page.locator('#login-form').getByRole('button', { name: 'Sign in' }) (confidence: 82%, strategy: parent_id_role)
    await page.locator('form[action*="login"]').getByRole('button', { name: /Sign in/ }).click();

    // Step 5: Verify successful login by confirming navigation to the application homepage.
    const expectedUrl = new RegExp(`^${process.env.LOGIN_HOST_URL || process.env.BASE_HOST_URL}/?$`);
    await page.waitForURL(expectedUrl, { timeout: 30000 });
    await expect(page).toHaveURL(expectedUrl);

    // Wait for authentication to fully propagate
    await page.waitForLoadState('networkidle');
    
    // Save authenticated state for other tests to reuse
    await context.storageState({ path: '../.auth/storage-state.json' });
    console.log('✅ Storage state saved - other tests can now skip login!');

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
});