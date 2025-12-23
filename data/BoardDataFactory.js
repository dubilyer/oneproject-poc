import { faker } from '@faker-js/faker';

/**
 * Data factory for creating board test data
 */
export class BoardDataFactory {
  /**
   * Build a board object with default or overridden properties
   * @param {object} overrides - Properties to override in the board data
   * @returns {object} - Board data object
   */
  static buildBoard(overrides = {}) {
    return {
      boardName: faker.company.name(),
      projectName: 'Demo project',
      timestamp: Date.now(),
      ...overrides
    };
  }

  /**
   * Build a board with a timestamped name for uniqueness
   * @param {object} overrides - Properties to override in the board data
   * @returns {object} - Board data object with timestamped name
   */
  static buildUniqueBoard(overrides = {}) {
    const baseBoard = this.buildBoard(overrides);
    return {
      ...baseBoard,
      boardName: `${baseBoard.boardName} ${baseBoard.timestamp}`,
      ...overrides
    };
  }
}
