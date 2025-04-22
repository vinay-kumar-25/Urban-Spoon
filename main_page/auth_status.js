import { auth, onAuthStateChanged, signOut } from "../firebase-config.js";

console.log("✅ auth_status.js loaded!");

document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.getElementById("login-container");
  const sideLoginBtn = document.querySelector(".sidelogin-btn");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("🟢 User is logged in:", user);
      const profilePic = user.photoURL || "https://cdn-icons-png.flaticon.com/512/847/847969.png";

      // ✅ Update TOP navbar login container
      if (loginContainer) {
        loginContainer.innerHTML = `
          <div class="user-info">
            <button class="logout-btn">Logout</button>
          </div>
        `;
      }

      // ✅ Update sidebar login button
      if (sideLoginBtn) {
        sideLoginBtn.className = "logout-btn-side";
        sideLoginBtn.innerHTML = `Logout`;
      }

      // ✅ Add logout event listeners for both buttons
      document.querySelectorAll(".logout-btn, .logout-btn-side").forEach((btn) => {
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

      // ✅ Show login button in top navbar
      if (loginContainer) {
        loginContainer.innerHTML = `
          <a href="../login_pages/register_or_login.html" class="btn login-btn">Login</a>
        `;
      }

      // ✅ Show login button in sidebar
      if (sideLoginBtn) {
        sideLoginBtn.className = "sidelogin-btn";
        sideLoginBtn.innerHTML = `Login`;
      }
    }
  });
});
