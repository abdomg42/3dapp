import path from 'path';
import { spawn } from 'child_process';

class EmbeddingService {
  constructor() {
    this.pythonScript = path.join(process.cwd(),'back-end', 'mobilenet_faiss.py');
  }

  async executePythonScript(action, imagePath, imageId = null, topK = 15) {
    return new Promise((resolve, reject) => {
      const args = ['--action', action, '--image', imagePath];
      if (imageId) args.push('--image_id', imageId.toString());
      if (action === 'search') args.push('--top_k', topK.toString());
      
      const pythonProcess = spawn('python', [this.pythonScript, ...args]);
      
      let stdout = '';
      let stderr = '';
      
      pythonProcess.stdout.on('data', (data) => stdout += data.toString());
      pythonProcess.stderr.on('data', (data) => stderr += data.toString());
      
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${stderr}`));
          return;
        }
        try {
          resolve(JSON.parse(stdout));
        } catch (error) {
          reject(new Error(`Failed to parse output: ${stdout}`));
        }
      });
    });
  }

  async addEmbedding(imagePath, imageId) {
    const result = await this.executePythonScript('add', imagePath, imageId);
    return result.success;
  }

  async searchSimilar(imagePath, topK = 15) {
    const result = await this.executePythonScript('search', imagePath, null, topK);
    return result.results || [];
  }
}

export default new EmbeddingService(); 