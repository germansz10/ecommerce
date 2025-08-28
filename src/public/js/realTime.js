// src/public/js/realTime.js
const socket = io(); // Conectamos con el servidor de sockets

const createForm = document.getElementById('create-form');
const deleteForm = document.getElementById('delete-form');
const productsList = document.getElementById('products-list');

// --- Evento para crear un producto ---
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(createForm);
  const product = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: Number(formData.get('price')),
    code: formData.get('code'),
    stock: Number(formData.get('stock')),
    // Valores por defecto que tu manager necesita
    thumbnail: 'sin-imagen.jpg', 
    status: true
  };
  socket.emit('createProduct', product);
  createForm.reset();
});

// --- Evento para eliminar un producto ---
deleteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(deleteForm);
  const productId = Number(formData.get('id'));
  socket.emit('deleteProduct', productId);
  deleteForm.reset();
});

// --- Escuchamos la lista actualizada de productos ---
socket.on('updateProducts', (products) => {
  // Limpiamos la lista actual
  productsList.innerHTML = '';
  // Renderizamos la nueva lista
  products.forEach(product => {
    const li = document.createElement('li');
    li.textContent = `${product.title} (ID: ${product.id}) - $${product.price}`;
    productsList.appendChild(li);
  });
});