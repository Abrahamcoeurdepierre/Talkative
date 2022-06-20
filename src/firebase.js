
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAoaupDF6V0EDCk0w3x345_T1AJlXzv0bE",
  authDomain: "talkative-d32b6.firebaseapp.com",
  projectId: "talkative-d32b6",
  storageBucket: "talkative-d32b6.appspot.com",
  messagingSenderId: "8024096180",
  appId: "1:8024096180:web:150ae1bfb33707363586e1",
  measurementId: "G-8N1CJT32LP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();

export { db , auth };