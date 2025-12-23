import { faker } from '@faker-js/faker';

/**
 * Data factory for creating work package test data
 */
export class WorkPackageDataFactory {
  /**
   * Build a work package object with default or overridden properties
   * @param {object} overrides - Properties to override in the work package data
   * @returns {object} - Work package data object
   */
  static buildWorkPackage(overrides = {}) {
    return {
      subject: faker.lorem.sentence(3),
      description: faker.lorem.paragraph(),
      projectName: 'Demo project',
      type: 'Task',
      timestamp: Date.now(),
      ...overrides
    };
  }

  /**
   * Build a work package with a timestamped subject for uniqueness
   * @param {object} overrides - Properties to override in the work package data
   * @returns {object} - Work package data object with timestamped subject
   */
  static buildUniqueWorkPackage(overrides = {}) {
    const baseWorkPackage = this.buildWorkPackage(overrides);
    return {
      ...baseWorkPackage,
      subject: `${baseWorkPackage.subject} ${baseWorkPackage.timestamp}`,
      description: `${baseWorkPackage.description} ${new Date().toISOString()}`,
      ...overrides
    };
  }

  /**
   * Build a task work package (alias for buildWorkPackage with type 'Task')
   * @param {object} overrides - Properties to override in the task data
   * @returns {object} - Task data object
   */
  static buildTask(overrides = {}) {
    return this.buildWorkPackage({ type: 'Task', ...overrides });
  }

  /**
   * Build a unique task work package
   * @param {object} overrides - Properties to override in the task data
   * @returns {object} - Task data object with timestamped subject
   */
  static buildUniqueTask(overrides = {}) {
    return this.buildUniqueWorkPackage({ type: 'Task', ...overrides });
  }
}
