// Register Form Handler
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Registration successful!');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Server error. Check console.');
  }
});

// Login Form Handler
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login successful!');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Server error. Check console.');
  }
});

// Dashboard Page Logic
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.location.pathname.includes('dashboard.html')) return;

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    alert('Unauthorized! Please log in.');
    window.location.href = 'login.html';
    return;
  }

  // Set user info
  document.getElementById('welcomeMsg').innerText = `Welcome, ${user.name}!`;
  document.getElementById('userEmail').innerText = `Email: ${user.email}`;
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userPoints').textContent = user.points;

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.clear();
    alert('Logged out!');
    window.location.href = 'login.html';
  });

  // Load user data and feed
  await loadUserData(user._id, token);
  await loadFeed();
});

// Load user points and transactions
async function loadUserData(userId, token) {
  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById('points').textContent = data.points;

      const list = document.getElementById('transaction-list');
      if (list) {
        list.innerHTML = '';
        data.transactions.reverse().forEach((tx) => {
          const item = document.createElement('li');
          item.textContent = `${tx.purpose} - ${tx.amount} pts (${new Date(tx.timestamp).toLocaleString()})`;
          list.appendChild(item);
        });
      }
    } else {
      alert(data.message || 'Failed to load user data.');
    }
  } catch (err) {
    console.error('User data fetch error:', err);
    alert('Failed to load user data.');
  }
}

// Load feed items
async function loadFeed() {
  try {
    const response = await fetch('http://localhost:5000/api/feed');
    const feedItems = await response.json();

    const container = document.getElementById('feedContainer');
    if (!container) return;

    container.innerHTML = '';

    feedItems.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      card.innerHTML = `
        <h3>${item.title}</h3>
        <p><strong>Source:</strong> ${item.source}</p>
        <p>${item.preview}</p>
        <a href="${item.url}" target="_blank">Read more</a>
        <hr>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading feed:', error);
  }
}


card.innerHTML = `
  <h3>${item.title}</h3>
  <p><strong>Source:</strong> ${item.source}</p>
  <p>${item.preview}</p>
  <a href="${item.url}" target="_blank">Read more</a><br>
  <button onclick="handleSave('${item._id}')">Save</button>
  <button onclick="handleReport('${item._id}')">Report</button>
  <button onclick="handleShare('${item.url}')">Share</button>
  <hr>
`;



async function handleSave(contentId) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/points/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        action: 'save',
        contentId
      })
    });
    alert('Saved successfully! +10 points');
  } catch (err) {
    console.error('Save failed:', err);
    alert('Failed to save content');
  }
}

async function handleReport(contentId) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/points/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        action: 'report',
        contentId
      })
    });
    alert('Reported successfully! +5 points');
  } catch (err) {
    console.error('Report failed:', err);
    alert('Failed to report content');
  }
}

function handleShare(url) {
  navigator.clipboard.writeText(url);
  alert('Link copied to clipboard! +5 points (manually add if applicable)');
}



async function loadFeed() {
  try {
    const res = await fetch('http://localhost:5000/api/feed');
    const feedItems = await res.json();

    const feedContainer = document.getElementById('feed');
    feedContainer.innerHTML = '';

    feedItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'feed-card';
      card.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.preview}</p>
        <p><strong>Source:</strong> ${item.source}</p>
        <a href="${item.url}" target="_blank">View</a>
        <br/>
        <button onclick="handleAction('${item.id}', 'save')">Save</button>
        <button onclick="handleAction('${item.id}', 'share')">Share</button>
        <button onclick="handleAction('${item.id}', 'report')">Report</button>
        <hr/>
      `;
      feedContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading feed:', err);
  }
}

async function handleAction(contentId, action) {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/points/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ action, contentId }),
    });

    const data = await res.json();
    alert(data.message || 'Action completed');
  } catch (err) {
    alert('Action failed');
  }
}

loadFeed();


async function loadFeed() {
  try {
    const response = await fetch('http://localhost:5000/api/feed');
    const data = await response.json();

    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = '';

    data.feeds.forEach(feed => {
      const card = document.createElement('div');
      card.className = 'border p-4 rounded shadow';

      card.innerHTML = `
        <h3 class="text-lg font-semibold">${feed.title}</h3>
        <p class="text-sm text-gray-600">Source: ${feed.source}</p>
        <p>${feed.preview}</p>
        <a href="${feed.url}" target="_blank" class="text-blue-500 underline">Read more</a>
        <div class="mt-2 flex gap-2">
          <button onclick="saveContent(${feed.id})" class="bg-green-500 text-white px-2 py-1 rounded">Save</button>
          <button onclick="shareContent('${feed.url}')" class="bg-blue-500 text-white px-2 py-1 rounded">Share</button>
          <button onclick="reportContent(${feed.id})" class="bg-red-500 text-white px-2 py-1 rounded">Report</button>
        </div>
      `;

      feedContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Feed load error:', err);
  }
}

// Call when dashboard loads
window.onload = loadFeed;

// Sample stub functions for interactions
function saveContent(id) {
  alert(`Saved content ID: ${id}`);
}

function shareContent(url) {
  navigator.clipboard.writeText(url);
  alert('Link copied to clipboard!');
}

function reportContent(id) {
  alert(`Reported content ID: ${id}`);
}



function saveContent(id) {
  const token = localStorage.getItem('token');
  fetch('http://localhost:5000/api/feed/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ feedId: id })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error('Save error:', err));
}

function reportContent(id) {
  const token = localStorage.getItem('token');
  fetch('http://localhost:5000/api/feed/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ feedId: id })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => console.error('Report error:', err));
}


async function unlockPremium() {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/points/spend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ amount: 50, purpose: 'Unlock premium content' })
  });

  const data = await res.json();
  alert(data.message);
}



async function loadFeed() {
  const feedContainer = document.getElementById('feedContainer');
  const token = localStorage.getItem('token');

  try {
    const response = await fetch('http://localhost:5000/api/feed');
    const feeds = await response.json();

    feeds.forEach(feed => {
      const card = document.createElement('div');
      card.innerHTML = `
        <h3>${feed.title}</h3>
        <p>${feed.preview}</p>
        <small>${feed.source}</small><br>
        <a href="${feed.url}" target="_blank">View</a><br><br>
        <button onclick="saveContent('${feed.id}')">Save</button>
        <button onclick="shareContent('${feed.id}')">Share</button>
        <button onclick="reportContent('${feed.id}')">Report</button>
        <hr/>
      `;
      feedContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading feed:', err);
  }
}

async function saveContent(contentId) {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/feed/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ contentId })
  });
  const data = await res.json();
  alert(data.message);
}

async function shareContent(contentId) {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/feed/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ contentId })
  });
  const data = await res.json();
  alert(data.message);
}

async function reportContent(contentId) {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:5000/api/feed/report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ contentId })
  });
  const data = await res.json();
  alert(data.message);
}

loadFeed();
