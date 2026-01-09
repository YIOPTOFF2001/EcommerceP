
// Account management script
console.log('Account.js script loaded successfully');

(function(){
  async function refresh(){
    console.log('Account refresh running...');
    const accountLink = document.getElementById('account-link');
    if(!accountLink) {
      console.log('Account link not found');
      return;
    }
    console.log('Account link found');

    // Immediately remove logout button if on account page
    if (window.location.pathname.includes('account.html')) {
      const headerLogoutBtn = document.getElementById('logout-btn');
      if (headerLogoutBtn) {
        headerLogoutBtn.remove();
        console.log('Removed logout button from header on account page');
      }
    }

    try{
      console.log('🌐 Fetching /api/me.php...');
      const r = await fetch('/api/me.php', {credentials:'include'});
      console.log('API response status:', r.status);

      if(!r.ok){
        console.log('Not authenticated, setting to login');
        if(accountLink){
          accountLink.href = 'login.html';
          const span = accountLink.querySelector('span');
          if(span) {
            span.textContent = 'Account';
            console.log('Set account text to Account');
          }
        }
        // If on account page and not logged in, redirect to login
        if(window.location.pathname.includes('account.html')) {
          console.log('On account page but not logged in, redirecting to login');
          window.location.href = 'login.html?return=account.html';
        }
        return;
      }

      const j = await r.json();
      console.log('API response data:', j);

      if(j && j.ok && j.user){
        const name = j.user.name || (j.user.email || '').split('@')[0];
        console.log('User authenticated:', name);

        if(accountLink){
          accountLink.href = 'account.html';
          const span = accountLink.querySelector('span');
          if(span) {
            span.textContent = 'Hi, '+name;
            console.log('Updated account link text to:', span.textContent);
          } else {
            console.log('Span not found in account link');
          }
        }

        // If on account page, display user details
        const accountDetails = document.getElementById('account-details');
        if(accountDetails) {
          console.log('Displaying user details on account page');
          accountDetails.innerHTML = `
            <div style="text-align: left;">
              <p><strong>Name:</strong> ${j.user.name || 'Not provided'}</p>
              <p><strong>Email:</strong> ${j.user.email}</p>
              <p><strong>Member since:</strong> ${new Date(j.user.created_at).toLocaleDateString()}</p>
            </div>
          `;
        }

        // Hide/remove logout button in header when on account page
        const headerLogoutBtn = document.getElementById('logout-btn');
        if (headerLogoutBtn && window.location.pathname.includes('account.html')) {
          headerLogoutBtn.remove(); // Completely remove the button
        }

        // add logout button if not present and not on account page
        if(!document.getElementById('logout-btn-page') && !window.location.pathname.includes('account.html')){
          console.log('🚪 Adding logout button');
          const btn = document.createElement('button'); btn.id='logout-btn'; btn.className='btn'; btn.textContent='Logout';
          btn.addEventListener('click', async ()=>{
            console.log('👋 Logout clicked');
            await fetch('/api/logout.php',{method:'POST',credentials:'include'}).catch(()=>{});
            window.location.href = 'index.html';
          });
          if(accountLink && accountLink.parentElement) accountLink.parentElement.appendChild(btn);
          // Also add to account page if it exists
          const accountActions = document.getElementById('account-actions');
          if(accountActions && !accountActions.querySelector('#logout-btn')) {
            const pageBtn = btn.cloneNode(true);
            pageBtn.id = 'logout-btn-page';
            pageBtn.addEventListener('click', async ()=>{
              console.log('👋 Logout clicked from account page');
              await fetch('/api/logout.php',{method:'POST',credentials:'include'}).catch(()=>{});
              window.location.href = 'login.html'; // Redirect to login page from account page
            });
            accountActions.appendChild(pageBtn);
          }
        }
      } else {
        console.log('❌ Invalid API response structure');
      }
    }catch(e){
      console.error('💥 Account refresh error:', e);
    }
  }

  // run on load and also after a short delay to handle login redirects
  window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOMContentLoaded - running account refresh');
    refresh();
    // Also run after a delay in case of login redirect timing issues
    setTimeout(() => {
      console.log('⏰ Delayed refresh running');
      refresh();
    }, 1000);
  });

  // Also run on page visibility change (when user comes back to tab)
  document.addEventListener('visibilitychange', () => {
    if(!document.hidden) {
      console.log('👀 Page visible - running account refresh');
      refresh();
    }
  });

  // Export for manual testing
  window.refreshAccount = refresh;
})();

