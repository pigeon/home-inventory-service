const boxList = document.getElementById('box-list');
const boxForm = document.getElementById('box-form');
const searchForm = document.getElementById('search-form');
const searchResults = document.getElementById('search-results');

async function fetchBoxes() {
  const res = await fetch('/boxes');
  const boxes = await res.json();
  renderBoxes(boxes);
}

function renderBoxes(boxes) {
  boxList.innerHTML = '';
  boxes.forEach(box => {
    const div = document.createElement('div');
    div.className = 'box';
    div.innerHTML = `<h3>Box ${box.number}</h3>
      <p>${box.description || ''}</p>
      <button data-id="${box.id}" class="load-items">Load Items</button>
      <button data-id="${box.id}" class="edit-box">Edit</button>
      <button data-id="${box.id}" class="delete-box">Delete</button>
      <div class="items" id="items-${box.id}"></div>
      <form data-id="${box.id}" class="item-form" enctype="multipart/form-data">
        <input type="text" name="name" placeholder="Item name" required>
        <input type="text" name="note" placeholder="Note">
        <input type="file" name="photo" accept="image/*">
        <button type="submit">Add Item</button>
      </form>`;
    boxList.appendChild(div);
  });
}

boxForm.addEventListener('submit', async e => {
  e.preventDefault();
  const data = new FormData(boxForm);
  await fetch('/boxes', { method: 'POST', body: data });
  boxForm.reset();
  fetchBoxes();
});

boxList.addEventListener('click', async e => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains('delete-box')) {
    await fetch(`/boxes/${id}`, { method: 'DELETE' });
    fetchBoxes();
  }
  if (e.target.classList.contains('edit-box')) {
    const number = prompt('Box number:');
    const description = prompt('Description:');
    await fetch(`/boxes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number, description })
    });
    fetchBoxes();
  }
  if (e.target.classList.contains('load-items')) {
    const res = await fetch(`/boxes/${id}`);
    const box = await res.json();
    renderItems(id, box.items);
  }
});

boxList.addEventListener('submit', async e => {
  if (e.target.classList.contains('item-form')) {
    e.preventDefault();
    const id = e.target.dataset.id;
    const data = new FormData(e.target);
    await fetch(`/boxes/${id}/items`, { method: 'POST', body: data });
    e.target.reset();
    const res = await fetch(`/boxes/${id}`);
    const box = await res.json();
    renderItems(id, box.items);
  }
});

function renderItems(boxId, items) {
  const container = document.getElementById(`items-${boxId}`);
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML = `<strong>${item.name}</strong> ${item.note || ''}
      ${item.photo_url ? `<img class="preview" src="${item.photo_url}"/>` : ''}
      <button data-id="${item.id}" data-box="${boxId}" class="edit-item">Edit</button>
      <button data-id="${item.id}" data-box="${boxId}" class="delete-item">Delete</button>`;
    container.appendChild(div);
  });
}

boxList.addEventListener('click', async e => {
  const itemId = e.target.dataset.id;
  const boxId = e.target.dataset.box;
  if (e.target.classList.contains('delete-item')) {
    await fetch(`/items/${itemId}`, { method: 'DELETE' });
    const res = await fetch(`/boxes/${boxId}`);
    const box = await res.json();
    renderItems(boxId, box.items);
  }
  if (e.target.classList.contains('edit-item')) {
    const name = prompt('Item name:');
    const note = prompt('Note:');
    const form = new FormData();
    if (name) form.append('name', name);
    if (note) form.append('note', note);
    await fetch(`/items/${itemId}`, { method: 'PUT', body: form });
    const res = await fetch(`/boxes/${boxId}`);
    const box = await res.json();
    renderItems(boxId, box.items);
  }
});

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const q = new URLSearchParams(new FormData(searchForm)).toString();
  const res = await fetch(`/search?${q}`);
  const items = await res.json();
  searchResults.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} (${item.box_id}) - ${item.note || ''}`;
    searchResults.appendChild(li);
  });
});

fetchBoxes();
