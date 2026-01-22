import fs from 'fs';
import path from 'path';

export class SessionStorage {
  private static AUTH_KEY = 'linkedin_auth_state';

  static async load(targetPath: string): Promise<boolean> {
    const localPath = path.join(process.cwd(), '../linkedin-auth.json');
    if (fs.existsSync(localPath)) {
      fs.copyFileSync(localPath, targetPath);
      return true;
    }
    return false;
  }

  static async save(sourcePath: string) {
    if (!fs.existsSync(sourcePath)) return;
    
    const localPath = path.join(process.cwd(), '../linkedin-auth.json');
    fs.copyFileSync(sourcePath, localPath);
  }
}
