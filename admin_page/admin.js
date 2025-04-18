import { db } from './path-to-your/firebase-config.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// BOOKINGS
const bookingTableBody = document.getElementById("bookingTableBody");
const adminBookingsRef = ref(db, "admin/bookings");

onValue(adminBookingsRef, (snapshot) => {
  bookingTableBody.innerHTML = "";
  let totalProfit = 0;
  const data = snapshot.val();

  if (data) {
    Object.values(data).forEach((booking) => {
      totalProfit += (booking.guests || 1) * 200; // ₹200 per guest (example)
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${booking.name}</td>
        <td>${booking.email}</td>
        <td>${booking.mobile}</td>
        <td>${booking.date}</td>
        <td>${booking.time}</td>
        <td>${booking.guests}</td>
      `;
      bookingTableBody.appendChild(row);
    });
  } else {
    bookingTableBody.innerHTML = "<tr><td colspan='6'>No bookings</td></tr>";
  }

  document.getElementById("profitAmount").textContent = totalProfit;
});

// MOST LIKED DISH
const likedDishRef = ref(db, "admin/likes"); // Example structure
onValue(likedDishRef, (snapshot) => {
  const data = snapshot.val();
  let topDish = "No data";
  let maxLikes = 0;

  if (data) {
    Object.entries(data).forEach(([dish, count]) => {
      if (count > maxLikes) {
        maxLikes = count;
        topDish = dish;
      }
    });
  }

  document.getElementById("topDishName").textContent = `${topDish} (${maxLikes} likes)`;
});

// TESTIMONIALS
const testimonialRef = ref(db, "admin/testimonials"); // Example: admin/testimonials
onValue(testimonialRef, (snapshot) => {
  const data = snapshot.val();
  const list = document.getElementById("testimonialList");
  list.innerHTML = "";

  if (data) {
    Object.values(data).forEach((testimonial) => {
      const li = document.createElement("li");
      li.textContent = `"${testimonial.message}" – ${testimonial.name}`;
      list.appendChild(li);
    });
  } else {
    list.innerHTML = "<li>No testimonials yet.</li>";
  }
});
