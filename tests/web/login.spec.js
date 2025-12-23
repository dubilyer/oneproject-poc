import 'dotenv/config';
import { test } from '@playwright/test';
import { LoginPage } from '../../pom/LoginPage.js';

test('User can login successfully and save authentication state', async ({ page, context }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.login();
  await loginPage.saveAuthState(context);
});
