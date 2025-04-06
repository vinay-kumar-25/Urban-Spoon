// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyB6UYaC3_TJE_QMN_mrRcyp1vnDolWIXzw",
    authDomain: "urban-spoon-4690f.firebaseapp.com",
    databaseURL: "https://urban-spoon-4690f-default-rtdb.firebaseio.com",
    projectId: "urban-spoon-4690f",
    storageBucket: "urban-spoon-4690f.appspot.com", // ✅ Fixed storageBucket
    messagingSenderId: "434825136259",
    appId: "1:434825136259:web:ff6bdc6215aca4b1e8b3b6",
    measurementId: "G-KX0ER3LJ2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ✅ Export everything properly
export { app, auth, database, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, ref, set, get };
