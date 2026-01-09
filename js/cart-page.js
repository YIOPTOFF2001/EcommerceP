// Cart page script — reads localStorage cart and renders full page controls
(function(){
  function getCart(){ try{ return JSON.parse(localStorage.getItem('cart')||'[]') }catch(e){return []} }
  function setCart(c){ localStorage.setItem('cart', JSON.stringify(c)); }
  function getCartTotal(){ return getCart().reduce((s,i)=>s + (i.qty||0)*(i.price||0),0); }

  function render(){
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const cart = getCart();
    container.innerHTML = '';
    if(cart.length === 0){ container.innerHTML = '<p>Your cart is empty.</p>'; totalEl.textContent = '$0.00'; return; }
    cart.forEach(item=>{
      const el = document.createElement('div'); el.className='card';
      el.style.display = 'flex'; el.style.gap = '12px'; el.style.alignItems = 'center'; el.innerHTML = `
        <img src="${item.src}" style="width:120px;height:120px;object-fit:cover;border-radius:10px">
        <div style="flex:1">
          <div style="font-weight:700">${item.title}</div>
          <div style="color:var(--muted);margin-top:6px">Size: ${item.size}</div>
          <div style="margin-top:8px">Price: $${item.price.toFixed(2)}</div>
          <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
            <button class="btn qty-decr" data-key="${item.key}">-</button>
            <div style="min-width:28px;text-align:center">${item.qty}</div>
            <button class="btn qty-incr" data-key="${item.key}">+</button>
            <button class="btn remove" data-key="${item.key}">Remove</button>
          </div>
        </div>
      `;
      container.appendChild(el);
    });
    totalEl.textContent = '$'+getCartTotal().toFixed(2);

    // attach listeners
    container.querySelectorAll('.remove').forEach(btn=>btn.addEventListener('click', ()=>{ const key=btn.dataset.key; let c=getCart(); c=c.filter(i=>i.key!==key); setCart(c); render(); window.opener && window.opener.postMessage('cart-updated','*'); }));
    container.querySelectorAll('.qty-incr').forEach(btn=>btn.addEventListener('click', ()=>{ const key=btn.dataset.key; const c=getCart(); const it=c.find(i=>i.key===key); if(it){ it.qty++; setCart(c); render(); window.opener && window.opener.postMessage('cart-updated','*'); }}));
    container.querySelectorAll('.qty-decr').forEach(btn=>btn.addEventListener('click', ()=>{ const key=btn.dataset.key; const c=getCart(); const it=c.find(i=>i.key===key); if(it && it.qty>1){ it.qty--; setCart(c); render(); window.opener && window.opener.postMessage('cart-updated','*'); }}));
  }

  const cartClearBtn = document.getElementById('cart-clear');
  const cartCheckoutBtn = document.getElementById('cart-checkout');
  if (cartClearBtn) cartClearBtn.addEventListener('click', ()=>{ if(confirm('Clear cart?')){ localStorage.removeItem('cart'); render(); } });
  if (cartCheckoutBtn) cartCheckoutBtn.addEventListener('click', ()=>{ window.location.href = 'checkout.html'; });

  render();
})();