// Change Password Functionality
(function(){
  const changePasswordForm = document.getElementById('change-password-form');
  if(changePasswordForm){
    changePasswordForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const currentPassword = document.getElementById('current-password').value;
      const newPassword = document.getElementById('new-password').value;
      const confirmPassword = document.getElementById('confirm-password').value;

      if(newPassword !== confirmPassword){
        showPasswordMessage('New passwords do not match', 'error');
        return;
      }

      try{
        const res = await fetch('/api/change-password.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({current_password: currentPassword, new_password: newPassword})
        });

        const data = await res.json();
        if(res.ok){
          showPasswordMessage('✅ Password updated successfully!', 'success');
          changePasswordForm.reset();
        } else {
          showPasswordMessage(data.error || 'Failed to update password', 'error');
        }
      } catch(e){
        showPasswordMessage('Network error occurred', 'error');
      }
    });
  }

  function showPasswordMessage(message, type){
    const msgDiv = document.getElementById('password-msg');
    if(msgDiv){
      msgDiv.className = type === 'success' ? 'success' : 'error';
      msgDiv.classList.remove('hidden');
      msgDiv.textContent = message;

      // Add visual emphasis for success messages
      if(type === 'success'){
        msgDiv.style.fontWeight = 'bold';
        msgDiv.style.fontSize = '16px';
        msgDiv.style.border = '2px solid #28a745';
        msgDiv.style.background = '#d4edda';
        msgDiv.style.color = '#155724';

        // Auto-hide success messages after 5 seconds
        setTimeout(() => {
          msgDiv.classList.add('hidden');
        }, 5000);
      } else {
        // Reset styling for error messages
        msgDiv.style.fontWeight = 'normal';
        msgDiv.style.fontSize = '14px';
        msgDiv.style.border = '';
      }
    }
  }
})();

// Delete Account Functionality
(function(){
  console.log('Initializing delete account functionality');
  const deleteAccountBtn = document.getElementById('delete-account-btn');
  console.log('Delete account button element:', deleteAccountBtn);

  if(deleteAccountBtn){
    console.log('Delete account button found, adding event listener');
    deleteAccountBtn.addEventListener('click', async function(){
      console.log('Delete account button clicked');
      const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      console.log('Confirm result:', confirmed);
      if(!confirmed) {
        console.log('User cancelled deletion');
        return;
      }

      const password = prompt('Please enter your password to confirm account deletion:');
      console.log('Password entered:', password ? 'Yes' : 'No');
      if(!password) {
        console.log('No password entered');
        return;
      }
      console.log('Password entered, making API call');

      try{
        console.log('🌐 Making fetch request to /api/delete-account.php');
        const res = await fetch('/api/delete-account.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({confirm_password: password})
        });

        console.log('📡 API response status:', res.status, res.ok);
        const data = await res.json();
        console.log('📄 API response data:', data);

        if(res.ok){
          console.log('✅ Account deleted successfully');
          alert('Account deleted successfully. You will be redirected to the home page.');
          window.location.href = 'index.html';
        } else {
          console.log('❌ Delete failed:', data.error);
          showDeleteMessage(data.error || 'Failed to delete account', 'error');
        }
      } catch(e){
        console.error('💥 Delete account error:', e);
        showDeleteMessage('Network error occurred', 'error');
      }
    });
  } else {
    console.log('❌ Delete account button not found');
  }

  function showDeleteMessage(message, type){
    const msgDiv = document.getElementById('delete-msg');
    if(msgDiv){
      msgDiv.className = type === 'success' ? 'success' : 'error';
      msgDiv.classList.remove('hidden');
      msgDiv.textContent = message;
    }
  }
})();
