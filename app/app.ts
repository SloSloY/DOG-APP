import { Application } from '@nativescript/core';
import { firebase } from '@nativescript/firebase-core';

// Configuration Firebase avec des valeurs de test pour StackBlitz
firebase.initializeApp({
    apiKey: "AIzaSyTest-Key-ForStackBlitz",
    authDomain: "test-stackblitz.firebaseapp.com",
    projectId: "test-stackblitz",
    storageBucket: "test-stackblitz.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
}).then(() => {
    console.log("Firebase initialized successfully");
}).catch(error => {
    console.error("Firebase init error:", error);
});

Application.run({ moduleName: 'app-root' });