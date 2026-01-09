(function(){
  // Check if user is admin
  async function checkAdmin() {
    try {
      const r = await fetch('/api/me.php', {credentials:'include'});
      if (!r.ok) {
        window.location.href = 'login.html';
        return false;
      }
      const data = await r.json();
      if (data.user.role !== 'admin') {
        document.getElementById('admin-content').innerHTML = '<p>Access denied. Admin role required.</p>';
        return false;
      }
      return true;
    } catch(e) {
      window.location.href = 'login.html';
      return false;
    }
  }

  async function loadOrders() {
    try {
      const r = await fetch('/api/admin-orders.php', {credentials:'include'});
      if (!r.ok) throw new Error('Failed to load orders');
      const data = await r.json();
      renderOrders(data.orders);
    } catch(e) {
      document.getElementById('admin-content').innerHTML = '<p>Error loading orders: ' + e.message + '</p>';
    }
  }

  function renderOrders(orders) {
    const container = document.getElementById('admin-content');
    if (orders.length === 0) {
      container.innerHTML = '<p>No orders found.</p>';
      return;
    }
    let html = '<table class="admin-table"><thead><tr><th>Order ID</th><th>User</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>';
    orders.forEach(order => {
      const shipping = JSON.parse(order.shipping_address);
      html += `<tr>
        <td>${order.id}</td>
        <td>${shipping.fullname} (${order.user_email})</td>
        <td>$${order.total}</td>
        <td><select class="status-select" data-id="${order.id}">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select></td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
        <td><button class="btn update-status" data-id="${order.id}">Update</button></td>
      </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;

    // Attach event listeners
    container.querySelectorAll('.update-status').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const select = container.querySelector(`.status-select[data-id="${id}"]`);
        const status = select.value;
        try {
          const r = await fetch('/api/update-order-status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ order_id: id, status })
          });
          if (!r.ok) throw new Error('Failed to update');
          alert('Status updated successfully');
        } catch(e) {
          alert('Error updating status: ' + e.message);
        }
      });
    });
  }

  // Logout
  document.getElementById('logout-link').addEventListener('click', async () => {
    await fetch('/api/logout.php', {credentials:'include'});
    window.location.href = 'index.html';
  });

  // Init
  (async function(){
    if (await checkAdmin()) {
      loadOrders();
    }
  })();
})();