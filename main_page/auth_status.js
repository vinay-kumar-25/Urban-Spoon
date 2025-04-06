import { auth, onAuthStateChanged, signOut } from "../firebase-config.js";

console.log("✅ auth_status.js loaded!");

document.addEventListener("DOMContentLoaded", function () {
    const loginContainer = document.getElementById("login-container");

    if (!loginContainer) {
        console.error("❌ ERROR: login-container not found in HTML!");
        return;
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("🟢 User is logged in:", user);

            const profilePic = user.photoURL ? user.photoURL : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

            loginContainer.innerHTML = `
                <div class="user-info">
                    <img src="${profilePic}" alt="Profile Picture" class="profile-pic">
                    <button class="logout-btn">Logout</button>
                </div>
            `;

            document.querySelector(".logout-btn").addEventListener("click", () => {
                signOut(auth).then(() => {
                    console.log("🔴 User logged out");
                    window.location.reload();
                }).catch((error) => {
                    console.error("❌ Logout Error:", error);
                });
            });

        } else {
            console.log("🔴 User is not logged in.");
            loginContainer.innerHTML = `<a href="../login_pages/register_or_login.html" class="btn login-btn">Login</a>`;
        }
    });
});
