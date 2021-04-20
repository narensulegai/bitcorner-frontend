import firebase from 'firebase/app';
import 'firebase/auth';

const app = firebase.initializeApp({
  apiKey: 'AIzaSyD0KdL1iGJdhkWyaPjVXxjknhdTRnc6Xb8',
  authDomain: 'bitcorner-7f9ee.firebaseapp.com',
  projectId: 'bitcorner-7f9ee',
  storageBucket: 'bitcorner-7f9ee.appspot.com',
  messagingSenderId: '302168724338',
  appId: '1:302168724338:web:c7f3826aa199226dd903eb',
});

export const auth = app.auth();
export default app;
