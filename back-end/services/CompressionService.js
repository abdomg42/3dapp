import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

class CompressionService {
  /**
   * Compress multiple files into a single archive
   * @param {Array} files - Array of file objects with path and name
   * @param {string} outputPath - Path where the compressed file will be saved
   * @param {string} archiveName - Name of the archive file
   * @returns {Promise<string>} - Path to the created archive
   */
  static async compressFiles(files, outputPath, archiveName) {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      const output = fs.createWriteStream(outputPath);
      
      output.on('close', () => {
        console.log(`✅ Archive created: ${archive.pointer()} total bytes`);
        resolve(outputPath);
      });

      archive.on('error', (err) => {
        console.error('❌ Archive error:', err);
        reject(err);
      });

      archive.pipe(output);

      // Add each file to the archive
      files.forEach(file => {
        if (fs.existsSync(file.path)) {
          archive.file(file.path, { name: file.name });
          console.log(`📁 Added to archive: ${file.name}`);
        } else {
          console.warn(`⚠️ File not found: ${file.path}`);
        }
      });

      archive.finalize();
    });
  }

  /**
   * Create a compressed archive from multiple model and texture files
   * @param {Array} modelFiles - Array of model file objects with path and originalname
   * @param {Array} textureFiles - Array of texture file objects with path and originalname
   * @param {string} productName - The product name to use for the archive
   * @returns {Promise<string>} - Path to the created archive
   */
  static async createMultiFileArchive(modelFiles = [], textureFiles = [], productName = 'files') {
    const safeName = productName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const archiveName = `${safeName}.zip`;
    const outputPath = path.join(process.cwd(), 'upload', 'files', archiveName);

    const files = [];
    modelFiles.forEach(file => {
      if (fs.existsSync(file.path)) {
        files.push({
          path: file.path,
          name: file.originalname || path.basename(file.path)
        });
      }
    });
    textureFiles.forEach(file => {
      if (fs.existsSync(file.path)) {
        files.push({
          path: file.path,
          name: file.originalname || path.basename(file.path)
        });
      }
    });
    if (files.length === 0) {
      throw new Error('No valid files found for compression');
    }
    try {
      const archivePath = await this.compressFiles(files, outputPath, archiveName);
      console.log(`✅ Multi-file archive created: ${archivePath}`);
      console.log(`📦 Total files in archive: ${files.length}`);
      return archivePath;
    } catch (error) {
      console.error('❌ Error creating multi-file archive:', error);
      throw error;
    }
  }

  /**
   * Clean up multiple files after compression
   * @param {Array} modelFiles - Array of model file objects
   * @param {Array} textureFiles - Array of texture file objects
   */
  static async cleanupMultipleFiles(modelFiles = [], textureFiles = []) {
    const allFiles = [...modelFiles, ...textureFiles];
    
    for (const file of allFiles) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
          console.log(`🗑️ Deleted: ${file.originalname || path.basename(file.path)}`);
        }
      } catch (error) {
        console.error(`❌ Error deleting file ${file.originalname || path.basename(file.path)}:`, error);
      }
    }
  }
}

export default CompressionService; 