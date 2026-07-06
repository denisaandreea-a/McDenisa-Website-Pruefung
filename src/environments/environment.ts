import type { FirebaseOptions } from 'firebase/app';

export const environment = {
  production: false,
  firebase: {
    enabled: false,
    collectionName: 'products',
    config: {
      apiKey: 'DEINE_API_KEY',
      authDomain: 'DEIN_PROJEKT.firebaseapp.com',
      projectId: 'DEIN_PROJEKT_ID',
      storageBucket: 'DEIN_PROJEKT.firebasestorage.app',
      messagingSenderId: 'DEINE_SENDER_ID',
      appId: 'DEINE_APP_ID',
    } satisfies FirebaseOptions,
  },
};
