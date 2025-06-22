const boxList = document.getElementById('box-list');
const boxForm = document.getElementById('box-form');
const itemList = document.getElementById('item-list');
const itemForm = document.getElementById('item-form');
const boxTitle = document.getElementById('box-title');
const searchForm = document.getElementById('search-form');
const searchResults = document.getElementById('search-results');
const editItemModalEl = document.getElementById('editItemModal');
const editItemForm = document.getElementById('edit-item-form');
const saveEditBtn = document.getElementById('save-edit');
let editModal;

let currentBoxId = null;
let currentEditItemId = null;

if (editItemModalEl) {
  editModal = new bootstrap.Modal(editItemModalEl);
}

async function fetchBoxes() {
  const res = await fetch('/boxes');
  const boxes = await res.json();
  renderBoxes(boxes);
}

function renderBoxes(boxes) {
  boxList.innerHTML = '';
  boxes.forEach(box => {
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center box-entry';
    a.dataset.id = box.id;

    const span = document.createElement('span');
    span.textContent = `Box ${box.number}`;
    a.appendChild(span);

    if (box.photo_filename) {
      const img = document.createElement('img');
      img.src = `/photos/${box.photo_filename}`;
      img.className = 'thumb';
      a.appendChild(img);
    }

    const del = document.createElement('button');
    del.className = 'btn btn-sm btn-link text-danger delete-box';
    del.textContent = 'Delete';
    del.dataset.id = box.id;
    a.appendChild(del);

    boxList.appendChild(a);
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
  if (e.target.classList.contains('delete-box')) {
    e.preventDefault();
    const id = e.target.dataset.id;
    await fetch(`/boxes/${id}`, { method: 'DELETE' });
    if (String(currentBoxId) === id) {
      currentBoxId = null;
      itemForm.classList.add('d-none');
      itemList.innerHTML = '';
      boxTitle.textContent = '';
      document.getElementById('box-detail').classList.add('d-none');
    }
    fetchBoxes();
    return;
  }

  const entry = e.target.closest('.box-entry');
  if (!entry) return;
  const id = entry.dataset.id;
  const res = await fetch(`/boxes/${id}`);
  const box = await res.json();
  currentBoxId = id;
  boxTitle.textContent = `Box ${box.number} - ${box.description || ''}`;
  itemForm.classList.remove('d-none');
  document.getElementById('box-detail').classList.remove('d-none');
  renderItems(box.items);
});

function renderItems(items) {
  itemList.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'list-group-item item-entry d-flex justify-content-between align-items-start';

    const left = document.createElement('div');
    left.className = 'd-flex align-items-start';

    if (item.photo_url) {
      const img = document.createElement('img');
      img.src = item.photo_url;
      img.className = 'preview me-2';
      left.appendChild(img);
    }

    const info = document.createElement('div');
    info.innerHTML = `<div class="fw-bold">${item.name}</div><div>${item.note || ''}</div>`;
    left.appendChild(info);

    div.appendChild(left);

    const btnGroup = document.createElement('div');
    const del = document.createElement('button');
    del.className = 'btn btn-sm btn-link text-danger delete-item';
    del.textContent = 'Delete';
    del.dataset.id = item.id;
    btnGroup.appendChild(del);

    const edit = document.createElement('button');
    edit.className = 'btn btn-sm btn-link edit-item';
    edit.textContent = 'Edit';
    edit.dataset.id = item.id;
    btnGroup.appendChild(edit);

    div.appendChild(btnGroup);

    itemList.appendChild(div);
  });
}

itemList.addEventListener('click', async e => {
  if (e.target.classList.contains('delete-item')) {
    e.preventDefault();
    const itemId = e.target.dataset.id;
    await fetch(`/items/${itemId}`, { method: 'DELETE' });
    loadCurrentBox();
    return;
  }

  if (e.target.classList.contains('edit-item')) {
    e.preventDefault();
    currentEditItemId = e.target.dataset.id;
    editItemForm.reset();
    editModal.show();
  }
});

saveEditBtn.addEventListener('click', async () => {
  if (!currentEditItemId) return;
  const data = new FormData(editItemForm);
  await fetch(`/items/${currentEditItemId}`, { method: 'PUT', body: data });
  editModal.hide();
  loadCurrentBox();
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
    li.className = 'list-group-item';
    li.textContent = `${item.name} (Box ${item.box_id}) - ${item.note || ''}`;
    searchResults.appendChild(li);
  });
});

fetchBoxes();
