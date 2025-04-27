// Import Firebase config and services from firebase-config.js
import { auth, database, ref, get } from '../firebase-config.js'; // Correct path to the config file

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
