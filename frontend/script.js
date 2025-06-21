const boxList = document.getElementById('box-list');
const boxForm = document.getElementById('box-form');
const itemList = document.getElementById('item-list');
const itemForm = document.getElementById('item-form');
const boxTitle = document.getElementById('box-title');
const searchForm = document.getElementById('search-form');
const searchResults = document.getElementById('search-results');

let currentBoxId = null;

async function fetchBoxes() {
  const res = await fetch('/boxes');
  const boxes = await res.json();
  renderBoxes(boxes);
}

function renderBoxes(boxes) {
  boxList.innerHTML = '';
  boxes.forEach(box => {
    const div = document.createElement('div');
    div.className = 'box-entry';
    div.dataset.id = box.id;
    const img = box.photo_filename ? `<img class="thumb" src="/photos/${box.photo_filename}"/>` : '';
    div.innerHTML = `${img}<span>Box ${box.number}</span> <button data-id="${box.id}" class="delete-box">Delete</button>`;
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
  const id = e.target.dataset.id || e.target.closest('.box-entry')?.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('delete-box')) {
    await fetch(`/boxes/${id}`, { method: 'DELETE' });
    if (String(currentBoxId) === id) {
      currentBoxId = null;
      itemForm.classList.add('hidden');
      itemList.innerHTML = '';
      boxTitle.textContent = '';
    }
    fetchBoxes();
    return;
  }

  const res = await fetch(`/boxes/${id}`);
  const box = await res.json();
  currentBoxId = id;
  boxTitle.textContent = `Box ${box.number} - ${box.description || ''}`;
  itemForm.dataset.id = id;
  itemForm.classList.remove('hidden');
  renderItems(box.items);
});


function renderItems(items) {
  itemList.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    const img = item.photo_url ? `<img class="preview" src="${item.photo_url}"/>` : '';
    div.innerHTML = `${img}<strong>${item.name}</strong> ${item.note || ''}
      <button data-id="${item.id}" class="edit-item">Edit</button>
      <button data-id="${item.id}" class="delete-item">Delete</button>`;
    itemList.appendChild(div);
  });
}

itemList.addEventListener('click', async e => {
  const itemId = e.target.dataset.id;
  if (!itemId) return;
  if (e.target.classList.contains('delete-item')) {
    await fetch(`/items/${itemId}`, { method: 'DELETE' });
    loadCurrentBox();
  }
  if (e.target.classList.contains('edit-item')) {
    const name = prompt('Item name:');
    const note = prompt('Note:');
    const form = new FormData();
    if (name) form.append('name', name);
    if (note) form.append('note', note);
    await fetch(`/items/${itemId}`, { method: 'PUT', body: form });
    loadCurrentBox();
  }
});

itemForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentBoxId) return;
  const data = new FormData(itemForm);
  await fetch(`/boxes/${currentBoxId}/items`, { method: 'POST', body: data });
  itemForm.reset();
  loadCurrentBox();
});

async function loadCurrentBox() {
  if (!currentBoxId) return;
  const res = await fetch(`/boxes/${currentBoxId}`);
  const box = await res.json();
  renderItems(box.items);
}

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
