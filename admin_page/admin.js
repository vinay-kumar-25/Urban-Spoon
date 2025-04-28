// Import Firebase config and services from firebase-config.js
import { auth, database, ref, get  } from '../firebase-config.js'; // Correct path to the config file
// Correct import statement for Firebase functions
import {onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { app } from '../firebase-config.js';  // This remains for your app initialization


// DOM element where loyal users will be displayed
const loyalCustomersContent = document.querySelector('.loyal-customers-content');

// Fetch loyal customers from Firebase
function fetchLoyalCustomers() {
  const usersRef = ref(database, 'users/');
  
  get(usersRef).then((snapshot) => {
    loyalCustomersContent.innerHTML = ""; // Clear previous content

    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      const div = document.createElement('div');
      div.className = 'loyal-customer';
      div.innerHTML = `
        <strong>${user.firstName} ${user.lastName}</strong><br/>
        Ⓜ️ ${user.email}<br/>
        ☎️ ${user.phone}
      `;
      loyalCustomersContent.appendChild(div);
    });
  }).catch((error) => {
    console.error("Error fetching loyal customers:", error);
  });
}

// Call the function on page load
fetchLoyalCustomers();



// for the most liked dished

// Function to load all cart data from Firebase
function loadCartFromFirebase() {
  const cartRef = ref(database, 'carts/'); // Access the entire carts node
  get(cartRef).then((snapshot) => {
    if (snapshot.exists()) {
      const allCarts = snapshot.val(); // Get all carts data
      processTopDishes(allCarts); // Process the data to get the top dishes
    } else {
      console.error("No cart data found.");
    }
  });
}
// Function to process cart data and get the top 5 most purchased dishes
function processTopDishes(allCarts) {
  // Create an object to store dish data (quantity and image URL)
  const dishData = {}; // Renamed from dishQuantities for clarity

  // Iterate over all carts of all users
  Object.keys(allCarts).forEach(userId => {
    const cartItems = allCarts[userId]; // Cart items for this user
    cartItems.forEach(item => {
      if (item && item.name) {
        if (dishData[item.name]) {
          // Accumulate quantity for the same dish
          dishData[item.name].quantity += item.quantity;
        } else {
          // Initialize if the dish is not in the object
          // Store both quantity AND the image URL
          // Assumption: The original cart item 'item' has an 'img' property with the URL
          dishData[item.name] = {
            quantity: item.quantity,
            img: item.img // Store the image URL here
          };
        }
      }
    });
  });

  const dishesArray = Object.keys(dishData).map(dishName => {
    return {
      name: dishName,
      quantity: dishData[dishName].quantity, // Get quantity from the stored object
      img: dishData[dishName].img // Get image URL from the stored object
    };
  });

  // Sort the dishes in descending order based on quantity (most purchased first)
  const sortedDishes = dishesArray.sort((a, b) => b.quantity - a.quantity);

  // Get the top 5 dishes
  const topDishes = sortedDishes.slice(0, 5);

  // Render the top 5 dishes in the admin panel
  renderTopDishes(topDishes);
}

// Function to render the top 5 dishes in the admin panel
// (No changes needed in this function if the 'img' property is correctly passed)
function renderTopDishes(dishes) {
  const favContentContainer = document.querySelector('.fav-content'); // Using class selector

  // Clear previous content
  favContentContainer.innerHTML = '';

  // Iterate over the top dishes and display them
  dishes.forEach(dish => {
    console.log("Displaying dish: ", dish); // Check if 'img' property exists here
    const dishDiv = document.createElement('div');
    dishDiv.className = 'dish-item';
    // Now dish.img should have the correct URL
    dishDiv.innerHTML = `
      <img src="${dish.img}" alt="${dish.name}"> <div class="dish-info">
          <h3>${dish.name}</h3>
          <p>Purchased: ${dish.quantity} times</p>
      </div>
    `;
    favContentContainer.appendChild(dishDiv);
  });
}


