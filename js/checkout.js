// checkout.js — reads cart from localStorage, shows summary, validates shipping form
(function(){
  function getCart(){ try{ return JSON.parse(localStorage.getItem('cart')||'[]') }catch(e){return []} }
  function getCartTotal(){ return getCart().reduce((s,i)=>s + (i.qty||0)*(i.price||0),0); }

  const summaryItems = document.getElementById('summary-items');
  const summaryTotal = document.getElementById('summary-total');
  const form = document.getElementById('checkout-form');
  const result = document.getElementById('checkout-result');

  function renderSummary(){
    const cart = getCart();
    if(!summaryItems) return;
    summaryItems.innerHTML = '';
    if(cart.length===0){ summaryItems.innerHTML = '<p>Your cart is empty.</p>'; return; }
    cart.forEach(item=>{
      const div = document.createElement('div'); div.className = 'summary-item';
      div.innerHTML = `<div class="s-row"><img src="${item.src}" alt="${item.title}" style="width:56px;height:56px;object-fit:cover;margin-right:8px"><div><div style="font-weight:700">${item.title}</div><div>Size: ${item.size} · Qty: ${item.qty}</div></div><div style="margin-left:auto">$${(item.price*item.qty).toFixed(2)}</div></div>`;
      summaryItems.appendChild(div);
    });
    if(summaryTotal) summaryTotal.textContent = '$'+getCartTotal().toFixed(2);
  }

  // Before rendering the full form, check authentication via /api/me.php
  async function ensureAuth(){
    try{
      const r = await fetch('/api/me.php', {credentials:'include'});
      if (!r.ok) {
        // not authenticated — redirect to login and preserve return url
        window.location.href = 'login.html?return=' + encodeURIComponent(window.location.pathname + window.location.search);
        return false;
      }
      return true;
    } catch(e){
      // on network error, still show form but warn
      return true;
    }
  }

  (async function(){
    const ok = await ensureAuth();
    if(!ok) return; // redirect to login
    renderSummary();
  })();

  if(!form) return;

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    // simple validation
    const shipping = {
      fullname: (document.getElementById('fullname')||{}).value || '',
      phone: (document.getElementById('phone')||{}).value || '',
      address1: (document.getElementById('address1')||{}).value || '',
      address2: (document.getElementById('address2')||{}).value || '',
      city: (document.getElementById('city')||{}).value || '',
      state: (document.getElementById('state')||{}).value || '',
      zip: (document.getElementById('zip')||{}).value || '',
      country: (document.getElementById('country')||{}).value || ''
    };
    if(!shipping.fullname || !shipping.phone || !shipping.address1 || !shipping.city || !shipping.state || !shipping.zip || !shipping.country){
      alert('Please fill all required fields.');
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const total = getCartTotal();

    try {
      const response = await fetch('/api/place-order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cart, shipping, total })
      });

      const resultData = await response.json();
      if (response.ok && resultData.ok) {
        // Success: Clear cart and show confirmation
        localStorage.removeItem('cart');
        if(result){
          result.classList.remove('hidden');
          result.innerHTML = `<h3>Order Placed Successfully!</h3><p>Order ID: <strong>${resultData.order_id}</strong></p><p>Shipping to <strong>${shipping.fullname}</strong>, ${shipping.address1}${shipping.address2?(', '+shipping.address2):''}, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}. Phone: ${shipping.phone}</p><p>Order total: <strong>$${total.toFixed(2)}</strong></p><p>You will receive a confirmation email shortly.</p>`;
          window.scrollTo({top:0,behavior:'smooth'});
        }
      } else {
        alert('Error placing order: ' + (resultData.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  });
})();
