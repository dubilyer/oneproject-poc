import 'dotenv/config';
import { test } from '@playwright/test';
import { WorkPackagesPage } from '../../pom/WorkPackagesPage.js';
import { WorkPackageDataFactory } from '../../data/WorkPackageDataFactory.js';

test.describe('Work Package Management', () => {
  test('User can create and delete a task', async ({ page }) => {
    const workPackagesPage = new WorkPackagesPage(page);
    const taskData = WorkPackageDataFactory.buildUniqueTask();
    
    await workPackagesPage.createWorkPackage(taskData.subject, taskData.description, taskData.projectName);
    await workPackagesPage.deleteWorkPackage();
    await workPackagesPage.verifyTaskNotVisible(taskData.subject);
  });
});
