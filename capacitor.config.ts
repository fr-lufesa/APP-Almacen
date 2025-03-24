import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'almacen',
  webDir: 'www',
  server: {
  url: "http://192.168.0.174:4200",
  cleartext: true
},
plugins: {
  Keyboard: {
    resize: "ionic", // o "ionic" o "none"
  },
},
};

export default config;
