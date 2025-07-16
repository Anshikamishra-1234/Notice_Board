let editingId = null;

document.getElementById('noticeForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const content = document.getElementById('content').value;
  const category = document.getElementById('category').value;
  const password = document.getElementById('password').value;

  const noticeData = { content, category, password };

  const url = editingId ? `/api/notices/${editingId}` : '/api/notices';
  const method = editingId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password
    },
    body: JSON.stringify(noticeData)
  });

  if (res.ok) {
    document.getElementById('noticeForm').reset();
    editingId = null;
    loadNotices();
  } else {
    alert('❌ Incorrect password or failed to save.');
  }
});

async function deleteNotice(id) {
  const password = prompt('Enter admin password to delete:');
  if (!password) return;

  const res = await fetch(`/api/notices/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-password': password }
  });

  if (res.status === 204) {
    loadNotices();
  } else {
    alert('❌ Delete failed.');
  }
}

function editNotice(notice) {
  document.getElementById('content').value = notice.content;
  document.getElementById('category').value = notice.category;
  editingId = notice._id;
}

async function loadNotices() {
  const res = await fetch('/api/notices');
  const notices = await res.json();
  const container = document.getElementById('notices');
  container.innerHTML = '';

  notices.forEach(notice => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p><strong>${notice.category}</strong></p>
      <p>${notice.content}</p>
      <button onclick='editNotice(${JSON.stringify(notice)})'>✏️ Edit</button>
      <button onclick='deleteNotice("${notice._id}")'>🗑 Delete</button>
      <hr>
    `;
    container.appendChild(div);
  });
}

loadNotices();
