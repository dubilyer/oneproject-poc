import * as path from 'path';
import * as fs from 'fs';

/**
 * Utilities for safe path handling and validation
 */
export class PathSanitizer {
  /**
   * Allowed directories for file operations
   */
  static ALLOWED_DIRS = [
    '.auth',
    'test-results',
    'playwright-report'
  ];

  /**
   * Allowed file extensions
   */
  static ALLOWED_EXTENSIONS = [
    '.json',
    '.html',
    '.zip',
    '.png',
    '.jpg'
  ];

  /**
   * Sanitizes and validates a file path
   * @param {string} filePath - The file path to sanitize
   * @param {string} baseDir - The base directory (defaults to current working directory)
   * @returns {string} - Sanitized and validated path
   * @throws {Error} - If path is invalid or unsafe
   */
  static sanitizePath(filePath, baseDir = process.cwd()) {
    if (typeof filePath !== 'string' || filePath.trim() === '') {
      throw new Error('File path must be a non-empty string');
    }

    // Remove any dangerous characters
    const cleanPath = filePath.replace(/[<>"|?*]/g, '');
    
    // Resolve the path to prevent directory traversal
    const resolvedPath = path.resolve(baseDir, cleanPath);
    
    // Ensure the resolved path is within the base directory
    if (!resolvedPath.startsWith(path.resolve(baseDir))) {
      throw new Error(`Path traversal detected: ${filePath}`);
    }
    
    // Check if the directory is in the allowed list
    const relativePath = path.relative(baseDir, resolvedPath);
    const topLevelDir = relativePath.split(path.sep)[0];
    
    if (topLevelDir && !this.ALLOWED_DIRS.includes(topLevelDir)) {
      throw new Error(`Access to directory '${topLevelDir}' is not allowed`);
    }
    
    // Validate file extension
    const extension = path.extname(resolvedPath);
    if (extension && !this.ALLOWED_EXTENSIONS.includes(extension)) {
      throw new Error(`File extension '${extension}' is not allowed`);
    }
    
    return resolvedPath;
  }

  /**
   * Safely creates a directory if it doesn't exist
   * @param {string} dirPath - Directory path to create
   * @returns {string} - Sanitized directory path
   */
  static async ensureDirectoryExists(dirPath) {
    const safePath = this.sanitizePath(dirPath);
    const dirname = path.dirname(safePath);
    
    try {
      await fs.promises.mkdir(dirname, { recursive: true });
      return safePath;
    } catch (error) {
      throw new Error(`Failed to create directory: ${error.message}`);
    }
  }

  /**
   * Validates that a file path is safe for writing
   * @param {string} filePath - The file path to validate
   * @returns {boolean} - Whether the path is safe
   */
  static isPathSafe(filePath) {
    try {
      this.sanitizePath(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets a safe path for storage state file
   * @returns {string} - Safe path for storage state
   */
  static getStorageStatePath() {
    return this.sanitizePath('.auth/storage-state.json');
  }
}
