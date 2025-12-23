import { Environment } from './Environment.js';
import environmentsData from './data/environments.json' assert { type: 'json' };

/**
 * Factory class for creating Environment instances based on environment name
 */
export class EnvironmentFactory {
  /**
   * Creates an Environment instance for the specified environment
   * @param {string} environmentName - The name of the environment (defaults to 'dev')
   * @returns {Environment} - Environment instance
   * @throws {Error} - If the environment is not found
   */
  static create(environmentName = process.env.ENVIRONMENT || 'dev') {
    const config = environmentsData[environmentName];
    
    if (!config) {
      throw new Error(`Environment '${environmentName}' not found. Available environments: ${Object.keys(environmentsData).join(', ')}`);
    }
    
    return new Environment(config);
  }

  /**
   * Get all available environment names
   * @returns {string[]} - Array of environment names
   */
  static getAvailableEnvironments() {
    return Object.keys(environmentsData);
  }
}
