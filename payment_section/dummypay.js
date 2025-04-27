// This function will handle the selection of payment methods
function selectMethod(method) {
    // Toggle active class on buttons
    document.querySelectorAll('.payment-method').forEach(btn => btn.classList.remove('active'));
    if (method === 'credit') {
        document.querySelectorAll('.payment-method')[0].classList.add('active');
    } else if (method === 'paypal') {
        document.querySelectorAll('.payment-method')[1].classList.add('active');
    } else if (method === 'amazon') {
        document.querySelectorAll('.payment-method')[2].classList.add('active');
    }

    // Show selected form, hide others
    ['credit', 'paypal', 'amazon'].forEach(id => {
        const section = document.getElementById(id);
        if (id === method) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

// This function will simulate the payment submission
function submitPayment() {
    // Get the active payment method
    const selectedMethod = document.querySelector('.payment-method.active').innerText.trim().toLowerCase().replace(" ", "");

    // Get the form for the selected method
    const form = document.getElementById(selectedMethod);
    const inputs = form.querySelectorAll('input');

    // Validate inputs (this can be extended with more checks)
    let isValid = true;
    inputs.forEach(input => {
        if (input.value.trim() === "") {
            input.style.borderColor = "red";  // Mark invalid inputs
            isValid = false;
        } else {
            input.style.borderColor = "#ccc";  // Reset valid inputs
        }
    });

    if (!isValid) {
        alert("Please fill out all the fields.");
        return;
    }

    // Simulate successful payment submission
    alert(`Payment processed successfully with ${selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1)}!`);
}

// This function will handle going back to the store
function goBackToStore() {
    window.location.href = "../cart_folder/cart.html";  // Navigate back to the store page
}
