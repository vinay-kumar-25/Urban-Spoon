import { auth, onAuthStateChanged, signOut } from "../firebase-config.js";

console.log("✅ auth_status.js loaded!");

document.addEventListener("DOMContentLoaded", function () {
    const loginContainers = document.querySelectorAll("#login-container");

    if (loginContainers.length === 0) {
        console.error("❌ ERROR: No element with class 'login-container' found in HTML!");
        return;
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("🟢 User is logged in:", user);
            console.log("🖼️ User photoURL:", user.photoURL);

            const profilePic = user.photoURL
                ? user.photoURL
                : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

            loginContainers.forEach((container) => {
                container.innerHTML = `
                    <div class="user-info">
                        <img src="${profilePic}" alt="Profile" class="profile-pic" />
                        <button class="logout-btn">Logout</button>
                    </div>
                `;
            });

            // Attach logout button event listeners to all logout buttons
            document.querySelectorAll(".logout-btn").forEach((btn) => {
                btn.addEventListener("click", () => {
                    signOut(auth)
                        .then(() => {
                            console.log("🔴 User logged out");
                            window.location.reload();
                        })
                        .catch((error) => {
                            console.error("❌ Logout Error:", error);
                        });
                });
            });

        } else {
            console.log("🔴 User is not logged in.");
            loginContainers.forEach((container) => {
                container.innerHTML = `
                    <a href="../login_pages/register_or_login.html" class="btn login-btn">Login</a>
                `;
            });
        }
    });
});
