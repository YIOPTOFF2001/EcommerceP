const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
// products moved to `js/products.js` (shared across pages)

const grid = document.getElementById('product-grid');

function renderProducts(prods) {
  if (!grid) return;
  grid.innerHTML = '';
  prods.forEach(p=>{
    const el = document.createElement('div'); 
    el.className='card';
    el.innerHTML = `<img src="${p.src}" alt="${p.title}"><div style=\"margin-top:8px\"><div style=\"font-weight:700\">${p.title}</div><div class=\"product-meta\"><div class=\"price\">$${p.price.toFixed(2)}</div><button class=\"btn\" data-id=\"${p.id}\">Quick View</button></div></div>`;
    grid.appendChild(el);
  });
}

if (grid && typeof products !== 'undefined' && Array.isArray(products)){
  renderProducts(products);
} else {
  console.warn('Product grid or products data missing — skipping product render.');
}

  

    // modal logic
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    if (grid) {
      grid.addEventListener('click', e=>{
        const btn = e.target.closest && e.target.closest('button[data-id]'); if(!btn) return;
        const id = +btn.dataset.id;
        if (typeof products === 'undefined' || !Array.isArray(products)) return;
        const p = products.find(x=>x.id===id);
        if(!p) return;
        if(modalImg) modalImg.src = p.src;
        if(modalTitle) modalTitle.textContent = p.title;
        if(modalDesc) modalDesc.textContent = p.desc;
        if(modalPrice) modalPrice.textContent = '$'+p.price.toFixed(2);
        // reset size & quantity defaults when opening
        const sizeSelect = document.getElementById('modal-size'); if(sizeSelect) sizeSelect.value = 'S';
        const qtyDisplay = document.getElementById('modal-quantity'); if(qtyDisplay) qtyDisplay.textContent = '1';
        // attach current product id to modal for wishlist handling
        if(modal) modal.dataset.productId = id;
        // update wishlist icon for this product
        if(typeof updateModalWishlistIcon === 'function') updateModalWishlistIcon(id);
        if(modal) modal.classList.add('show');
      });
    }
    const modalCloseEl = document.getElementById('modal-close');
    if(modalCloseEl && modal) modalCloseEl.addEventListener('click', ()=>modal.classList.remove('show'));
    if(modal) modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('show') });

    // mobile nav toggle (simple)
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    if(navToggle && nav) navToggle.addEventListener('click', ()=>{ if(nav.style.display==='flex'){nav.style.display='none'}else{nav.style.display='flex';nav.style.flexDirection='column';nav.style.position='absolute';nav.style.right='28px';nav.style.top='72px';nav.style.background='white';nav.style.padding='12px';nav.style.borderRadius='12px';nav.style.boxShadow='var(--shadow)'}});

  // Hero Typewriter Effect
const heroText = "Minimal silhouettes with rich texture. Clothes that age like wine.";
const heroElement = document.getElementById("hero-text");
let i = 0;

function typeHero() {
  if (!heroElement) return;
  if (i < heroText.length) {
    heroElement.innerHTML += heroText.charAt(i);
    i++;
    setTimeout(typeHero, 50); // adjust speed here
  }
}
if (heroElement) window.addEventListener("load", typeHero);
const blogCarousel = document.querySelector('.blog-carousel');
const blogNextBtn = document.getElementById('blog-next');
const blogPrevBtn = document.getElementById('blog-prev');
if (blogCarousel && blogNextBtn) blogNextBtn.addEventListener('click', ()=> { blogCarousel.scrollBy({ left: 280, behavior: 'smooth' }); });
if (blogCarousel && blogPrevBtn) blogPrevBtn.addEventListener('click', ()=> { blogCarousel.scrollBy({ left: -280, behavior: 'smooth' }); });

const subscribeForm = document.querySelector('.subscribe-form');
if (subscribeForm) subscribeForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]') ? e.target.querySelector('input[type="email"]').value : '';
  alert(`Thank you! ${email} is now subscribed.`);
  e.target.reset();
});
const faders = document.querySelectorAll('.fade-up');
const appearOptions = {
  threshold: 0.1
};

const appearOnScroll = new IntersectionObserver(function(entries, observer){
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));



// Wishlist functions
function getWishlist() { try { return JSON.parse(localStorage.getItem('wishlist')||'[]'); } catch(e){return []} }
function setWishlist(arr){ localStorage.setItem('wishlist', JSON.stringify(arr)); }

function updateWishlistIcons() {
  document.querySelectorAll('.wishlist-icon').forEach(icon => {
    const id = +icon.dataset.id;
    const list = getWishlist();
    if (list.includes(id)) {
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
    } else {
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
    }
  });
}



let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");
  // guard: if no slides or dots, skip gracefully
  if (!slides || slides.length === 0 || !dots || dots.length === 0) {
    setTimeout(showSlides, 4000);
    return;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }

  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }    

  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  if (slides[slideIndex-1]) slides[slideIndex-1].style.display = "block";  
  if (dots[slideIndex-1]) dots[slideIndex-1].classList.add("active");

  setTimeout(showSlides, 4000); // 4 seconds per slide
}

