

let cart = JSON.parse(localStorage.getItem("rajmudraCart") || "[]");


function saveCart() {
    localStorage.setItem("rajmudraCart", JSON.stringify(cart));
}


function addToCart(name, price, image) {

    price = Number(price);

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });

    }

    saveCart();
    updateCart();

    alert(name + " added to cart! 🛒");
}


/* =========================================================
   UPDATE CART
   ========================================================= */

function updateCart() {

    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    const totalQuantity = cart.reduce(
        (total, item) => total + Number(item.quantity),
        0
    );

    if (cartCount) {
        cartCount.textContent = totalQuantity;
    }


    if (!cartItems) {
        return;
    }


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>🛒 Your cart is empty</h3>
                <p>Add some beautiful Rajmudra jewellery.</p>
            </div>
        `;

        if (cartTotal) {
            cartTotal.textContent = "₹0";
        }

        return;
    }


    cartItems.innerHTML = cart.map((item, index) => {

        const price = Number(item.price);
        const quantity = Number(item.quantity);
        const itemTotal = price * quantity;

        return `
            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="this.style.display='none'"
                >

                <div class="cart-item-info">

                    <h3>${item.name}</h3>

                    <p>
                        ₹${price.toFixed(2)}
                    </p>

                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity(${index}, -1)">
                            −
                        </button>

                        <span>
                            ${quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${index}, 1)">
                            +
                        </button>

                    </div>

                    <strong>
                        ₹${itemTotal.toFixed(2)}
                    </strong>

                </div>


                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})">
                    ✕
                </button>

            </div>
        `;

    }).join("");


    const total = calculateTotal();

    if (cartTotal) {
        cartTotal.textContent = "₹" + total.toFixed(2);
    }
}


/* =========================================================
   CHANGE QUANTITY
   ========================================================= */

function changeQuantity(index, change) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += change;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    saveCart();
    updateCart();
}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    const productName = cart[index].name;

    cart.splice(index, 1);

    saveCart();
    updateCart();

    alert(productName + " removed from cart.");
}


/* =========================================================
   CALCULATE TOTAL
   ========================================================= */

function calculateTotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                Number(item.price) *
                Number(item.quantity);

        },
        0
    );
}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

    const modal = document.getElementById("cartModal");

    if (!modal) {
        return;
    }

    updateCart();

    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

    const modal = document.getElementById("cartModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    document.body.style.overflow = "";
}


/* =========================================================
   PRODUCT DETAILS
   ========================================================= */

function showDetails(
    name,
    description,
    price,
    image
) {

    const modal = document.getElementById("detailsModal");

    const detailsImage =
        document.getElementById("detailsImage");

    const detailsName =
        document.getElementById("detailsName");

    const detailsDescription =
        document.getElementById("detailsDescription");

    const detailsPrice =
        document.getElementById("detailsPrice");


    if (!modal) {
        return;
    }


    detailsName.textContent = name;

    detailsDescription.textContent = description;

    detailsPrice.textContent = price;

    detailsImage.src = image;

    detailsImage.alt = name;


    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE PRODUCT DETAILS
   ========================================================= */

function closeDetails() {

    const modal =
        document.getElementById("detailsModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    document.body.style.overflow = "";
}


/* =========================================================
   WISHLIST
   ========================================================= */

function toggleWishlist(element) {

    if (!element) {
        return;
    }


    if (element.classList.contains("liked")) {

        element.classList.remove("liked");

        element.textContent = "♡";

    } else {

        element.classList.add("liked");

        element.textContent = "♥";

    }
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty. Please add a product first.");

        return;
    }


    const modal =
        document.getElementById("checkoutModal");

    if (!modal) {
        return;
    }


    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE CHECKOUT
   ========================================================= */

function closeCheckout() {

    const modal =
        document.getElementById("checkoutModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    document.body.style.overflow = "";
}


/* =========================================================
   PLACE ORDER
   ========================================================= */

async function placeOrder() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    const name =
        document.getElementById("checkoutName")?.value.trim();

    const phone =
        document.getElementById("checkoutPhone")?.value.trim();

    const address =
        document.getElementById("checkoutAddress")?.value.trim();

    const payment =
        document.getElementById("paymentMethod")?.value;


    if (!name || !phone || !address) {

        alert("Please fill all required details.");

        return;
    }


    if (phone.length < 10) {

        alert("Please enter a valid phone number.");

        return;
    }


    const orderData = new FormData();

    orderData.append("name", name);

    orderData.append("phone", phone);

    orderData.append("address", address);

    orderData.append(
        "payment",
        payment || "Cash on Delivery"
    );

    orderData.append(
        "cart",
        JSON.stringify(cart)
    );


    try {

        const response = await fetch(
            "save_order.php",
            {
                method: "POST",
                body: orderData
            }
        );


        const result = await response.json();


        if (result.success) {

            alert(
                "🎉 Order placed successfully!\n\n" +
                "Order ID: #" +
                result.order_id +
                "\n" +
                "Total: ₹" +
                Number(result.total).toFixed(2)
            );


            cart = [];

            saveCart();

            updateCart();

            closeCheckout();

            document.getElementById(
                "checkoutName"
            ).value = "";

            document.getElementById(
                "checkoutPhone"
            ).value = "";

            document.getElementById(
                "checkoutAddress"
            ).value = "";


        } else {

            alert(
                result.message ||
                "Unable to place order."
            );
        }


    } catch (error) {

        console.error(
            "Order error:",
            error
        );

        alert(
            "Unable to connect to the server.\n\n" +
            "Make sure XAMPP Apache and MySQL are running."
        );
    }
}


/* =========================================================
   REVIEWS
   ========================================================= */

async function addReview() {

    const name =
        document.getElementById("reviewName")?.value.trim();

    const rating =
        document.getElementById("reviewRating")?.value;

    const review =
        document.getElementById("reviewText")?.value.trim();


    if (!name || !rating || !review) {

        alert("Please fill all review details.");

        return;
    }


    const reviewData = new FormData();

    reviewData.append("name", name);

    reviewData.append("rating", rating);

    reviewData.append("review", review);


    try {

        const response = await fetch(
            "save_review.php",
            {
                method: "POST",
                body: reviewData
            }
        );


        const result = await response.json();


        if (result.success) {

            alert(
                "⭐ Thank you for sharing your experience!"
            );


            document.getElementById(
                "reviewName"
            ).value = "";

            document.getElementById(
                "reviewRating"
            ).value = "5";

            document.getElementById(
                "reviewText"
            ).value = "";


        } else {

            alert(
                result.message ||
                "Unable to submit review."
            );
        }


    } catch (error) {

        console.error(
            "Review error:",
            error
        );

        alert(
            "Unable to connect to the server."
        );
    }
}


/* =========================================================
   COLLECTION / MORE DESIGNS
   ========================================================= */

const collectionNames = {

    nath: "Nath Earrings",

    earcuff: "Ear Cuffs",

    ring: "Traditional Rings",

    bugadi: "Bugadi",

    thushi: "Thushi Inspired",

    set: "Jewellery Sets",

    necklace: "Necklaces",

    anklet: "Anklets",

    choker: "Chokers"

};


const categoryImages = {

    nath: "images/nath.jpg",

    earcuff: "images/earcuff.jpg",

    ring: "images/rings3.jpg",

    bugadi: "images/bugadi2.jpg",

    thushi: "images/thushi.jpg",

    set: "images/set.jpg",

    necklace: "images/necklace.jpg",

    anklet: "images/anklet.jpg",

    choker: "images/choker1.jpg"

};


/* =========================================================
   EXPLORE COLLECTION
   ========================================================= */

async function exploreCollection(category) {

    const modal =
        document.getElementById("collectionModal");

    const title =
        document.getElementById("collectionTitle");

    const subtitle =
        document.getElementById("collectionSubtitle");

    const products =
        document.getElementById("collectionProducts");


    if (!modal || !products) {
        return;
    }


    title.textContent =
        collectionNames[category] ||
        "Explore More Designs";


    subtitle.textContent =
        "Choose your favourite design.";


    products.innerHTML = `
        <div class="loading">
            <p>Loading beautiful designs... ✨</p>
        </div>
    `;


    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";


    try {

        const response = await fetch(
            "get_products.php?category=" +
            encodeURIComponent(category)
        );


        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );
        }


        const data = await response.json();


        if (!data.success || !Array.isArray(data.products)) {

            throw new Error(
                data.message ||
                "Products could not be loaded."
            );
        }


        if (data.products.length === 0) {

            products.innerHTML = `
                <div class="empty-collection">
                    <h3>No designs found</h3>
                    <p>Please check again later.</p>
                </div>
            `;

            return;
        }


        products.innerHTML =
            data.products.map(product => {

                const name =
                    product.name || "Rajmudra Jewellery";

                const description =
                    product.description ||
                    "Beautiful Maharashtrian jewellery.";

                const price =
                    Number(product.price || 0);

                const image =
                    product.image ||
                    categoryImages[category] ||
                    "images/nath.jpg";


                return `

                    <article class="collection-product-card">

                        <img
                            src="${image}"
                            alt="${name}"
                            onerror="
                                this.onerror=null;
                                this.src='${categoryImages[category] || "images/nath.jpg"}';
                            "
                        >

                        <div class="collection-product-info">

                            <h3>
                                ${name}
                            </h3>

                            <p>
                                ${description}
                            </p>

                            <div class="collection-product-price">
                                ₹${price.toFixed(2)}
                            </div>


                            <div class="collection-product-actions">

                                <button
                                    class="details-btn"
                                    onclick="
                                        showDetails(
                                            '${escapeJS(name)}',
                                            '${escapeJS(description)}',
                                            '₹${price.toFixed(2)}',
                                            '${escapeJS(image)}'
                                        )
                                    "
                                >
                                    View Details
                                </button>


                                <button
                                    class="add-btn"
                                    onclick="
                                        addToCart(
                                            '${escapeJS(name)}',
                                            ${price},
                                            '${escapeJS(image)}'
                                        )
                                    "
                                >
                                    🛒 Add to Cart
                                </button>

                            </div>

                        </div>

                    </article>

                `;

            }).join("");


    } catch (error) {

        console.error(
            "Collection error:",
            error
        );


        products.innerHTML = `

            <div class="collection-error">

                <h3>
                    ⚠️ Unable to load designs
                </h3>

                <p>
                    Please make sure Apache,
                    MySQL and the PHP files
                    are running correctly.
                </p>

                <button
                    class="btn"
                    onclick="exploreCollection('${category}')"
                >
                    Try Again
                </button>

            </div>

        `;
    }
}


/* =========================================================
   ESCAPE JAVASCRIPT VALUES
   ========================================================= */

function escapeJS(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;")
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n");
}


/* =========================================================
   CLOSE COLLECTION
   ========================================================= */

function closeCollection() {

    const modal =
        document.getElementById("collectionModal");

    if (!modal) {
        return;
    }


    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


/* =========================================================
   BUY NOW
   ========================================================= */

function buyNow(name, price, image) {

    console.log("BUY NOW CLICKED:", name, price, image);

    cart = [{
        name: name,
        price: Number(price),
        image: image || "",
        quantity: 1
    }];

    // Close collection modal
    const collectionModal = document.getElementById("collectionModal");

    if (collectionModal) {
        collectionModal.classList.remove("active");
        collectionModal.style.display = "none";
        collectionModal.setAttribute("aria-hidden", "true");
    }

    // Close details modal if open
    const detailsModal = document.getElementById("detailsModal");

    if (detailsModal) {
        detailsModal.classList.remove("active");
        detailsModal.style.display = "none";
    }

    // Open checkout
    const checkoutModal = document.getElementById("checkoutModal");

    if (!checkoutModal) {
        console.error("checkoutModal NOT FOUND!");
        return;
    }

    checkoutModal.classList.add("active");
    checkoutModal.style.setProperty("display", "flex", "important");
    checkoutModal.style.setProperty("z-index", "99999", "important");
    checkoutModal.style.visibility = "visible";
    checkoutModal.style.opacity = "1";

    document.body.style.overflow = "hidden";

    // Save cart
    try {
        saveCart();
    } catch (error) {
        console.error("saveCart error:", error);
    }

    console.log("CHECKOUT OPENED DIRECTLY");
}
/* =========================================================
   LOAD MAIN PRODUCTS FROM DATABASE
   ========================================================= */

async function loadMainProducts() {

    const grid =
        document.querySelector(".product-grid");


    if (!grid) {
        return;
    }


    try {

        const response =
            await fetch("get_products.php");


        if (!response.ok) {
            throw new Error(
                "Server error: " +
                response.status
            );
        }


        const data =
            await response.json();


        if (
            !data.success ||
            !Array.isArray(data.products)
        ) {

            throw new Error(
                data.message ||
                "Products could not be loaded."
            );
        }


        if (data.products.length === 0) {

            console.warn(
                "No products found in database."
            );

            return;
        }


        /*
         * Show the first product of every category
         * on the main Products section.
         */

        const categories = [

            "nath",
            "earcuff",
            "ring",
            "bugadi",
            "thushi",
            "set",
            "necklace",
            "anklet",
            "choker"

        ];


        const selectedProducts = [];


        categories.forEach(category => {

            const product =
                data.products.find(
                    item =>
                        item.category === category
                );


            if (product) {

                selectedProducts.push(product);

            }

        });


        if (selectedProducts.length === 0) {
            return;
        }


        grid.innerHTML =
            selectedProducts.map(product => {

                const category =
                    product.category;

                const name =
                    product.name ||
                    collectionNames[category] ||
                    "Rajmudra Jewellery";


                const description =
                    product.description ||
                    "Beautiful Maharashtrian jewellery.";


                const price =
                    Number(product.price || 0);


                const image =
                    product.image ||
                    categoryImages[category] ||
                    "images/nath.jpg";


                const rating =
                    Number(product.rating || 5);


                const reviewCount =
                    Number(
                        product.reviews_count || 0
                    );


                return `

                    <article class="product-card">

                        <div
                            class="wishlist"
                            onclick="toggleWishlist(this)"
                        >
                            ♡
                        </div>


                        <img
                            src="${image}"
                            alt="${name}"
                            onerror="
                                this.onerror=null;
                                this.src='${categoryImages[category] || "images/nath.jpg"}';
                            "
                        >


                        <div class="rating">

                            ${getStars(rating)}

                            <span>
                                (${reviewCount})
                            </span>

                        </div>


                        <h3>
                            ${name}
                        </h3>


                        <p>
                            ${description}
                        </p>


                        <div class="price">
                            ₹${price.toFixed(2)}
                        </div>


                        <div class="product-buttons">

                            <button
                                class="details-btn"
                                onclick="
                                    showDetails(
                                        '${escapeJS(name)}',
                                        '${escapeJS(description)}',
                                        '₹${price.toFixed(2)}',
                                        '${escapeJS(image)}'
                                    )
                                "
                            >
                                View Details
                            </button>


                            <button
                                class="add-btn"
                                onclick="
                                    addToCart(
                                        '${escapeJS(name)}',
                                        ${price},
                                        '${escapeJS(image)}'
                                    )
                                "
                            >
                                🛒 Add to Cart
                            </button>

                        </div>


                        <button
                            class="explore-designs-btn"
                            onclick="
                                exploreCollection('${category}')
                            "
                        >
                            ✨ Explore More Designs
                        </button>

                    </article>

                `;

            }).join("");


    } catch (error) {

        console.error(
            "Database product loading error:",
            error
        );

        /*
         * If database is not available,
         * the original HTML products remain
         * instead of showing a blank page.
         */

    }
}


/* =========================================================
   STAR RATING
   ========================================================= */

function getStars(rating) {

    rating = Math.round(
        Number(rating)
    );


    if (rating < 0) {
        rating = 0;
    }


    if (rating > 5) {
        rating = 5;
    }


    return (
        "⭐".repeat(rating) +
        "☆".repeat(5 - rating)
    );
}


/* =========================================================
   CONTACT FORM
   ========================================================= */

async function submitContactForm(event) {

    event.preventDefault();


    const name =
        document.getElementById("name")?.value.trim();

    const email =
        document.getElementById("email")?.value.trim();

    const phone =
        document.getElementById("phone")?.value.trim();

    const product =
        document.getElementById("product")?.value;

    const message =
        document.getElementById("message")?.value.trim();


    if (!name || !email || !phone) {

        alert(
            "Please fill all required contact details."
        );

        return;
    }


    const contactData =
        new FormData();


    contactData.append(
        "name",
        name
    );


    contactData.append(
        "email",
        email
    );


    contactData.append(
        "phone",
        phone
    );


    contactData.append(
        "product",
        product || ""
    );


    contactData.append(
        "message",
        message || ""
    );


    try {

        const response =
            await fetch(
                "save_contact.php",
                {
                    method: "POST",
                    body: contactData
                }
            );


        const result =
            await response.json();


        if (result.success) {

            alert(
                "✅ Thank you! Your enquiry has been submitted successfully."
            );


            document.getElementById(
                "contactForm"
            ).reset();


        } else {

            alert(
                result.message ||
                "Unable to submit enquiry."
            );
        }


    } catch (error) {

        console.error(
            "Contact error:",
            error
        );


        alert(
            "Unable to connect to the server.\n\n" +
            "Make sure XAMPP Apache and MySQL are running."
        );
    }
}


/* =========================================================
   MODAL OUTSIDE CLICK
   ========================================================= */

function setupModalEvents() {

    const cartModal =
        document.getElementById("cartModal");


    const detailsModal =
        document.getElementById("detailsModal");


    const checkoutModal =
        document.getElementById("checkoutModal");


    const collectionModal =
        document.getElementById("collectionModal");


    if (cartModal) {

        cartModal.addEventListener(
            "click",
            function(event) {

                if (event.target === cartModal) {

                    closeCart();

                }

            }
        );

    }


    if (detailsModal) {

        detailsModal.addEventListener(
            "click",
            function(event) {

                if (event.target === detailsModal) {

                    closeDetails();

                }

            }
        );

    }


    if (checkoutModal) {

        checkoutModal.addEventListener(
            "click",
            function(event) {

                if (event.target === checkoutModal) {

                    closeCheckout();

                }

            }
        );

    }


    if (collectionModal) {

        collectionModal.addEventListener(
            "click",
            function(event) {

                if (event.target === collectionModal) {

                    closeCollection();

                }

            }
        );

    }
}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

function setupEscapeKey() {

    document.addEventListener(
        "keydown",
        function(event) {

            if (event.key !== "Escape") {
                return;
            }


            closeCart();

            closeDetails();

            closeCheckout();

            closeCollection();

        }
    );
}


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCart();

        setupModalEvents();

        setupEscapeKey();


        const contactForm =
            document.getElementById(
                "contactForm"
            );


        if (contactForm) {

            contactForm.addEventListener(
                "submit",
                submitContactForm
            );

        }


        /*
         * Load products from MySQL.
         * If database is unavailable,
         * original HTML products remain.
         */

        loadMainProducts();

    }
);


/* =========================================================
   MAKE FUNCTIONS AVAILABLE TO HTML onclick=""
   ========================================================= */

Object.assign(
    window,
    {

        addToCart,

        updateCart,

        changeQuantity,

        removeFromCart,

        calculateTotal,

        openCart,

        closeCart,

        showDetails,

        closeDetails,

        toggleWishlist,

        checkout,

        closeCheckout,

        placeOrder,

        addReview,

        exploreCollection,

        closeCollection,

        buyNow,

        loadMainProducts

    }
);