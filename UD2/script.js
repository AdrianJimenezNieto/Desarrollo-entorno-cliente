//------------------------- VARIABLES GOLABALES --------------------------------
// Defino el contenido que se renderizará en el main en un objeto
// cada objeto contiene el HTML que se renderizará
const pages = {
  home: `
    <h1>Bienvenido a FakeStore</h1>
    <p>Puedes decirnos qué productos quieres o elegir uno de nuestros propios productos</p>
  `,
  customProducts: `
    <div class="custom-product-container">
      <div id="prompt-products">
        <button onclick="askForCustomProduct()">Añadir mediante prompt()</button>
      </div>
      <div class="add-product-form" id="product-form">
        <input type="text" id="name" class="customProductInput" placeholder="Nombre" />
        <input type="number" step="0.01" id="price" class="customProductInput" placeholder="Precio (€)" />
        <input type="number" step="1" id="quantity" class="customProductInput" placeholder="Cantidad" />
        <button>Guardar</button>
      </div>
    </div>
  `,
  ourProducts: `
    <p>Nuestros productos</p>
  `,
  shoppingCart: `
    <p>Carrito compra</p>
  `,
};

// -------------------------------- RUTAS SPA ----------------------------------
const mainContent = document.getElementById("app-content");
const links = document.querySelectorAll(".nav-link");

// Función para renderizar el HTML en el main
const loadPage = (page) => {
  // Buscamos el contenido en el objeto 'pages', si no existe, error 404
  const html = pages[page] || "<h1>Error 404<h1><p>Página no encontrada</p>";
  mainContent.innerHTML = html;
};

// Asignamos los eventos a los clicks con un forEach()
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // Evitamos el comportamiento por defecto del click al anchor
    const target = link.getAttribute("data-target"); // Leemos lo que hay en data-target
    loadPage(target); // Llamamos a la función del renderizado
  });
});

// Cargamos la página por defecto al cargar la web
loadPage("home");

// --------------------- AÑADIR PRODUCTOS PERSONALIZADO ------------------------

const askForCustomProduct = () => {
  // Buscamos los elementos del DOM necesarios
  const container = document.getElementById('prompt-products');

  if (container) container.innerHTML = ''; // Quito el botón que estaba en el div

  try {
    // VALIDACIONES
    if (!container) throw new Error("Error interno: No se encontró el contenedor de productos.");

    // Pedimos la cantidad de productos diferentes a añadir
    const input = prompt('¿Cuántos productos diferentes quieres añadir al carrito?');

    // Validamos el cancel del prompt
    if (input === null) {
      // Vuelvo a renderizar el boton que estaba en el div y salgo
      container.innerHTML = '<button onclick="askForCustomProduct()">Añadir mediante prompt()</button>';
      return;
    }

    const nOfProducts = parseInt(input);

    // Validamos el número
    if (isNaN(nOfProducts) || nOfProducts < 1) {
      throw new Error("Debes introducr un número entero mayor a 0.")
    }
    if (nOfProducts > 20) {
      throw new Error("¡Demasiados productos! El máximo es 20.")
    }

    // SI LLEGAMOS AQUÍ TODO CORRECTO
    // Creo un array de largo como tantos productos diferentes a añadir y hago
    // .join('') para no mostrar las comas en el HTML
    const formsHTML = Array.from({ length: nOfProducts}, () => `
      <div class="prompt-add-product-form">
        <input type="text" class="input-name" placeholder="Nombre" />
        <input type="number" step="0.01" class="input-price" placeholder="Precio (€)" />
        <input type="number" step="1" class="input-qty" placeholder="Cantidad" />
      </div>
    `).join('');

    // Renderizo el resultado en el contenedor para los formularios
    container.innerHTML = `
      ${formsHTML}
      <button id="save-custom-product-button">Guardar Productos</button>
    `;
    
    // Asignamos el evento al boton
    document.getElementById('save-custom-product-button')
      .addEventListener("click", saveCustomProducts);
  } catch (error) {
    // Traza para la consola
    console.error("Ocurrió un problema: ", error.message);

    // Renderizo el error en el DOM
    showError(error.message);

    // Vuelvo a renderizar el boton que estaba en el div y salgo
    container.innerHTML = '<button onclick="askForCustomProduct()">Añadir mediante prompt()</button>';
  }
};

