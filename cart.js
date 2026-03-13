/* CART STORAGE */

let cart = JSON.parse(localStorage.getItem("cart")) || [];


/* ADD TO CART */

document.querySelectorAll(".add-cart").forEach(btn=>{

btn.addEventListener("click",()=>{

const card = btn.closest(".product-card");

const product = {

id: card.dataset.id,
name: card.dataset.name,
price: parseFloat(card.dataset.price),
img: card.dataset.img,
qty:1

};

addToCart(product);

});

});


function addToCart(product){

const exist = cart.find(p=>p.id === product.id);

if(exist){

exist.qty++;

}else{

cart.push(product);

}

saveCart();

updateCartBadge();

}


/* SAVE */

function saveCart(){

localStorage.setItem("cart",JSON.stringify(cart));

}


/* CART BADGE */

function updateCartBadge(){

const badge = document.querySelector(".cart-count");

if(!badge) return;

const total = cart.reduce((sum,item)=>sum+item.qty,0);

badge.innerText = total;

}


updateCartBadge();