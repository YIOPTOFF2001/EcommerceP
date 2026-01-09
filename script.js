document.getElementById('year').textContent = new Date().getFullYear();

    const products = [
      {id:1,title:'Tailored Trench Jeans',price:189,src:'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',desc:'Structured wool-blend trench with classic lapel and modern length.'},
      {id:2,title:'Silk Slip Dress',price:129,src:'images/dress.jpg',desc:'Bias-cut silk slip — perfect alone or layered.'},
      {id:3,title:'Cropped Knit Polo',price:79,src:'images/polo.jpg',desc:'Cotton knit with a subtle rib, cropped to pair with high waists.'},
      {id:4,title:'High-rise Wide Leg',price:139,src:'images/jean.jpg',desc:'Tailored wide-leg trousers, comfortable stretch and elegant fall.'},
      {id:5,title:'Bodycon dress',price:99,src:'images/bodycon.png',desc:'Crisp cotton shirt with a modern fit and versatile style.'},
      {id:6,title:'Leather Ankle Boots',price:159,src:'images/boots.png',desc:'Sleek leather boots with a comfortable block heel.'},
      {id:7,title:'Long Satin Skirt',price:199,src:'images/satin.png',desc:'Soft cashmere sweater with a relaxed fit and timeless design.'},
      {id:8,title:'Pleated Mini Skirt',price:119,src:'images/plaited.png',desc:'Flowy pleated skirt that moves with you.'},
      {id:9,title:'Wool Fedora Hat',price:89,src:'images/hat.jpg',desc:'Stylish wool fedora to complete any outfit.'},
      {id:10,title:'Silk Scarf',price:49,src:'images/scarf.jpg',desc:'Luxurious silk scarf with a vibrant print.'},
      {id:11,title:'Denim Jacket',price:109,src:'images/jacket.jpg',desc:'Classic denim jacket with a modern fit.'},
      {id:12,title:'Leather Tote Bag',price:179,src:'images/bag.jpg',desc:'Spacious leather tote for everyday essentials.'},
      {id:13,title:'Ankle-length Chinos',price:89,src:'images/chinos.jpg',desc:'Versatile chinos with a tailored fit.'},
      {id:14,title:'Wool Blend Coat',price:249,src:'images/coat.jpg',desc:'Warm wool blend coat with a timeless silhouette.'},
      {id:15,title:'Graphic Tee',price:39,src:'images/tee.jpg',desc:'Casual graphic tee made from soft cotton.'},
      {id:16,title:'Suede Loafers',price:129,src:'images/loafers.jpg',desc:'Comfortable suede loafers with a classic design.'},
      {id:17,title:'Linen Shorts',price:69,src:'images/shorts.jpg',desc:'Lightweight linen shorts perfect for warm weather.'},
      {id:18,title:'Wool Beanie',price:29,src:'images/beanie.jpg',desc:'Cozy wool beanie to keep you warm.'},
      {id:19,title:'Faux Fur Vest',price:149,src:'images/vest.jpg',desc:'Chic faux fur vest for layering.'},
      {id:20,title:'Athleisure Joggers',price:89,src:'images/joggers.jpg',desc:'Comfortable joggers for a sporty look.'},
      {id:21,title:'Wrap Dress',price:139,src:'images/wrapdress.jpg',desc:'Flattering wrap dress for any occasion.'},
      {id:22,title:'Chelsea Boots',price:159,src:'images/chelsea.jpg',desc:'Classic Chelsea boots with a modern twist.'},
      {id:23,title:'Trench Coat',price:229,src:'images/trench.jpg',desc:'Timeless trench coat with a tailored fit.'},
      {id:24,title:'Puffer Jacket',price:199,src:'images/puffer.jpg',desc:'Warm puffer jacket for cold days.'},
      {id:25,title:'Ribbed Tank Top',price:49,src:'images/tanktop.jpg',desc:'Versatile ribbed tank top for layering or wearing alone.'},
      {id:26,title:'Corduroy Pants',price:119,src:'images/corduroy.jpg',desc:'Soft corduroy pants with a vintage vibe.'},
      {id:27,title:'Faux Leather Jacket',price:179,src:'images/fauxleather.jpg',desc:'Edgy faux leather jacket for a bold look.'},
      {id:28,title:'Maxi Skirt',price:129,src:'images/maxiskirt.jpg',desc:'Flowy maxi skirt with a bohemian feel.'},
      {id:29,title:'Button-up Shirt Dress',price:119,src:'images/shirtdress.jpg',desc:'Casual button-up shirt dress for everyday wear.'},
      {id:30,title:'Espadrille Wedges',price:139,src:'images/espadrilles.jpg',desc:'Comfortable espadrille wedges for a summery look.'},
      {id:31,title:'Denim Overalls',price:149,src:'images/overalls.jpg',desc:'Classic denim overalls with a modern fit.'},
      {id:32,title:'Fleece Hoodie',price:79,src:'images/hoodie.jpg',desc:'Cozy fleece hoodie for casual days.'},
      {id:33,title:'Pleated Trousers',price:129,src:'images/pleatedtrousers.jpg',desc:'Elegant pleated trousers for a polished look.'},
      {id:34,title:'Silk Blouse',price:159,src:'images/silkblouse.jpg',desc:'Luxurious silk blouse with a feminine silhouette.'},
      {id:35,title:'Ankle Strap Heels',price:149,src:'images/anklestrap.jpg',desc:'Chic ankle strap heels for special occasions.'}


    ];

    const grid = document.getElementById('product-grid');
    products.forEach(p=>{
  const el = document.createElement('div'); 
  el.className='card';
  el.innerHTML = `<img src="${p.src}" alt="${p.title}"><div style=\"margin-top:8px\"><div style=\"font-weight:700\">${p.title}</div><div class=\"product-meta\"><div class=\"price\">$${p.price.toFixed(2)}</div><button class=\"btn\" data-id=\"${p.id}\">Quick View</button></div></div>`;
  grid.appendChild(el);
});

  

    // modal logic
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    grid.addEventListener('click', e=>{
      const btn = e.target.closest('button[data-id]'); if(!btn) return;
      const id = +btn.dataset.id; const p = products.find(x=>x.id===id);
      modalImg.src = p.src; modalTitle.textContent = p.title; modalDesc.textContent = p.desc; modalPrice.textContent = '$'+p.price.toFixed(2);
      modal.classList.add('show');
    });
    document.getElementById('modal-close').addEventListener('click', ()=>modal.classList.remove('show'));
    modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('show') });

    // mobile nav toggle (simple)
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');
    navToggle.addEventListener('click', ()=>{ if(nav.style.display==='flex'){nav.style.display='none'}else{nav.style.display='flex';nav.style.flexDirection='column';nav.style.position='absolute';nav.style.right='28px';nav.style.top='72px';nav.style.background='white';nav.style.padding='12px';nav.style.borderRadius='12px';nav.style.boxShadow='var(--shadow)'}});

  // Hero Typewriter Effect
