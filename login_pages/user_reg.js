import { auth, database, createUserWithEmailAndPassword, ref, set } from "../firebase-config.js";

console.log("✅ user_reg.js is loaded!");

document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from refreshing the page
    console.log("🟢 Register form submitted");

    // Get form values
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    console.log("📥 Form Data:", { firstName, lastName, email, phone, password });

    // Firebase Authentication - Register User
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("✅ User registered successfully!");
            const user = userCredential.user;
            const userId = user.uid;

            // Store User Details in Realtime Database
            set(ref(database, "users/" + userId), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                createdAt: new Date().toISOString()
            })
            .then(() => {
                console.log("✅ User data stored in Firebase DB");
                alert("Registration Successful! Redirecting to login...");
                window.location.href = "register_or_login.html"; // Redirect to Login Page
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