const viewMoreBtn = document.getElementById('viewMoreBtn');
if (viewMoreBtn) {
  viewMoreBtn.addEventListener('click', () => {
    const productWrapper = document.getElementById('product-wrapper');
    if (productWrapper) productWrapper.style.maxHeight = 'none';
    viewMoreBtn.style.display = 'none';
  });
}

// ----------------------------
// Client-side cart (localStorage)
// ----------------------------
function getCart(){
  try{ return JSON.parse(localStorage.getItem('cart')||'[]') }catch(e){return []}
}
function setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }

function cartItemKey(item){ return `${item.id}::${item.size}` }

function addToCart(item){
  const cart = getCart();
  const key = cartItemKey(item);
  const found = cart.find(ci=>ci.key===key);
  if(found){ found.qty = (found.qty||0)+item.qty; }
  else { cart.push(Object.assign({key},item)); }
  setCart(cart);
  updateCartUI();
}

function clearCart(){ setCart([]); updateCartUI(); }

function getCartCount(){ return getCart().reduce((s,i)=>s + (i.qty||0),0); }

function getCartTotal(){ return getCart().reduce((s,i)=>s + (i.qty||0)*(i.price||0),0); }

function updateCartUI(){
  const countEl = document.getElementById('cart-count');
  if(countEl) countEl.textContent = getCartCount();
  renderMiniCart();
}

