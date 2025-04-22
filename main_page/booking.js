// Import Firebase functions
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { app, auth } from '../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Initialize Firebase Database
const db = getDatabase(app);

// Show toast notification
function showBookingToast(message, isError = false) {
  const toast = document.getElementById("booking-toast");
  toast.textContent = message;
  toast.style.backgroundColor = isError ? "#e74c3c" : "#4CAF50";
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3000);
}

// Track user login status
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

// Handle form submission
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!currentUser) {
    showBookingToast("⚠️ Please login to book a table.", true);
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const guests = document.getElementById("guests").value.trim();

  if (!name || !email || !mobile || !date || !time || !guests) {
    showBookingToast("⚠️ Please fill all fields!", true);
    return;
  }

  const bookingData = {
    name,
    email,
    mobile,
    date,
    time,
    guests,
    uid: currentUser.uid
  };

  push(ref(db, "bookings/"), bookingData)
    .then(() => {
      showBookingToast("✅ Booking successful!");
      document.getElementById("bookingForm").reset();
    })
    .catch(err => {
      console.error("❌ Firebase Error:", err);
      showBookingToast("❌ Booking failed. Try again.", true);
    });
});
