// auth.js — handles login and signup forms and redirects
(function(){
  function postJSON(url, body){
    return fetch(url, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),credentials:'include'}).then(r=>r.json().then(j=>({ok:r.ok,status:r.status,body:j}))).catch(e=>({ok:false,status:0,body:{error:'network'}}));
  }

  // read returnUrl from querystring
  function qs(name){ const params=new URLSearchParams(location.search); return params.get(name) }
  const returnTo = qs('return') || qs('next') || 'index.html';

  const loginForm = document.getElementById('login-form');
  if(loginForm){
    loginForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const email = (document.getElementById('email')||{}).value || '';
      const password = (document.getElementById('password')||{}).value || '';
      const res = await postJSON('/api/login.php',{email,password});
      const msg = document.getElementById('login-msg');
      if(res.ok){ location.href = returnTo; }
      else { if(msg){ msg.classList.remove('hidden'); msg.innerHTML = res.body && res.body.error ? res.body.error : 'Login failed'; } }
    });
  }

  const signupForm = document.getElementById('signup-form');
  if(signupForm){
    signupForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const email = (document.getElementById('email')||{}).value || '';
      const password = (document.getElementById('password')||{}).value || '';
      const name = (document.getElementById('name')||{}).value || '';
      const res = await postJSON('/api/register.php',{email,password,name});
      const msg = document.getElementById('signup-msg');
      if(res.ok){ 
        if(msg){ 
          msg.classList.remove('hidden'); 
          msg.classList.add('success');
          msg.innerHTML = '<div style="font-weight: bold;">Account created successfully!</div><p>Please <a href="login.html">click here to login</a> with your new account.</p>';
        }
        // Hide the form
        signupForm.style.display = 'none';
      }
      else { if(msg){ msg.classList.remove('hidden'); msg.textContent = res.body && res.body.error ? res.body.error : 'Signup failed'; } }
    });
  }

})();