function renderMiniCart(){
  const container = document.getElementById('mini-cart-items');
  const totalEl = document.getElementById('mini-cart-total');
  const cart = getCart();
  if(!container) return;
  container.innerHTML='';
  cart.forEach(item=>{
    const div = document.createElement('div'); div.className='mini-cart-item';
    div.innerHTML = `
      <img src="${item.src}" alt="${item.title}">
      <div class="meta">
        <div class="title">${item.title}</div>
        <div class="meta-sub">Size: ${item.size} · $${item.price.toFixed(2)} · Qty: <strong>${item.qty}</strong></div>
      </div>
      <div class="controls">
        <button class="btn qty-decr" data-key="${item.key}">-</button>
        <button class="btn qty-incr" data-key="${item.key}">+</button>
        <button class="btn remove-item" data-key="${item.key}">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });
  if(totalEl) totalEl.textContent = '$'+getCartTotal().toFixed(2);

  // attach listeners
  container.querySelectorAll('.remove-item').forEach(btn=>btn.addEventListener('click', e=>{
    const key = btn.dataset.key; let cart = getCart(); cart = cart.filter(i=>i.key!==key); setCart(cart); updateCartUI();
  }));
  container.querySelectorAll('.qty-incr').forEach(btn=>btn.addEventListener('click', e=>{
    const key = btn.dataset.key; const cart = getCart(); const it = cart.find(i=>i.key===key); if(it){ it.qty++; setCart(cart); updateCartUI(); }
  }));
  container.querySelectorAll('.qty-decr').forEach(btn=>btn.addEventListener('click', e=>{
    const key = btn.dataset.key; const cart = getCart(); const it = cart.find(i=>i.key===key); if(it && it.qty>1){ it.qty--; setCart(cart); updateCartUI(); }
  }));
}

// open/close mini cart
const cartToggle = document.getElementById('cart-toggle');
const miniCart = document.getElementById('mini-cart');
function toggleMiniCart(open){
  if(!miniCart) return;
  if(typeof open === 'boolean'){
    miniCart.classList.toggle('open', open);
  } else miniCart.classList.toggle('open');
  miniCart.setAttribute('aria-hidden', miniCart.classList.contains('open') ? 'false' : 'true');
}
// primary listener (direct)
if(cartToggle && miniCart){
  cartToggle.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); toggleMiniCart(); });
}
// fallback: delegation (handles clicks on children or overlays)
// close mini-cart when clicking outside
document.addEventListener('click', (e)=>{
  if(e.target.closest && e.target.closest('#cart-toggle')){ e.preventDefault(); e.stopPropagation(); toggleMiniCart(); return; }
  // if click outside mini-cart when it's open, close it
  if(miniCart && miniCart.classList.contains('open')){
    if(!e.target.closest || !e.target.closest('#mini-cart')){
      toggleMiniCart(false);
    }
  }
});
const miniClose = document.getElementById('mini-cart-close'); if(miniClose) miniClose.addEventListener('click', ()=>{ toggleMiniCart(false); });
const miniClear = document.getElementById('mini-cart-clear'); if(miniClear) miniClear.addEventListener('click', ()=>{ clearCart(); });
const miniCheckout = document.getElementById('mini-cart-checkout');
if(miniCheckout) miniCheckout.addEventListener('click', ()=>{ window.location.href = 'checkout.html'; });

// Wire modal add to cart
const modalAddBtn = document.getElementById('modal-add');
if(modalAddBtn){
  modalAddBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const pid = +(modal.dataset.productId || 0);
    if(!pid) return alert('No product selected');
    const product = products.find(p=>p.id===pid);
    if(!product) return;
    const size = (document.getElementById('modal-size')||{value:'S'}).value;
    const qty = parseInt((document.getElementById('modal-quantity')||{textContent:'1'}).textContent,10) || 1;
    addToCart({ id: product.id, title: product.title, price: product.price, src: product.src, size: size, qty: qty });
    alert('Successfully added to cart!');
    // visual feedback and close modal
    modal.classList.remove('show');
    // open mini-cart so the user can see and manage items (do not auto-close)
    if(typeof toggleMiniCart === 'function') toggleMiniCart(true);
  });
}

// initialize cart UI on load
updateCartUI();

// Ensure modal is a direct child of <body> so fixed positioning isn't affected
// by transformed ancestors or unexpected nesting (helps when modal appears at page bottom)
window.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('modal');
  if (modalEl && modalEl.parentElement !== document.body) {
    document.body.appendChild(modalEl);
    modalEl.style.zIndex = '99999';
    // small safety: ensure modal uses fixed positioning
    modalEl.style.position = 'fixed';
  }
  // move mini-cart to body to avoid being affected by ancestor transforms
  const mini = document.getElementById('mini-cart');
  if (mini && mini.parentElement !== document.body) {
    document.body.appendChild(mini);
    mini.style.zIndex = '1000000';
    mini.style.position = 'fixed';
    mini.setAttribute('aria-hidden', mini.classList.contains('open') ? 'false' : 'true');
  }

  // wire quantity buttons and ensure defaults (safe to run even if elements not present yet)
  const qtyDisplay = document.getElementById('modal-quantity');
  const inc = document.getElementById('qty-increase');
  const dec = document.getElementById('qty-decrease');
  const sizeSelect = document.getElementById('modal-size');
  if (qtyDisplay) qtyDisplay.textContent = '1';
  if (sizeSelect) sizeSelect.value = 'S';
  if (inc && qtyDisplay) {
    inc.addEventListener('click', ()=>{
      let v = parseInt(qtyDisplay.textContent,10) || 1; v++; qtyDisplay.textContent = v;
    });
  }
  if (dec && qtyDisplay) {
    dec.addEventListener('click', ()=>{
      let v = parseInt(qtyDisplay.textContent,10) || 1; if (v>1) v--; qtyDisplay.textContent = v;
    });
  }

  // Wishlist wiring: use localStorage 'wishlist' array of ids
  // functions defined outside

  const wishlistBtn = document.getElementById('modal-wishlist-btn');
  const wishlistIcon = document.getElementById('modal-wishlist');
  // helper to render icon state
  function renderWishlistIcon(active){
    if(!wishlistIcon) return;
    if(active){
      wishlistIcon.classList.remove('fa-regular'); wishlistIcon.classList.add('fa-solid');
      wishlistIcon.classList.add('modal-wishlist','active');
      wishlistBtn && wishlistBtn.setAttribute('aria-pressed','true');
    } else {
      wishlistIcon.classList.remove('fa-solid'); wishlistIcon.classList.add('fa-regular');
      wishlistIcon.classList.remove('active'); wishlistIcon.classList.add('modal-wishlist');
      wishlistBtn && wishlistBtn.setAttribute('aria-pressed','false');
    }
  }

  // update modal icon when opening
  window.updateModalWishlistIcon = function(productId){
    const id = +productId;
    const list = getWishlist();
    renderWishlistIcon(list.indexOf(id) !== -1);
  }

  // toggle when user clicks heart
  if(wishlistBtn){
    wishlistBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      const pid = +(modal.dataset.productId || 0);
      if(!pid) return;
      const list = getWishlist();
      const idx = list.indexOf(pid);
      if(idx === -1){ list.push(pid); renderWishlistIcon(true); }
      else { list.splice(idx,1); renderWishlistIcon(false); }
      setWishlist(list);
    });
  }

  // Card wishlist icons listener
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('wishlist-icon')) {
      const id = +e.target.dataset.id;
      const list = getWishlist();
      const idx = list.indexOf(id);
      if (idx === -1) {
        list.push(id);
      } else {
        list.splice(idx, 1);
      }
      setWishlist(list);
      updateWishlistIcons();
    }
  });
});


// JS to toggle the dropdown (guarded)
const womenMenu = document.getElementById("womenMenu");
const dropdownPanel = document.getElementById("dropdownPanel");
if (womenMenu && dropdownPanel) {
  womenMenu.addEventListener("click", function (e) {
    e.preventDefault();
    dropdownPanel.style.display = dropdownPanel.style.display === "block" ? "none" : "block";
  });

  // close when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest(".menu-dropdown")) {
      dropdownPanel.style.display = "none";
    }
  });
}


