let cart=JSON.parse(localStorage.getItem("rajmudraCart")||"[]");
const whatsappNumber="919999999999";
const collectionNames={nath:["Nath Collection","Explore more Maharashtrian Nath designs"],earcuff:["Ear Cuff Collection","Explore more ear cuff designs"],ring:["Ring Collection","Explore more traditional-inspired rings"],bugadi:["Bugadi Collection","Explore more traditional Bugadi designs"],thushi:["Thushi Collection","Explore more Thushi designs"],set:["Jewellery Set Collection","Explore more matching jewellery sets"],necklace:["Necklace Collection","Explore more necklace designs"],anklet:["Anklet Collection","Explore more anklet designs"],choker:["Choker Collection","Explore more choker designs"]};
const cats=[["nath","Nath","images/nath.jpg"],["earcuff","Ear Cuff","images/earcuff.jpg"],["ring","Ring","images/rings3.jpg"],["bugadi","Bugadi","images/bugadi2.jpg"],["thushi","Thushi","images/thushi.jpg"],["set","Jewellery Set","images/set.jpg"],["necklace","Necklace","images/necklace.jpg"],["anklet","Anklet","images/anklet.jpg"],["choker","Choker","images/choker1.jpg"]];

function saveCart(){localStorage.setItem("rajmudraCart",JSON.stringify(cart))}
function calculateTotal(){const t=cart.reduce((s,i)=>s+i.price*i.quantity,0);const e=document.getElementById("cartTotal");if(e)e.textContent="₹"+t}
function updateCart(){const c=document.getElementById("cartCount");if(c)c.textContent=cart.reduce((s,i)=>s+i.quantity,0);const box=document.getElementById("cartItems");if(!box)return;if(!cart.length){box.innerHTML="<p>Your cart is empty. 💗</p>";calculateTotal();return}box.innerHTML="";cart.forEach((i,n)=>{const d=document.createElement("div");d.className="cart-item";d.innerHTML=`<img src="${i.image}" alt="${i.name}"><div><strong>${i.name}</strong><p>₹${i.price}</p></div><div class="quantity-controls"><button onclick="changeQuantity(${n},-1)">−</button><span>${i.quantity}</span><button onclick="changeQuantity(${n},1)">+</button></div><button class="remove-btn" onclick="removeFromCart(${n})">Remove</button>`;box.appendChild(d)});calculateTotal()}
function addToCart(name,price,image){const x=cart.find(i=>i.name===name);if(x)x.quantity++;else cart.push({name,price:Number(price),image,quantity:1});saveCart();updateCart();alert(name+" added to your cart! 🛍️")}
function changeQuantity(i,a){if(!cart[i])return;cart[i].quantity+=a;if(cart[i].quantity<=0)cart.splice(i,1);saveCart();updateCart()}
function removeFromCart(i){cart.splice(i,1);saveCart();updateCart()}
function openCart(){document.getElementById("cartModal").style.display="flex";updateCart()}
function closeCart(){document.getElementById("cartModal").style.display="none"}
function showDetails(n,d,p,img){document.getElementById("detailsName").textContent=n;document.getElementById("detailsDescription").textContent=d;document.getElementById("detailsPrice").textContent="₹"+p;document.getElementById("detailsImage").src=img;document.getElementById("detailsModal").style.display="flex"}
function closeDetails(){document.getElementById("detailsModal").style.display="none"}
function toggleWishlist(e){e.textContent=e.textContent.trim()==="♡"?"♥":"♡"}
function checkout(){if(!cart.length){alert("Your cart is empty.");return}closeCart();document.getElementById("checkoutModal").style.display="flex"}
function closeCheckout(){document.getElementById("checkoutModal").style.display="none"}

async function placeOrder(){const name=document.getElementById("checkoutName").value.trim(),phone=document.getElementById("checkoutPhone").value.trim(),address=document.getElementById("checkoutAddress").value.trim(),payment=document.getElementById("paymentMethod").value;if(!name||!phone||!address){alert("Please fill all required details.");return}const fd=new FormData();fd.append("name",name);fd.append("phone",phone);fd.append("address",address);fd.append("payment",payment);fd.append("cart",JSON.stringify(cart));try{const r=await fetch("save_order.php",{method:"POST",body:fd}),d=await r.json();if(!d.success){alert(d.message);return}let msg=`Hello Rajmudra!

I want to place an order.

`;cart.forEach(i=>msg+=`${i.name} x ${i.quantity} = ₹${i.price*i.quantity}
`);msg+=`
Total: ₹${d.total}
Name: ${name}
Phone: ${phone}
Address: ${address}
Payment: ${payment}
Order ID: ${d.order_id}`;window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,"_blank");alert("Order saved successfully! Order ID: "+d.order_id);cart=[];saveCart();updateCart();closeCheckout()}catch(e){console.error(e);alert("Server connection failed. Please check XAMPP.")}}