document.addEventListener('DOMContentLoaded', loadCartFromFirebase); // Make sure this function eventually calls processTopDishes












const dynamicContent = document.querySelector('.dynamic-content');

// Main Content Sections (adjust selectors to match your structure)
const sections = [
    { id: 'favourite-dishes', text: 'Favourite Dishes' },
    { id: 'revenuePie', text: 'Total Revenue' },
    { id: 'ordersPie', text: 'Live Orders' },
    { id: 'usersPie', text: 'Registered Users' },
    { id: 'booked-tables', text: 'Table Bookings' },
    { id: 'loyal-customers-content', text: 'Loyal Customers' },
    { id: 'ongoing-orders-card', text: 'Ongoing Orders' },
    { id: 'testimonials-content', text: 'Testimonials' },
    // Add more sections as needed, using the ID of their container or a unique identifier
];

// Function to generate the sidebar links
function populateSidebar() {
    sections.forEach(section => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${section.id}`; // For potential scrolling (optional)
        link.textContent = section.text;
        listItem.appendChild(link);
        dynamicContent.appendChild(listItem);

        // Add click event listener for glow effect
        link.addEventListener('click', function(event) {
            // Prevent default anchor behavior if you don't want immediate jumping
            // event.preventDefault();

            // Remove glow from all sidebar links
            document.querySelectorAll('.dynamic-content a').forEach(el => el.classList.remove('glowing'));

            // Add glow to the clicked link
            this.classList.add('glowing');

            // Optional: Scroll to the section
            const targetElement = document.getElementById(section.id);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Call the function to populate the sidebar
populateSidebar();


// Function to fetch and display recent table bookings
function displayBookings() {
  const tableContent = document.querySelector(".table-content");
  const bookingsRef = ref(database, "bookings/");

  // Fetch the data from Firebase Realtime Database
  get(bookingsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const bookings = snapshot.val();
        tableContent.innerHTML = ''; // Clear previous bookings

        // Loop through the bookings and display them
        Object.keys(bookings).forEach((key) => {
          const booking = bookings[key];
          const bookingElement = document.createElement("div");
          bookingElement.classList.add("booking-item");

          // Create the booking details HTML
          bookingElement.innerHTML = `
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Mobile:</strong> ${booking.mobile}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Time:</strong> ${booking.time}</p>
            <p><strong>Guests:</strong> ${booking.guests}</p>
          `;

          // Append the booking item to the table content
          tableContent.appendChild(bookingElement);
        });
      } else {
        tableContent.innerHTML = '<p>No recent bookings.</p>';
      }
    })
    .catch((error) => {
      console.error("Error fetching bookings:", error);
      tableContent.innerHTML = '<p>Failed to load bookings.</p>';
    });
}

// Call the function when the page loads or whenever you want to refresh the list
document.addEventListener("DOMContentLoaded", displayBookings);






// ... other code ...

async function fetchUserEmail(userId) {
    const userRef = ref(database, `users/${userId}/email`);
    try {
        const snapshot = await get(userRef);
        return snapshot.exists() ? snapshot.val() : 'N/A';
    } catch (error) {
        console.error("Error fetching user email:", error);
        return 'N/A';
    }
}

function updateOngoingOrders() {
    const ordersCardContent = document.getElementById("ongoing-orders-card").querySelector(".card-content");
    const cartsRef = ref(database, "carts/");

    onValue(cartsRef, async (snapshot) => {
        if (snapshot.exists()) {
            const cartsData = snapshot.val();
            let htmlContent = "";

            for (let userId in cartsData) {
                const userCart = cartsData[userId];
                const userEmail = await fetchUserEmail(userId); // Fetch user email

                if (Array.isArray(userCart)) {
                    userCart.forEach(item => {
                        if (item && item.img && item.name && item.quantity && item.price) {
                            htmlContent += `
                                <div class="order-item">
                                    <img src="${item.img}" alt="${item.name}" class="order-item-img">
                                    <div class="order-item-details">
                                        <h4>${item.name}</h4>
                                        <p>Item ${item.quantity}</p>
                                        <p>Price ₹${item.price}</p>
                                    </div>
                                </div>
                            `;
                        }
                    });
                } else if (typeof userCart === 'object' && userCart !== null) {
                    for (let itemId in userCart) {
                        const item = userCart[itemId];
                        if (item && item.img && item.name && item.quantity && item.price) {
                            htmlContent += `
                                <div class="order-item">
                                    <img src="${item.img}" alt="${item.name}" class="order-item-img">
                                    <div class="order-item-details">
                                        <h4>${item.name}</h4>
                                        <p>User: ${userId.substring(0, 6)}...</p>
                                        <p>Email: ${userEmail}</p>
                                        <p>Quantity: ${item.quantity}</p>
                                        <p>Price: ₹${item.price}</p>
                                    </div>
                                </div>
                            `;
                        }
                    }
                }
            }

            ordersCardContent.innerHTML = htmlContent;
        } else {
            ordersCardContent.innerHTML = "<p>No ongoing orders yet.</p>";
        }
    }, (error) => {
        console.error("❌ Error fetching carts:", error);
    });
}

updateOngoingOrders();

// ... rest of your code ...







const BASE_REGISTERED_USERS = 10;
const PROFIT_MARGIN = 0.05;

// Function to safely update the inner HTML of an element
function safeInnerHTMLUpdate(elementId, value) {
    const element = document.getElementById(elementId);
    if (element && element.querySelector('.middle_cap')) {
    } else {
        console.error(`Could not find element with ID '${elementId}' or its '.middle_cap' child.`);
    }
}

// Function to safely update the background style of an element
function safeBackgroundUpdate(elementId, backgroundStyle) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.background = backgroundStyle;
    } else {
        console.error(`Could not find element with ID '${elementId}' to update background.`);
    }
}



function updateDashboard() {
    let totalSale = 0;
    let liveOrdersCount = 0;

    // 1. Reliable listener for carts data
    const cartsRef = ref(database, "carts/");
    onValue(cartsRef, (snapshot) => {
        totalSale = 0;
        liveOrdersCount = 0;

        snapshot.forEach((userSnapshot) => {
            const userCart = userSnapshot.val();
            if (userCart) {
                for (const dishId in userCart) {
                    const item = userCart[dishId];
                    if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
                        totalSale += item.price * item.quantity;
                        liveOrdersCount++; // Consider if you need to count unique users instead
                    } else if (item) {
                        console.warn(`Invalid price or quantity found in cart:`, item);
                    }
                }
            }
        });

        const profit = totalSale * PROFIT_MARGIN;
        safeInnerHTMLUpdate("revenuePie", `₹${profit.toFixed(2)}`);
        safeBackgroundUpdate("revenuePie", profit > 0 ? "conic-gradient(#4CAF50 0% 100%)" : "conic-gradient(#F44336 0% 100%)");
        safeInnerHTMLUpdate("ordersPie", liveOrdersCount);
        safeBackgroundUpdate("ordersPie", liveOrdersCount > 0 ? "conic-gradient(#4CAF50 0% 100%)" : "conic-gradient(#F44336 0% 100%)");
    }, (error) => {
        console.error("Error fetching cart data:", error);
    });

    // 2. Reliable listener for bookings data
    const bookingsRef = ref(db, "bookings/");
    onValue(bookingsRef, (snapshot) => {
        const bookedTablesCount = snapshot.size || (snapshot.exists() ? Object.keys(snapshot.val()).length : 0);
        const totalRegistered = BASE_REGISTERED_USERS + bookedTablesCount;
        safeInnerHTMLUpdate("usersPie", totalRegistered);
        safeBackgroundUpdate("usersPie", totalRegistered > BASE_REGISTERED_USERS ? "conic-gradient(#4CAF50 0% 100%)" : "conic-gradient(#F44336 0% 100%)");
    }, (error) => {
        console.error("Error fetching bookings data:", error);
    });
}

// Call the update function to start listening for changes
updateDashboard();