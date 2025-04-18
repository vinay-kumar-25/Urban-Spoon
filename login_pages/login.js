import { auth, database, signInWithEmailAndPassword } from "../firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

console.log("✅ login.js is loaded!");

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function () {
    console.log("🟢 DOM fully loaded!");

    const loginForm = document.querySelector(".login-form");

    if (!loginForm) {
        console.error("❌ ERROR: login-form not found! Check your HTML file.");
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh
        console.log("🟢 Login form submitted");

        // Get email & password from form
        const email = document.querySelector(".login-form input[type='email']").value;
        const password = document.querySelector(".login-form input[type='password']").value;

        console.log("📥 Login Data:", { email, password });

        if (!email || !password) {
            alert("❌ Please enter both email and password.");
            return;
        }

        // Firebase Authentication - Sign In
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("✅ User logged in successfully!");
                const user = userCredential.user;
                const userId = user.uid;

                // Check if user is an Admin
                get(ref(database, "admins/" + userId))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            console.log("✅ Admin detected, redirecting to main website...");
                            alert("Welcome, Admin!");
                            window.location.href = "../main_page/index.html"; // Main Website Page
                        } else {
                            console.log("✅ User detected, redirecting to main website...");
                            alert("Welcome, User!");
                            window.location.href = "../main_page/index.html"; // Main Website Page
                        }
                    })
                    .catch((dbError) => {
                        console.error("❌ Database Error:", dbError);
                        alert("Database Error: " + dbError.message);
                    });

            })
            .catch((authError) => {
                console.error("❌ Authentication Error:", authError);
                alert("Authentication Error: " + authError.message);
            });
    });
});