// --- INICIO DE LA CONEXIÓN ---

// Se invoca la función io(), que fue provista por el script '/socket.io/socket.io.js'.
// Esto establece la conexión WebSocket con el servidor. El objeto 'socket' representa esta conexión.
const socket = io();


// --- SELECCIÓN DE ELEMENTOS DEL DOM ---

// Se obtienen referencias a los elementos HTML con los que se va a interactuar, usando sus IDs.
const createForm = document.getElementById('create-form'); // El formulario para crear productos.
const deleteForm = document.getElementById('delete-form'); // El formulario para eliminar productos.
const productsList = document.getElementById('products-list'); // La lista <ul> donde se muestran los productos.


// --- MANEJO DEL FORMULARIO DE CREACIÓN ---

// Se agrega un 'listener' que se activa cuando se intenta enviar el formulario de creación.
createForm.addEventListener('submit', (e) => {
  // Se previene el comportamiento por defecto del formulario, que es recargar la página.
  e.preventDefault();
  
  // Se crea un objeto FormData para capturar fácilmente todos los datos del formulario.
  const formData = new FormData(createForm);
  
  // Se construye un objeto 'product' con los datos del formulario.
  const product = {
    title: formData.get('title'),
    description: formData.get('description'),
    price: Number(formData.get('price')), // Se convierte a número, ya que los inputs devuelven strings.
    code: formData.get('code'),
    stock: Number(formData.get('stock')),
    // Se agregan valores por defecto que el ProductManager necesita pero que no están en el formulario.
    thumbnail: 'sin-imagen.jpg', 
    status: true
  };
  
  // Se emite un evento 'createProduct' al servidor a través del socket, enviando el objeto del nuevo producto.
  socket.emit('createProduct', product);
  
  // Se resetean los campos del formulario para que quede limpio para el próximo uso.
  createForm.reset();
});


// --- MANEJO DEL FORMULARIO DE ELIMINACIÓN ---

// Se agrega un 'listener' para el envío del formulario de eliminación.
deleteForm.addEventListener('submit', (e) => {
  // Se previene la recarga de la página.
  e.preventDefault();
  
  // Se capturan los datos del formulario.
  const formData = new FormData(deleteForm);
  // Se obtiene el ID del producto y se convierte a número.
  const productId = Number(formData.get('id'));
  
  // Se emite un evento 'deleteProduct' al servidor, enviando solo el ID del producto a eliminar.
  socket.emit('deleteProduct', productId);
  
  // Se resetea el formulario.
  deleteForm.reset();
});


// --- ESCUCHA DE ACTUALIZACIONES DESDE EL SERVIDOR ---

// Se define un 'listener' para el evento 'updateProducts'. Este evento lo envía el servidor
// cada vez que la lista de productos cambia (ya sea por una creación o una eliminación).
socket.on('updateProducts', (products) => {
  // 'products' es el array actualizado de productos que envía el servidor.
  
  // Se vacía completamente el contenido HTML de la lista actual para limpiarla.
  productsList.innerHTML = '';
  
  // Se itera sobre el nuevo array de productos.
  products.forEach(product => {
    // Por cada producto, se crea un nuevo elemento de lista <li> en memoria.
    const li = document.createElement('li');
    // Se establece el contenido de texto del <li> con los datos del producto.
    li.textContent = `${product.title} (ID: ${product.id}) - $${product.price}`;
    // Se añade el nuevo <li> como hijo de la lista <ul> en el DOM, haciéndolo visible.
    productsList.appendChild(li);
  });
});