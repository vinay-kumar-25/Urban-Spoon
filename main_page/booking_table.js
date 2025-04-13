import { ref, set } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { database } from "./firebase-config.js"; // Import Firebase config

const form = document.getElementById("bookingForm"); // Get the form by ID
const successAlert = document.getElementById("success-alert"); // Get success alert element

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Get input values from the form
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const guests = document.getElementById("guests").value;

  // Log the form data for debugging
  console.log("Booking Data: ", { name, email, mobile, date, time, guests });

  try {
    // Create a unique booking ID (using timestamp as a unique ID)
    const bookingId = new Date().getTime(); // Using timestamp as unique ID

    // Send data to Firebase Realtime Database
    await set(ref(database, "bookings/" + bookingId), {
      name: name,
      email: email,
      mobile: mobile,
      date: date,
      time: time,
      guests: guests,
    });

    // Show success alert box
    successAlert.style.display = "block"; // Make alert visible
    successAlert.textContent = "Booking Successful!"; // Update the message

    // Hide the alert after 3 seconds
    setTimeout(() => {
      successAlert.style.display = "none"; // Hide the alert after 3 seconds
    }, 3000);

    // Reset the form after submission
    form.reset(); // Reset the form fields after submission
  } catch (error) {
    // Handle errors
    console.error("Error with booking submission:", error);
    alert("There was an error with your booking. Please try again.");
  }
});
