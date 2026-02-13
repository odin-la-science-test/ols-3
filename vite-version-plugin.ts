import type { Plugin } from 'vite';
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface VersionPluginOptions {
  outputFile?: string;
  includeGitInfo?: boolean;
}

interface VersionInfo {
  version: string;
  buildTime: string;
  gitHash?: string;
  gitBranch?: string;
  environment: 'development' | 'production';
}

export function versionPlugin(options: VersionPluginOptions = {}): Plugin {
  const {
    outputFile = 'version.json',
    includeGitInfo = true
  } = options;

  return {
    name: 'vite-version-plugin',
    
    buildStart() {
      const isDev = process.env.NODE_ENV !== 'production';
      
      // Générer la version basée sur le timestamp
      const now = new Date();
      const version = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}.${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
      
      const versionInfo: VersionInfo = {
        version,
        buildTime: now.toISOString(),
        environment: isDev ? 'development' : 'production'
      };

      // Ajouter les informations Git si disponibles
      if (includeGitInfo) {
        try {
          const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
          const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
          versionInfo.gitHash = gitHash;
          versionInfo.gitBranch = gitBranch;
        } catch (error) {
          console.warn('Git information not available:', error instanceof Error ? error.message : 'Unknown error');
        }
      }

      // Écrire le fichier version.json dans le dossier public
      try {
        mkdirSync('public', { recursive: true });
        const outputPath = join('public', outputFile);
        writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));
        console.log(`✓ Version file generated: ${outputPath}`);
        console.log(`  Version: ${versionInfo.version}`);
        if (versionInfo.gitHash) {
          console.log(`  Git: ${versionInfo.gitBranch}@${versionInfo.gitHash}`);
        }
      } catch (error) {
        throw new Error(`Failed to write version file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
}
