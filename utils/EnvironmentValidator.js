/**
 * Environment variable validation and sanitization utilities
 */
export class EnvironmentValidator {
  /**
   * Required environment variables for the application
   */
  static REQUIRED_VARS = [
    'BASE_HOST_URL',
    'BASE_URL', 
    'LOGIN_HOST_URL',
    'LOGIN_URL',
    'UI_SITE_USERNAME',
    'UI_SITE_PASSWORD'
  ];

  /**
   * Validates that all required environment variables are present and valid
   * @throws {Error} If any required variables are missing or invalid
   */
  static validateEnvironment() {
    const missing = [];
    const invalid = [];

    for (const varName of this.REQUIRED_VARS) {
      const value = process.env[varName];
      
      if (!value || value.trim() === '') {
        missing.push(varName);
        continue;
      }

      // Validate URL format for URL variables
      if (varName.includes('URL')) {
        if (!this.isValidUrl(value)) {
          invalid.push(`${varName}: Invalid URL format`);
        }
      }

      // Validate credentials are not empty or contain dangerous characters
      if (varName.includes('USERNAME') || varName.includes('PASSWORD')) {
        if (!this.isValidCredential(value)) {
          invalid.push(`${varName}: Contains invalid characters`);
        }
      }
    }

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (invalid.length > 0) {
      throw new Error(`Invalid environment variables: ${invalid.join(', ')}`);
    }
  }

  /**
   * Safely gets an environment variable with validation
   * @param {string} varName - Environment variable name
   * @param {string} defaultValue - Default value if not found
   * @returns {string} - Sanitized environment variable value
   */
  static getVar(varName, defaultValue = '') {
    const value = process.env[varName];
    
    if (!value) {
      if (this.REQUIRED_VARS.includes(varName)) {
        throw new Error(`Required environment variable ${varName} is not set`);
      }
      return defaultValue;
    }

    return this.sanitizeValue(value.trim());
  }

  /**
   * Validates URL format
   * @param {string} url - URL to validate
   * @returns {boolean} - Whether URL is valid
   */
  static isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Validates credential format (no dangerous characters)
   * @param {string} credential - Credential to validate
   * @returns {boolean} - Whether credential is valid
   */
  static isValidCredential(credential) {
    // Check for dangerous characters that could cause injection
    const dangerousChars = /[<>'";&|`$(){}[\]]/;
    return !dangerousChars.test(credential) && credential.length > 0;
  }

  /**
   * Sanitizes a value by removing dangerous characters
   * @param {string} value - Value to sanitize
   * @returns {string} - Sanitized value
   */
  static sanitizeValue(value) {
    if (typeof value !== 'string') {
      return '';
    }
    
    // Remove any potential command injection characters for non-credential fields
    return value.replace(/[`$(){}[\]]/g, '');
  }

  /**
   * Sanitizes credentials more strictly
   * @param {string} credential - Credential to sanitize
   * @returns {string} - Sanitized credential
   */
  static sanitizeCredential(credential) {
    if (typeof credential !== 'string') {
      throw new Error('Credential must be a string');
    }
    
    if (!this.isValidCredential(credential)) {
      throw new Error('Credential contains invalid characters');
    }
    
    return credential.trim();
  }
}
