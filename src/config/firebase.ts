// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9G862VGVgEQBYc6LM4zEbIyWzlkU1oQE",
    authDomain: "jhon-socialmedia.firebaseapp.com",
    projectId: "jhon-socialmedia",
    storageBucket: "jhon-socialmedia.appspot.com",
    messagingSenderId: "161836652351",
    appId: "1:161836652351:web:e51bf6a97edb4d3807a58a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)