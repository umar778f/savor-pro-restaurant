// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzoMeAZY6dWAv3AyNEsvxN8yS_6vFxe7Q",
  authDomain: "savor-pro-restaurant.firebaseapp.com",
  projectId: "savor-pro-restaurant",
  storageBucket: "savor-pro-restaurant.firebasestorage.app",
  messagingSenderId: "348614269716",
  appId: "1:348614269716:web:3b4bc05a867607fbcac001",
  measurementId: "G-YET07EB9LQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);