async function addReview(){const name=document.getElementById("reviewName").value.trim(),rating=document.getElementById("reviewRating").value,review=document.getElementById("reviewText").value.trim();if(!name||!review){alert("Please enter your name and review.");return}const fd=new FormData();fd.append("name",name);fd.append("rating",rating);fd.append("review",review);try{const r=await fetch("save_review.php",{method:"POST",body:fd}),d=await r.json();if(!d.success){alert(d.message);return}const card=document.createElement("div");card.className="review-card";const s=document.createElement("div");s.className="review-stars";s.textContent="⭐".repeat(Number(rating));const p=document.createElement("p");p.textContent=`"${review}"`;const h=document.createElement("h4");h.textContent=`— ${name}`;card.append(s,p,h);document.querySelector(".reviews-grid").prepend(card);document.getElementById("reviewName").value="";document.getElementById("reviewText").value="";alert("Thank you! Your review has been saved. ⭐")}catch(e){console.error(e);alert("Could not connect to database.")}}

async function exploreCollection(category){const m=document.getElementById("collectionModal"),t=document.getElementById("collectionTitle"),s=document.getElementById("collectionSubtitle"),box=document.getElementById("collectionProducts");const info=collectionNames[category];if(!info)return;t.textContent=info[0];s.textContent=info[1];box.innerHTML="<p>Loading designs... ✨</p>";m.classList.add("active");m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";try{const r=await fetch("get_products.php?category="+encodeURIComponent(category)),d=await r.json();if(!d.success||!d.products.length){box.innerHTML="<p>No designs found.</p>";return}box.innerHTML="";const fallback=d.products[0].image;d.products.forEach(p=>{const c=document.createElement("article");c.className="sub-product";c.innerHTML=`<div class="sub-product-image"><img src="${p.image}" alt="${p.name}" onerror="this.src='${fallback}'">
<button class="sub-wishlist" onclick="toggleWishlist(this)">♡</button></div><div class="sub-product-info"><h3>${p.name}</h3><div class="rating">⭐⭐⭐⭐⭐</div><div class="price">₹${Number(p.price).toFixed(0)}</div><div class="sub-product-buttons"><button class="add-bag-btn" onclick='addToCart(${JSON.stringify(p.name)},${Number(p.price)},${JSON.stringify(p.image)})'>🛒 Add to Cart</button><button class="buy-now-btn" onclick='buyNow(${JSON.stringify(p.name)},${Number(p.price)},${JSON.stringify(p.image)})'>Buy Now</button></div></div>`;box.appendChild(c)})}catch(e){console.error(e);box.innerHTML="<p>Unable to load designs. Please check XAMPP.</p>"}}
function closeCollection(){const m=document.getElementById("collectionModal");m.classList.remove("active");m.setAttribute("aria-hidden","true");document.body.style.overflow=""}
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

async function loadMainProducts(){const grid=document.getElementById("mainProducts");if(!grid)return;grid.innerHTML="";for(const [cat,label,fallback] of cats){let p=null;try{const r=await fetch("get_products.php?category="+cat),d=await r.json();if(d.success&&d.products.length)p=d.products[0]}catch(e){}const name=p?.name||label,price=Number(p?.price||0),img=p?.image||fallback,desc=p?.description||"Beautiful Rajmudra jewellery design.";const card=document.createElement("article");card.className="product-card";card.innerHTML=`<img src="${p.image}" alt="${p.name}" onerror="this.src='${fallback}'">
<button'"><div class="product-info"><h3>${label}</h3><p>${desc}</p><div class="price">Starting ₹${price}</div><div class="product-actions"><button class="outline" onclick='showDetails(${JSON.stringify(name)},${JSON.stringify(desc)},${price},${JSON.stringify(img)})'>View Details</button><button class="primary-btn" onclick='addToCart(${JSON.stringify(name)},${price},${JSON.stringify(img)})'>Add to Cart</button></div><button class="explore-designs-btn" onclick="exploreCollection('${cat}')">✨ Explore More Designs</button></div>`;grid.appendChild(card);const o=document.createElement("option");o.value=label;o.textContent=label;document.getElementById("product")?.appendChild(o)}}

document.getElementById("contactForm")?.addEventListener("submit",async function(e){e.preventDefault();const fd=new FormData();["name","email","phone","product","message"].forEach(id=>fd.append(id,document.getElementById(id).value.trim()));try{const r=await fetch("save_contact.php",{method:"POST",body:fd}),d=await r.json();alert(d.message);if(d.success)this.reset()}catch(e){alert("Could not connect to database.")}});
document.addEventListener("click",e=>{if(e.target===document.getElementById("collectionModal"))closeCollection()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCollection();closeDetails();closeCart();closeCheckout()}});
document.addEventListener("DOMContentLoaded",()=>{updateCart();loadMainProducts()});
Object.assign(window,{addToCart,changeQuantity,removeFromCart,openCart,closeCart,showDetails,closeDetails,toggleWishlist,checkout,closeCheckout,placeOrder,addReview,exploreCollection,closeCollection,buyNow});
