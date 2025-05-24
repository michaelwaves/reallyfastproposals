// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANjKsnTqtymLRG1D0jat3cP8vAl7XLKik",
    authDomain: "reallyfastproposals.firebaseapp.com",
    projectId: "reallyfastproposals",
    storageBucket: "reallyfastproposals.firebasestorage.app",
    messagingSenderId: "594613893826",
    appId: "1:594613893826:web:4d3e071db009572baf595b",
    measurementId: "G-F0W1Q6JBWZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)