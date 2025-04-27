import { auth, database, createUserWithEmailAndPassword, ref, set } from "../firebase-config.js";

console.log("✅ admin_reg.js is loaded!");

// Wait for the DOM to fully load before running the script
document.addEventListener("DOMContentLoaded", function () {
    console.log("🟢 DOM fully loaded!");

    const registerForm = document.getElementById("register-form");

    if (!registerForm) {
        console.error("❌ ERROR: register-form not found! Check your HTML file.");
        return;
    }

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevents form refresh
        console.log("🟢 Admin Register form submitted");

        // Get form values
        const firstName = document.getElementById("first-name")?.value || "";
        const lastName = document.getElementById("last-name")?.value || "";
        const email = document.getElementById("email")?.value || "";
        const phone = document.getElementById("phone")?.value || "";
        const password = document.getElementById("password")?.value || "";
        const securityKey=document.getElementById("admin-key")?.value || "";
        console.log("📥 Form Data:", { firstName, lastName, email, phone, password });

        const predefinedKey = "gatekholo";  // Set your predefined security key here
        if (securityKey !== predefinedKey) {
            alert("❌ Invalid Security Key.");
            return;
        }

        // If any field is empty, show an error
        if (!firstName || !lastName || !email || !phone || !password) {
            alert("❌ Please fill in all fields.");
            return;
        }

        // Firebase Authentication - Register Admin
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("✅ Admin registered successfully!");
                const user = userCredential.user;
                const userId = user.uid;

                // Store Admin Details in Firebase Realtime Database
                set(ref(database, "admins/" + userId), {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    role: "admin", // Marking user as admin
                    createdAt: new Date().toISOString()
                })
                .then(() => {
                    console.log("✅ Admin data stored in Firebase DB");
                    alert("Admin Registration Successful! Redirecting to login...");
                    window.location.href = "register_or_login.html"; // Redirect to Admin Login Page
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
