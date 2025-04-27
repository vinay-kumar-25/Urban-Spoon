import { auth, database, signInWithEmailAndPassword } from "../firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

console.log("✅ login.js is loaded!");

document.addEventListener("DOMContentLoaded", function () {
    console.log("🟢 DOM fully loaded!");

    const loginForm = document.querySelector(".login-form");

    if (!loginForm) {
        console.error("❌ ERROR: login-form not found!");
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("🟢 Login form submitted");

        const email = document.querySelector(".login-form input[type='email']").value;
        const password = document.querySelector(".login-form input[type='password']").value;

        console.log("📥 Login Data:", { email, password });

        if (!email || !password) {
            showToast("❌ Please enter both email and password.", true);
            return;
        }

        // Sign in the user
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userId = user.uid;

                // First, get the user's name
                get(ref(database, "users/" + userId + "/name"))
                    .then((snapshot) => {
                        const userName = snapshot.exists() ? snapshot.val() : "User";

                        // Now check if the user is an admin
                        checkIfAdmin(userId, userName);
                    })
                    .catch((dbError) => {
                        console.error("❌ Error getting user name:", dbError);
                        showToast("Database Error: " + dbError.message, true);
                    });
            })
            .catch((authError) => {
                console.error("❌ Authentication Error:", authError);
                showToast("Invalid Username or Password", true);
            });
    });

    // Function to check if the user is an admin
    function checkIfAdmin(userId, userName) {
        get(ref(database, "admins/" + userId))
            .then((adminSnapshot) => {
                if (adminSnapshot.exists()) {
                    // Admin logic: Custom toast for admins
                    console.log("🔵 User is Admin. Redirecting to Admin Page...");
                    showToast(`Welcome Admin !`, false); // Admin welcome toast
                    setTimeout(() => {
                        window.location.href = "../admin_page/admin.html";
                    }, 2000); // Redirect after the toast
                } else {
                    // Regular user logic: Custom toast for normal users
                    console.log("🟢 User is Normal User. Redirecting to Main Page...");
                    showToast(`Welcome, ${userName}!`, false); // User welcome toast
                    setTimeout(() => {
                        window.location.href = "../main_page/index.html";
                    }, 2000); // Redirect after the toast
                }
            })
            .catch((adminCheckError) => {
                console.error("❌ Error checking admin:", adminCheckError);
                showToast("Admin check failed. Try again.", true);
            });
    }

    // Toast function to display messages
    function showToast(message, isError) {
        const toast = document.createElement("div");
        toast.className = isError ? "toast error" : "toast success";
        toast.textContent = message;
        document.body.appendChild(toast);

        // Delay to allow the transition
        setTimeout(() => {
            toast.classList.add("show");
        }, 300);

        // Remove toast after 2.5 seconds
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2500);
    }
});
