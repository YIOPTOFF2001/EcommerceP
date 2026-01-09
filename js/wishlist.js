(function(){
  function getWishlist(){ try{ return JSON.parse(localStorage.getItem('wishlist')||'[]') }catch(e){return []} }
  function setWishlist(w){ localStorage.setItem('wishlist', JSON.stringify(w)); }
  function render(){
    const container = document.getElementById('wishlist-items');
    if(!container){ console.warn('No wishlist container'); return; }
    const list = getWishlist();
    container.innerHTML = '';
    if(list.length === 0){ container.innerHTML = '<p>Your wishlist is empty.</p>'; return; }
    list.forEach(id=>{
      const p = (typeof products !== 'undefined' && Array.isArray(products)) ? products.find(x=>x.id===id) : null;
      if(!p){ return; }
      const card = document.createElement('div'); card.className='card';
      card.style.display='flex'; card.style.gap='12px'; card.style.alignItems='center';
      card.innerHTML = `
        <img src="${p.src}" style="width:100px;height:100px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <div style="font-weight:700">${p.title}</div>
          <div style="color:var(--muted);margin-top:6px">$${p.price.toFixed(2)}</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn wishlist-remove" data-id="${p.id}">Remove</button>
          <button class="btn" onclick="location.href='index.html'">View</button>
        </div>
      `;
      container.appendChild(card);
    });
    container.querySelectorAll('.wishlist-remove').forEach(btn=>btn.addEventListener('click', ()=>{
      const id = +btn.dataset.id; let w = getWishlist(); w = w.filter(x=>x!==id); setWishlist(w); render();
    }));
  }

  render();
})();
