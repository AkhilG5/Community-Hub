document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('feedContainer');
  
    try {
      const res = await fetch('http://localhost:5000/api/feed/reddit');
      const posts = await res.json();
  
      posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'content-card';
  
        card.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.preview}</p>
          <a href="${post.url}" target="_blank">Read more</a>
          <br/>
          <button onclick="saveContent('${post.url}')">Save</button>
          <button onclick="shareContent('${post.url}')">Share</button>
          <button onclick="reportContent('${post.url}')">Report</button>
        `;
  
        container.appendChild(card);
      });
    } catch (error) {
      console.error('Failed to load feed:', error);
      container.innerHTML = '<p>Error loading feed</p>';
    }
  });
  
  // Button actions (to implement)
  function saveContent(url) {
    alert(`Saved: ${url}`);
    // TODO: Send save request to backend
  }
  
  function shareContent(url) {
    navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
  }
  
  function reportContent(url) {
    alert(`Reported: ${url}`);
    // TODO: Send report to backend
  }
  