const heroText = "Minimal silhouettes with rich texture. Clothes that age like wine.";
const heroElement = document.getElementById("hero-text");
let i = 0;

function typeHero() {
  if (i < heroText.length) {
    heroElement.innerHTML += heroText.charAt(i);
    i++;
    setTimeout(typeHero, 50); // adjust speed here
  }
}
window.addEventListener("load", typeHero);
const blogCarousel = document.querySelector('.blog-carousel');
document.getElementById('blog-next').addEventListener('click', ()=> {
  blogCarousel.scrollBy({ left: 280, behavior: 'smooth' });
});
document.getElementById('blog-prev').addEventListener('click', ()=> {
  blogCarousel.scrollBy({ left: -280, behavior: 'smooth' });
});

document.querySelector('.subscribe-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
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



let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }

  slideIndex++;
  if (slideIndex > slides.length) { slideIndex = 1 }    

  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].classList.add("active");

  setTimeout(showSlides, 4000); // 4 seconds per slide
}

document.getElementById('viewMoreBtn').addEventListener('click', () => {
  const productWrapper = document.getElementById('product-wrapper');
  productWrapper.style.maxHeight = 'none';
  document.getElementById('viewMoreBtn').style.display = 'none';
});

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
});


// JS to toggle the dropdown
const womenMenu = document.getElementById("womenMenu");
const dropdownPanel = document.getElementById("dropdownPanel");

womenMenu.addEventListener("click", function (e) {
    e.preventDefault();
    dropdownPanel.style.display = dropdownPanel.style.display === "block" ? "none" : "block";
});

// close when clicking outside
document.addEventListener("click", function (e) {
    if (!e.target.closest(".menu-dropdown")) {
        dropdownPanel.style.display = "none";
    }
});


