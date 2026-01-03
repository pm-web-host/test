// firebase-config.js
// Initializes Firebase and makes the database instance available globally.

const firebaseConfig = {
  apiKey: "AIzaSyCahBr0Ijw0zpx3M-ogPaFfOEvyBuRX7iE",
  authDomain: "mail-tblood.firebaseapp.com",
  projectId: "mail-tblood",
  storageBucket: "mail-tblood.firebasestorage.app",
  messagingSenderId: "110577989516",
  appId: "1:110577989516:web:9cf35ce9099db26ea788a9",
  measurementId: "G-JLB11MXB8C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Make db available to other scripts that might need it directly
window.db = db;