document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Not logged in');
  
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
  
      const list = document.getElementById('topUsersList');
      data.topUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} (${user.email}) - ${user.points} points`;
        list.appendChild(li);
      });
    } catch (err) {
      console.error('Failed to load stats', err);
      alert('Error loading stats');
    }
  });
  
  async function loadAdminStats() {
    const token = localStorage.getItem('token');
  
    const res = await fetch('http://localhost:5000/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
  
    const reportedDiv = document.getElementById('reportedContent');
    reportedDiv.innerHTML = `<h3>Reported Content</h3>` + data.reportedContent.map(c => `
      <p>${c.title} (${c.source}) - ${c.reports.length} reports</p>
    `).join('');
  
    const topContentDiv = document.getElementById('topContent');
    topContentDiv.innerHTML = `<h3>Top Saved Content</h3>` + data.topSavedContent.map(c => `
      <p>${c.title} - Saved ${c.savedCount || 0} times</p>
    `).join('');
  
    const usersDiv = document.getElementById('activeUsers');
    usersDiv.innerHTML = `<h3>Top Active Users</h3>` + data.topUsers.map(u => `
      <p>${u.name} - ${u.points} points</p>
    `).join('');
  }
  
  loadAdminStats();
  