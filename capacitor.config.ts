import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.financialrhythm.app',
  appName: 'Financial Rhythm',
  webDir: 'dist',
  backgroundColor: '#FAF5EF',
  android: {
    backgroundColor: '#FAF5EF',
    allowMixedContent: true
  }
};

export default config;