// Función para obtener la info de los products custom
const saveCustomProducts = () => {
  try {
    // Obtengo todos los divs que tienen formularios de productos
    document.querySelectorAll('.prompt-add-product-form').forEach((row) => {
    const name = row.querySelector('.input-name').value;
    const price = parseFloat(row.querySelector('.input-price').value); // Casting directo
    const quantity = parseFloat(row.querySelector('.input-qty').value); // Casting directo
    // Procesamos los datos
    const product = processProduct(name, price, quantity);
    // Persistimos en el localStorage
    saveProduct(product);

    // Vuelvo a renderizar el botón de añadir mediante prompt si todo ha ido bien
    document.getElementById('prompt-products').innerHTML = '<button onclick="askForCustomProduct()">Añadir mediante prompt()</button>';
  });
  } catch (error) {
    // Traza para la consola
    console.error("Ocurrió un problema: ", error.message);
    // Renderizo el error en el DOM
    showError(error.message);
  }
  
};

// --------------------------- PROCESAMIENTO PRODUCTOS -------------------------
const processProduct = (name, price, quantity) => {
  const product = {
    name: name.trim(),
    price: price,
    quantity: quantity
  }
  // Validamos el producto con nuestra función de validación
  validateData(product);
  // Devolvemos el producto
  return product;
}

// Función de validación
const validateData = (product) => {
  // Validación de Nombre
  // Longitud mínima 3 caracteres, no puede estar vacio, y tiene que existir
  if (!product.name || product.name.trim() === "" || product.name.length < 3) {
    throw new Error("El nombre es inválido o muy corto");
  }

  // Validación de Precio
  // Tiene que existir y ser positivo
  if(isNaN(product.price) || product.price <= 0) {
    throw new Error("El precio debe ser mayor a 0");
  }

  // Validación de Cantidad
  // Tiene que existir, ser un entero y mayor a 0

  if (isNaN(product.quantity) || product.quantity < 1 || !Number.isInteger(product.quantity)) {
    throw new Error("La cantidad debe ser un entero positivo");
  }
}

// ------------------------------- CARRITO -------------------------------------
// Defino la variable de carrito
// obtengo los datos o del localStorage o creo el carrito vacío
let cart;
try {
  // Intentamos leer el carrito del navegador
  cart = JSON.parse(localStorage.getItem('cart'));
  // Si hemos leido algo, pero no es un array, lanzamos un error
  if (!Array.isArray(cart)) {
    // Esto nos manda directamente al catch
    throw new Error("El carrito no es válido o no existe");
  }
} catch (error) {
  // Renderizo el error en el DOM
  showError(error.message);
  // Creamos el carrito vacío
  console.log('Inicializando carrito nuevo en localStorage...'); // Traza para la consola
  cart = [];
  // Creamos/Sobreescribimos el carrito como un item en el localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}
console.log('Carrito creado'); // Traza para la consola

// Guardar producto
const saveProduct = (product) => {
  // Guardo el producto en el array de carrito
  cart.push(product);
  // Sobreescribo el localStorage con el nuevo array de productos 
  localStorage.setItem('cart', JSON.stringify(cart));
  // Notificacion en el DOM y traza por la consola
  showMessage(`Producto ${product.name} añadido correctamente al carrito.`);
  console.log(`Producto: ${JSON.stringify(product)} añadido correctamente al carrito.`);
};

// ------------------------- MANEJO DE ERRORES ---------------------------------
// Timer para la caja de errores
let errorTimer = null;

// Función para mostrar errores en el DOM
const showError = (message) => {
  const errorBox = document.getElementById("error-container");

  if(!errorBox) return; // Salimos si no se ha creado la caja de errores

  // Si ya había un error en pantalla, lo matamos
  // Evitamos que el error anterior oculte el nuevo
  if (errorTimer) clearTimeout(errorTimer);

  // Renderizamos el texto y lo mostramos
  // TODO: formatear el texto del mensaje a un parrafo
  errorBox.innerText = message;

  // Iniciamos la cuenta regresiva de 5 segundos (tiempo del error en pantalla)
  errorTimer = setTimeout(() => {
    // Limpiamos la caja de errores
    errorBox.innerText = '';
    errorTimer = null; // Limpiamos la variable del contador
  }, 5000); // 5000ms en pantalla
}

// --------------------------- MANEJO MENSAJES ---------------------------------
// Timer para el mensaje
let messageTimer = null;

// Función para mostrar el mensaje en el DOM
const showMessage = (message) => {
  const messageBox = document.getElementById('message-container');

  if(!messageBox) return; // Salimos si no se ha creado la caja

  // Generamos un nuevo div dentro de la caja
  const notification = document.createElement('div');
  // TODO: añadir las clases para hacerlo visible
  notification.innerText = message;

  // Inyectamos el div que acabamos de crear en la caja de notificaciones
  messageBox.appendChild(notification);

  // Destrucción del mensaje de notificación
  setTimeout(() => {
    // TODO: animación de desvanecimiento
    // Esperar a que termine la animación y borrar el elemento del DOM
    // mirar el evento transitioned
    notification.remove();
  }, 5000);
};