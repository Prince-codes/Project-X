// Simple product list and cart implementation
const PRODUCTS = [
  {id:1,name:'Classic T-Shirt',price:19.99,image:'https://via.placeholder.com/400x300?text=T-Shirt'},
  {id:2,name:'Sneakers',price:69.99,image:'https://via.placeholder.com/400x300?text=Sneakers'},
  {id:3,name:'Leather Wallet',price:29.5,image:'https://via.placeholder.com/400x300?text=Wallet'},
  {id:4,name:'Baseball Cap',price:14.0,image:'https://via.placeholder.com/400x300?text=Cap'},
  {id:5,name:'Denim Jacket',price:89.0,image:'https://via.placeholder.com/400x300?text=Jacket'},
  {id:6,name:'Sunglasses',price:39.99,image:'https://via.placeholder.com/400x300?text=Sunglasses'}
];

const state = {
  cart: {}, // id -> qty
};

function saveCart(){
  localStorage.setItem('simple-shop-cart',JSON.stringify(state.cart));
}
function loadCart(){
  try{ state.cart = JSON.parse(localStorage.getItem('simple-shop-cart')) || {}; }catch(e){ state.cart = {}; }
}

function formatPrice(v){ return v.toFixed(2); }

function renderProducts(products){
  const grid = document.getElementById('product-grid');
  grid.innerHTML = '';
  for(const p of products){
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="meta"><span class="price">$${formatPrice(p.price)}</span></div>
      <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
        <button class="btn add" data-id="${p.id}">Add</button>
        <button class="btn" onclick="alert('Quick view not implemented')">View</button>
      </div>
    `;
    grid.appendChild(el);
  }
}

function updateCartUI(){
  const itemsEl = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  itemsEl.innerHTML = '';
  let total = 0, qtySum = 0;
  const ids = Object.keys(state.cart);
  if(ids.length===0){
    itemsEl.innerHTML = '<p class="empty">Your cart is empty.</p>';
  } else {
    for(const id of ids){
      const qty = state.cart[id];
      const prod = PRODUCTS.find(p => p.id==id);
      if(!prod) continue;
      const item = document.createElement('div');
      item.className = 'cart-item';
      item.innerHTML = `
        <div class="title">${prod.name}</div>
        <div>$${formatPrice(prod.price)}</div>
        <div><input class="qty" data-id="${id}" type="number" min="0" value="${qty}" style="width:60px"></div>
        <div style="margin-left:8px"><button class="btn remove" data-id="${id}">Remove</button></div>
      `;
      itemsEl.appendChild(item);
      total += prod.price * qty;
      qtySum += qty;
    }
  }
  countEl.textContent = qtySum;
  totalEl.textContent = formatPrice(total);
}

function addToCart(id, amount=1){
  id = String(id);
  state.cart[id] = (state.cart[id]||0) + amount;
  if(state.cart[id] <= 0) delete state.cart[id];
  saveCart();
  updateCartUI();
}

function setQty(id, qty){
  id = String(id);
  qty = Number(qty) || 0;
  if(qty<=0){ delete state.cart[id]; } else { state.cart[id]=qty; }
  saveCart();
  updateCartUI();
}

function removeFromCart(id){
  id = String(id);
  delete state.cart[id];
  saveCart();
  updateCartUI();
}

function clearCart(){ state.cart = {}; saveCart(); updateCartUI(); }

// Event wiring
document.addEventListener('DOMContentLoaded',()=>{
  loadCart();
  renderProducts(PRODUCTS);
  updateCartUI();

  document.getElementById('product-grid').addEventListener('click', e => {
    const add = e.target.closest('button.add');
    if(add){ addToCart(add.dataset.id,1); }
  });

  document.getElementById('cart-items').addEventListener('click', e => {
    const rem = e.target.closest('button.remove');
    if(rem){ removeFromCart(rem.dataset.id); }
  });

  document.getElementById('cart-items').addEventListener('input', e => {
    const q = e.target.closest('input.qty');
    if(q){ setQty(q.dataset.id, q.value); }
  });

  document.getElementById('clear-cart').addEventListener('click', ()=>{
    if(confirm('Clear the cart?')) clearCart();
  });

  document.getElementById('checkout').addEventListener('click', ()=>{
    alert('Checkout not implemented in this demo.');
  });

  // cart toggle for small screens
  const cartToggle = document.getElementById('cart-toggle');
  const cartPane = document.getElementById('cart');
  cartToggle.addEventListener('click', ()=>{
    const expanded = cartToggle.getAttribute('aria-expanded') === 'true';
    cartToggle.setAttribute('aria-expanded', String(!expanded));
    cartPane.style.display = expanded ? '' : 'block';
  });

  // basic search
  const search = document.getElementById('search');
  search.addEventListener('input', ()=>{
    const q = search.value.trim().toLowerCase();
    const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
    renderProducts(filtered);
  });
});
