Backend E-commerce Básico con API REST y WebSockets
Este proyecto es un servidor de backend desarrollado con Node.js y Express.js, diseñado para gestionar productos y carritos de compra para una aplicación de e-commerce. Implementa una API REST completa, persistencia de datos a través del sistema de archivos y funcionalidades en tiempo real utilizando WebSockets.

Características Principales ✨
API RESTful: Endpoints para la gestión completa (CRUD) de productos y carritos.

Persistencia Local: La información se almacena en archivos products.json y carts.json.

Motor de Plantillas: Utiliza Handlebars.js para renderizar vistas del lado del servidor.

Tiempo Real: Integra Socket.io para actualizar la lista de productos en tiempo real sin necesidad de recargar la página.

Instalación 🔧
Sigue estos pasos para levantar el proyecto en tu entorno local.

Clonar el Repositorio
Abre tu terminal y clona el repositorio desde GitHub:

Bash

git clone https://github.com/germansz10/ecommerce.git
cd ecommerce
Instalar Dependencias
El proyecto utiliza Node.js. Asegúrate de tenerlo instalado. Luego, instala las dependencias necesarias:

Bash

npm install
Uso ▶️
Para iniciar el servidor, ejecuta el siguiente comando en la terminal. El servidor se iniciará en http://localhost:8080.

Bash

npm start
o

Bash

node server.js
Una vez iniciado, verás el mensaje Servidor escuchando en el puerto 8080 en tu consola.

Endpoints de la API
Puedes probar todos los endpoints usando un cliente de API como Postman o Insomnia.

Productos (/api/products)
Método	Ruta	Descripción	Body (Ejemplo para POST/PUT)
GET	/	Obtiene la lista completa de productos.	N/A
GET	/:pid	Obtiene un producto por su ID.	N/A
POST	/	Crea un nuevo producto.	{ "title": "Producto Nuevo", "price": 1234, "code": "PN001", "stock": 50, ... }
PUT	/:pid	Actualiza uno o más campos de un producto.	{ "price": 1500, "stock": 45 }
DELETE	/:pid	Elimina un producto por su ID.	N/A

Exportar a Hojas de cálculo
Carritos (/api/carts)
Método	Ruta	Descripción
POST	/	Crea un nuevo carrito de compras vacío.
GET	/:cid	Obtiene los productos dentro de un carrito por su ID.
POST	/:cid/product/:pid	Agrega un producto a un carrito. Si ya existe, incrementa su cantidad.

Exportar a Hojas de cálculo
Vistas con Handlebars y WebSockets
El proyecto también incluye vistas renderizadas del lado del servidor.

Vista Principal (Estática)
URL: http://localhost:8080/

Descripción: Muestra una lista simple de todos los productos disponibles. Fue creada para cumplir con los requisitos iniciales de tener una vista básica renderizada por el servidor.

Vista en Tiempo Real
URL: http://localhost:8080/realtimeproducts

Descripción: Esta página es un panel de control interactivo que muestra la lista de productos y permite agregar o eliminar artículos en tiempo real usando WebSockets.

Funcionalidad:

Formularios: Usa los formularios en la página para crear o eliminar productos. La lista se actualizará automáticamente para todos los clientes conectados.

Sincronización con API: Si creas o eliminas un producto a través de los endpoints de la API (/api/products), esta vista también se actualizará al instante. Para probarlo, abre esta página en tu navegador y usa Postman para enviar una petición POST o DELETE.