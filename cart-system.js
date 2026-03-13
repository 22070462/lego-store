/* LOAD CART */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBadge = document.querySelector(".cart-count");


/* UPDATE BADGE */

function updateCartBadge(){

if(!cartBadge) return;

const total = cart.reduce((sum,item)=>sum+item.qty,0);

cartBadge.innerText = total;

}


/* SAVE CART */

function saveCart(){

localStorage.setItem("cart", JSON.stringify(cart));

}


/* ADD TO CART */

function addToCart(product){

const exist = cart.find(p => p.id === product.id);

if(exist){

exist.qty++;

}else{

cart.push(product);

}

saveCart();
updateCartBadge();

}


/* LOAD BADGE ON PAGE */

updateCartBadge();