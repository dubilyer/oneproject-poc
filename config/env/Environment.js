/**
 * Environment configuration class that holds all environment-specific settings
 */
export class Environment {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.baseHostUrl = config.baseHostUrl;
    this.loginUrl = config.loginUrl;
    this.loginHostUrl = config.loginHostUrl;
    this.credentials = {
      username: this.resolveEnvVariable(config.credentials.username),
      password: this.resolveEnvVariable(config.credentials.password)
    };
  }

  /**
   * Resolves environment variables in the format ${VAR_NAME}
   * @param {string} value - The value that might contain environment variable references
   * @returns {string} - The resolved value
   */
  resolveEnvVariable(value) {
    if (typeof value !== 'string') return value;
    
    const envVarPattern = /\$\{([^}]+)\}/g;
    return value.replace(envVarPattern, (match, varName) => {
      return process.env[varName] || match;
    });
  }

  /**
   * Get username for authentication
   * @returns {string} - Username
   */
  getUsername() {
    return this.credentials.username;
  }

  /**
   * Get password for authentication
   * @returns {string} - Password
   */
  getPassword() {
    return this.credentials.password;
  }

  /**
   * Get base URL for the application
   * @returns {string} - Base URL
   */
  getBaseUrl() {
    return this.baseUrl;
  }

  /**
   * Get base host URL for the application
   * @returns {string} - Base host URL
   */
  getBaseHostUrl() {
    return this.baseHostUrl;
  }

  /**
   * Get login URL for the application
   * @returns {string} - Login URL
   */
  getLoginUrl() {
    return this.loginUrl;
  }

  /**
   * Get login host URL for the application
   * @returns {string} - Login host URL
   */
  getLoginHostUrl() {
    return this.loginHostUrl;
  }
}
