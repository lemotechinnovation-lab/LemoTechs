/**
 * Environment Configuration Checker
 * Helps identify missing or misconfigured environment variables
 */

export interface EnvStatus {
  isConfigured: boolean;
  missing: string[];
  warnings: string[];
  service: string;
}

export class EnvChecker {
  /**
   * Check Firebase configuration status
   */
  static checkFirebase(): EnvStatus {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missing: string[] = [];
    const warnings: string[] = [];

    requiredVars.forEach(varName => {
      const value = import.meta.env[varName];
      if (!value) {
        missing.push(varName);
      } else if (value.includes('demo') || value.includes('your_') || value === 'demo-api-key') {
        warnings.push(`${varName} appears to be using demo/placeholder value`);
      }
    });

    return {
      isConfigured: missing.length === 0 && warnings.length === 0,
      missing,
      warnings,
      service: 'Firebase'
    };
  }

  /**
   * Check Google Maps configuration
   */
  static checkGoogleMaps(): EnvStatus {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const missing: string[] = [];
    const warnings: string[] = [];

    if (!apiKey) {
      missing.push('VITE_GOOGLE_MAPS_API_KEY');
    } else if (apiKey.includes('demo') || apiKey.includes('your_')) {
      warnings.push('VITE_GOOGLE_MAPS_API_KEY appears to be using demo/placeholder value');
    }

    return {
      isConfigured: missing.length === 0 && warnings.length === 0,
      missing,
      warnings,
      service: 'Google Maps'
    };
  }

  /**
   * Check all service configurations
   */
  static checkAll(): EnvStatus[] {
    return [
      this.checkFirebase(),
      this.checkGoogleMaps()
    ];
  }

  /**
   * Log configuration status to console
   */
  static logStatus(): void {
    const statuses = this.checkAll();
    
    console.group('🔧 Environment Configuration Status');
    
    statuses.forEach(status => {
      if (status.isConfigured) {
        console.log(`✅ ${status.service}: Properly configured`);
      } else {
        console.warn(`⚠️ ${status.service}: Using demo/fallback configuration`);
        
        if (status.missing.length > 0) {
          console.warn(`   Missing: ${status.missing.join(', ')}`);
        }
        
        if (status.warnings.length > 0) {
          status.warnings.forEach(warning => console.warn(`   ${warning}`));
        }
      }
    });

    const hasIssues = statuses.some(s => !s.isConfigured);
    if (hasIssues) {
      console.info('💡 To set up real configuration, see: FIREBASE_SETUP.md');
      console.info('🚀 Demo mode is sufficient for development and testing!');
    }
    
    console.groupEnd();
  }

  /**
   * Get development mode status
   */
  static isDevelopment(): boolean {
    return import.meta.env.DEV || import.meta.env.VITE_APP_ENV === 'development';
  }

  /**
   * Get production mode status  
   */
  static isProduction(): boolean {
    return import.meta.env.PROD || import.meta.env.VITE_APP_ENV === 'production';
  }
}

// Auto-run in development mode (disabled for cleaner console)
// if (EnvChecker.isDevelopment()) {
//   setTimeout(() => {
//     EnvChecker.logStatus();
//   }, 1000);
// }
