import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.scribel.fr',
  appName: 'scribel',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
