import type { FirebaseOptions } from 'firebase/app';

export const environment = {
  production: false,
  firebase: {
    enabled: true,
    collectionName: 'products',
    config: {
      apiKey: 'AIzaSyDriVvRpmtfE-KVHqJnazLbT86Hi5wLgcU',
      authDomain: 'mcdenisa-f479f.firebaseapp.com',
      projectId: 'mcdenisa-f479f',
      storageBucket: 'mcdenisa-f479f.firebasestorage.app',
      messagingSenderId: '521030571783',
      appId: '1:521030571783:web:caaaf79999b4afc0e9d7a2',
    } satisfies FirebaseOptions,
  },
};
