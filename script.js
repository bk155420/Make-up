document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById("cart-items");

    // Load existing cart items from local storage
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    function addToCart(name, price, image) {
        const existingItem = cartItems.find(item => item.name === name);

        if (existingItem) {
            existingItem.price += price;
        } else {
            cartItems.push({ name, price, image });
        }

        saveCartToLocalStorage();
        // updateCart();

        // Display SweetAlert popup for adding item
        Swal.fire({
            icon: 'success',
            title: 'Produkt hinzugefügt!',
            text: `${name} wurde dem Warenkorb hinzugefügt.`,
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(function() {
            location.reload();
        }, 3000);
    }

    function removeFromCart(name) {
        cartItems = cartItems.filter(item => item.name !== name);
        saveCartToLocalStorage();
        updateCart();

        // Display SweetAlert popup for removing item
        Swal.fire({
            icon: 'info',
            title: 'Produkt entfernt!',
            text: `${name} wurde aus dem Warenkorb entfernt.`,
            showConfirmButton: false,
            timer: 1500
        });
    }

    // Event listener for adding to cart
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute("data-name");
            const productPrice = parseFloat(button.getAttribute("data-price"));
            const productImage = button.getAttribute("data-image");
            addToCart(productName, productPrice, productImage);
        });
    });

    function saveCartToLocalStorage() {
        if (cartItems.length === 0) {
            localStorage.removeItem("cartItems");
        } else {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }

    function updateCart() {
        // Clear the previous content
        cartItemsContainer.innerHTML = "";

        let totalPrice = 0;

        // Iterate through the cart items and display them in the cart
        cartItems.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name}</p>
                <p class="price">$${item.price.toFixed(2)}</p>
                <button class="remove-from-cart" data-name="${item.name}">Entfernen</button>
            `;
            cartItemsContainer.appendChild(cartItem);

            totalPrice += item.price;
        });

        // Update the total price
        const totalPriceElement = document.getElementById("total-price");
        totalPriceElement.textContent = `Gesamtpreis: $${totalPrice.toFixed(2)}`;
    }

    // Event listener for removing from cart
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-from-cart')) {
            const productName = event.target.getAttribute("data-name");
            removeFromCart(productName);
        }
    });

    // Initial update
    updateCart();
});