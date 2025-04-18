// Import Firebase database functions
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { app } from '../firebase-config.js'; // Adjusted path to parent folder

// Initialize Firebase database reference
const db = getDatabase(app);

// Add event listener for form submission
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload on form submit

  // Get form data
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const guests = document.getElementById("guests").value;

  // Validate input fields
  if (!name || !email || !mobile || !date || !time || !guests) {
    alert("Please fill all fields!");
    return;
  }

  // Show success alert
  document.getElementById("success-alert").style.display = "block";

  // Clear the form
  document.getElementById("bookingForm").reset();

  // Hide the success alert after 3 seconds
  setTimeout(() => {
    document.getElementById("success-alert").style.display = "none";
  }, 3000);

  // Save data to Firebase Realtime Database
  writeBookingDataToFirebase({ name, email, mobile, date, time, guests });
});

// Function to write booking data to Firebase
function writeBookingDataToFirebase(data) {
  const bookingsRef = ref(db, 'bookings/'); // Reference to the 'bookings' node in Firebase
  push(bookingsRef, data)  // Push the data to Firebase
    .then(() => console.log("Data saved!"))
    .catch(err => console.error("Error:", err));
}
