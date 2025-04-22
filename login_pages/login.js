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

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userId = user.uid;

                // Get user name
                get(ref(database, "users/" + userId + "/name"))
                    .then((snapshot) => {
                        const userName = snapshot.exists() ? snapshot.val() : "User";

                        // Show welcome toast
                        showToast(`Welcome, ${userName}!`, false);

                        // Redirect after 2 seconds
                        setTimeout(() => {
                            window.location.href = "../main_page/index.html";
                        }, 2000);
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

    // Toast function
    function showToast(message, isError) {
        const toast = document.createElement("div");
        toast.className = isError ? "toast error" : "toast success";
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add("show");
        }, 300); // Slight delay to allow CSS transition

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2500); // Total visible time
    }
});
