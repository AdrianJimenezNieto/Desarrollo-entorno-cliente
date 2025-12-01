// -------------------------------- RUTAS --------------------------------------

const pages = {
  // PAGINA HOME
  home: () => `
    <h1>Bienvenido a FakeStore</h1>
    <p>Puedes decirnos qué productos quieres o elegir uno de nuestros propios productos</p>
  `, // Retorna el string

  // PAGINA CUSTOM PRODUCTS
  customProducts: renderCustomProductPage, // Render de productos personalizados

  // PAGINA PRODUCTOS PREDETERMINADOS
  ourProducts: renderOurProducts, // Render de nuestros productos

  // PAGINA DEL CARRITO
  shoppingCart: renderShoppingCart // Render del carrito
};

// ------------------------------- HELPER CREACION DOM -------------------------
// Helper para crear elementos del DOM
const createElement = (tag, { classes= [], text = '', id = ''} = {}) => {
  // Esta función sirve para crear elementos del DOM reciviendo por parámetros
  // el tipo de elemento que queremos crear (tag) y un objeto con los atributos del elemento
  const element = document.createElement(tag);
  if (classes.length) element.classList.add(...classes); // hago uso del spread operator para añadir las classes
  if (id) element.id = id;
  if (text) element.textContent = text;
  return element; // Retorno el elemento del DOM
}

// ------------------------- ELEMENTOS DE UI -----------------------------------
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
    // Borrar el elemento del DOM
    // mirar el evento transitioned
    notification.remove();
  }, 5000);
};

// -------------- SERVICIO PARA OBTENER LOS DATOS DEL JSON ---------------------

const getProductsList = () => {
  try {
    // Simulamos una respuesta http real
    const response = data;

    if(!response) {
      throw new Error('No se pudo cargar el catálogo de productos.');
    }

    // Limpiamos la data
    const cleanData = data.map((p) => ({
      name: p.title,
      price: p.price,
      image: p.image
    }));
    
    return cleanData; // La devolvemos
  } catch (error) {
    console.error(error.message);
    // Mostramos el error en el dom
    throw error; // UI maneja el renderizado de errores
  }
};

// ------------------------------- SERVICIO CARRITO ----------------------------
// Defino la variable de carrito
// obtengo los datos o del localStorage o creo el carrito vacío
let cart;

// Inicialización
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
  // Lo paso por el procesador de productos
  product = processProduct(product.name, product.price, product.quantity);
  // Guardo el producto en el array de carrito
  cart.push(product);
  // Sobreescribo el localStorage con el nuevo array de productos 
  localStorage.setItem('cart', JSON.stringify(cart));
  // Notificacion en el DOM y traza por la consola
  showMessage(`Producto ${product.name} añadido correctamente al carrito.`);
  console.log(`Producto: ${JSON.stringify(product)} añadido correctamente al carrito.`);
};

// Devolver Carrito
const getCart = () => {
  // Devolvemos el carrito
  return [...cart];
}

// Borrar un item del carrito
const removeFromCart = (index) => {
  // Elimino el elemento del carrito
  // .splice(posicion, cuántos borrar)
  cart.splice(index, 1);

  // Actualizamos el localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  // Lo mostramos por pantalla y traza en la consola
  console.log("Artículo eliminado del carrito. Carrito actualizado.");
  showMessage("Producto eliminado del carrito.")
}

// Helper para calcular el total de cada artículo
const getCartTotal = () => {
  // usamos reduce para sumar arrays
  return cart.reduce((total, product) => total + (product.price * product.quantity), 0);
};

// Función para limpiar el carrito
const clearCart = () => {
  cart = []; // Array vacío
  localStorage.setItem('cart', JSON.stringify(cart)); // Persistencia en localStorage
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
};

// --------------------- AÑADIR PRODUCTOS PERSONALIZADO ------------------------

// FUNCIONES INTERNAS
const renderForm = (container, nOfProducts) => {
  container.innerHTML = ''; // Limpiamos el botón del handler

  // Bucle para crear los input
  for (let i = 0; i < nOfProducts; i++) {
    const row = createElement('div', { classes: ['prompt-add-product-form']});
    // Creamos los input
    row.innerHTML = `
      <input type="text" class="input-name" placeholder="Nombre" />
      <input type="number" step="0.01" class="input-price" placeholder="Precio (€)" />
      <input type="number" step="1" class="input-qty" placeholder="Cantidad" />
    `;
    container.appendChild(row);
  }

  // Botón de guardar los productos
  const saveBtn = createElement('button',{
    id: 'save-custom-product-button',
    text: 'Guardar Productos'
  });

  // Añado el evento al botón
  // Le mando el container como argumento para poder renderizar el botton del handler de nuevo
  saveBtn.addEventListener('click', () => saveCustomProducts(container));
  
  // Añado el botón al contenedor 
  container.appendChild(saveBtn);
}

const handlePromptLogic = (container) => {
  try {
    const input = prompt("¿Cuántos productos diferentes quieres añadir?");

    // Cancel del input
    if (input === null) return;

    const nOfProducts = parseInt(input); // Casting del resultado del input

    // Validaciones del campo
    // Tiene que ser un entero positivo menor a 10
    if (isNaN(nOfProducts) || nOfProducts < 1) throw new Error("Debes introducr un número entero mayor a 0.");
    if (nOfProducts > 10) throw new Error("¡Demasiados productos! El máximo es 10.");

    // SI LLEGAMOS AQUÍ TODO CORRECTO
    // Renderizamos el formulario
    renderForm(container, nOfProducts);
  } catch (error) {
    // Traza para la consola
    console.error("Ocurrió un problema: ", error.message);
    // Renderizo el error en el DOM
    showError(error.message);
    // Vuelvo a renderizar el boton que estaba en el div y salgo
    renderPromptButton(container);
  }
};

// Función para guardar la lista de productos por prompt
const saveCustomProducts = (container) => {
  try {
    // Obtengo todos los divs que tienen formularios de productos
    document.querySelectorAll('.prompt-add-product-form').forEach((row) => {
      const name = row.querySelector('.input-name').value;
      const price = parseFloat(row.querySelector('.input-price').value); // Casting directo
      const quantity = parseFloat(row.querySelector('.input-qty').value); // Casting directo
      // Procesamos los datos
      const product = {
        name: name,
        price: price,
        quantity: quantity
      }
      // Persistimos en el localStorage
      saveProduct(product);
      row.remove(); // Elimino la fila del input si se ha guardado satisfactoriamente
    });
    // Vuelvo a renderizar el botón de añadir mediante prompt si todo ha ido bien
    renderPromptButton(container);
  } catch (error) {
    // Traza para la consola
    console.error("Ocurrió un problema: ", error.message);
    // Renderizo el error en el DOM
    showError(error.message);
  }
  
};

// Función para guardar UN SOLO producto custom
const saveCustomProduct = (container) => {
  try {
    // Obtengo los input
    const nameInput = container.querySelector('.input-name');
    const priceInput = container.querySelector('.input-price');
    const quantityInput = container.querySelector('.input-qty');
  
    // Procesamos los datos
    const product = processProduct(nameInput.value, parseFloat(priceInput.value), parseFloat(quantityInput.value));
  
    // Persistimos en el localStorage
    saveProduct(product);
  
    // Limpiamos los input
    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';
  } catch (error) {
    console.error(error.message);
    // Renderizo el error por pantalla
    showError(error.message);
  }
}

// FUNCIONES EXTERNAS
// Función para renderizar el botón de añadir productos mediante prompt
const renderPromptButton = (container) => {
  container.innerHTML = ''; // Limpiamos lo que haya

  const btn = createElement('button', {
    id: 'add-prompt-button',
    text: 'Añadir mediante prompt()'
  })

  // Asignamos directamente el botón al contenedor
  btn.addEventListener('click', () => handlePromptLogic(container));

  container.appendChild(btn);
}

// Función que devuelve el contenido de la página
const renderCustomProductPage = () => {
  // Estructura base
    const wrapper = createElement('div', {
      classes: ['custom-product-container']
    });

    const promptContainer = createElement('div', { id: 'prompt-products'});
    const manualContainer = createElement('div', { classes: ['add-one-product']})

    // Inicializamos el botón de prompt
    renderPromptButton(promptContainer);

    // Mostramos el resto de la sección (formulario manual)
    manualContainer.innerHTML = `
      <div class="add-product-form" id="add-product-form">
        <input type="text" id="name" class="input-name" placeholder="Nombre" />
        <input type="number" step="0.01" id="price" class="input-price" placeholder="Precio (€)" />
        <input type="number" step="1" id="quantity" class="input-qty" placeholder="Cantidad" />
        </div>
        <button id="save-custom-product">Guardar</button>
      </div>
    `;
    
    // Evento del boton manual
    manualContainer.querySelector('#save-custom-product')
      .addEventListener('click', () => saveCustomProduct(manualContainer));

    // Metemos todo en el wrapper
    wrapper.appendChild(promptContainer);
    wrapper.appendChild(manualContainer);

    return wrapper; // Devolvemos el wrapper
};

// -------------------------- LOGICA PAGINA NUESTROS PRODUCTOS -----------------

// Función para renderizar la pagina
const renderOurProducts = () => {
  // Estructura base
  const wrapper = createElement('div', {
    classes: ['our-products-container']
  });
  const title = createElement('h2', {
    text: 'Nuestros Productos'
  });

  const productListContainer = createElement('div', {
    classes: ['product-list'],
    text: 'Cargando catálogo...' // Estado inicial
  });
  
  // Añado el titulo y la lista de productos
  wrapper.appendChild(title);
  wrapper.appendChild(productListContainer);

  // Lógica de carga de datos (se ejecuta después de devolver el wrapper por ser asíncrona)
  loadAndRenderProducts(productListContainer);

  return wrapper;
};

// Función auxiliar asíncrona para manejar la lógica
const loadAndRenderProducts = async (container) => {
  try {
    // Llamamos al servicio
    const products = await getProductsList();

    // Limpiamos el mensaje de cargando...
    container.innerHTML = '';

    if (products.length === 0) {
      container.innerHTML = '<p>No hay productos disponibles.</p>';
      return; // Salimos
    }

    // Pintamos cada tarjeta de producto
    products.forEach(product => {
      const card = createProductCard(product);
      container.appendChild(card);
    });
  } catch (error) {
    // Mostramos el error en el DOM
    showError('Error cargando los productos. Inténtalo más tarde.');
    container.innerHTML = '<p>No se pudo cargar el catálogo.</p>'; // HTML predefinido cuando no se puedan cargar productos
  }
};

// Función para crear cada tarjeta individual
const createProductCard = (product) => {
  // Creamos el elmento del dom
  const card = createElement('div', { classes: ['product-card'] });

  // Usamos innerHTML para la estructura interna de la tarjeta
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-img">
    <div class="product-info">
      <h3>${product.name}</h3>
      <p class="price">${product.price} €</p>
    </div>
  `;

  // Botón para añadir al carrito
  const btn = createElement('button', {
    text: 'Añadir al Carrito'
  });
  // Añadimos el evento al boton
  btn.addEventListener('click', () => {
    // Adaptamos el formato del JSON al formato de nuestro carrito
    saveProduct({
      name: product.name,
      price: product.price,
      quantity: 1 // Por defecto 1 unidad
    });
  });

  // Añado el boton a la tarjeta
  card.appendChild(btn);
  return card; // Devuelvo el elemento de la tarjeta
};

// ------------------------ LOGICA PAGINA CARRITO ------------------------------
// Elemento donde pintamos la tabla dinámica
let listContainer = null;

const renderShoppingCart = () => {
  // Estructura base
  const wrapper = createElement('div', { classes: ['cart-container'] });
  const title = createElement('h2', { text: 'Tu carrito de la compra' });

  // Contenedor dinámico de la lista
  listContainer = createElement('div', { id: 'cart-list-wrapper' });

  // Botón para vaciar el carrito
  const clearBtn = createElement('button', {
    text: 'Vaciar Carrito',
    classes: ['btn-clear-cart']
  });

  // Añadimos el evento al botón
  clearBtn.addEventListener('click', () => {
    if(confirm('¿Seguro que desea vaciar el carrito?')) {
      clearCart();
      refreshCartUI(); // Función para refrescar la vista en tiempo real
      showMessage("Carrito vaciado");
    }
  });

  // Añado todos los elementos al wrapper
  wrapper.appendChild(title);
  wrapper.appendChild(listContainer);
  wrapper.appendChild(clearBtn);

  // Pintamos los datos iniciales
  refreshCartUI();

  return wrapper;
};

// Lógica de Renderizado Dinámico
const refreshCartUI = () => {
  // Limpiamos lo que había antes
  listContainer.innerHTML = '';

  const cart = getCart(); // Pedimos los datos refrescados al servicio

  // Carrito vacio
  if (cart.length === 0) {
    listContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>';
    return; // Salimos
  }

  // Carrito con productos
  const table = document.createElement('table',{ classes: ['cart-table']});

  // Cabecera de la tabla
  table.innerHTML = `
    <thead>
      <tr>
        <th>Producto</th>
        <th>Precio</th>
        <th>Cant.</th>
        <th>Total</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody id="cart-body"></tbody>
  `;

  // Cuerpo de la tabla
  const tbody = table.querySelector('#cart-body');

  // Rellenamos las filas y vamos mostrando por consola
  cart.forEach((product, index) => {
    const row = document.createElement('tr');
    const subtotal = (product.price * product.quantity).toFixed(2); // Calculamos y formateamos con dos decimales
    console.log(`Producto: ${product.name} | Cantidad: ${product.quantity} | Total de este producto: ${subtotal}`);

    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price}€</td>
      <td>${product.quantity}</td>
      <td>${subtotal}€</td>
      <td></td>
    `;
    
    // Botón de eliminar el producto
    const deleteBtn = createElement('button', {text: '🗑️', classes: ['btn-delete']});

    // Añadimos el evento
    deleteBtn.addEventListener('click', () => {
      removeFromCart(index); // Eliminamos con el indice
      refreshCartUI(); // Refrescamos la vista
      showMessage("Producto eliminado del carrito");
    });

    // Añadimos el botón a la ultima celda
    row.lastElementChild.appendChild(deleteBtn);
    tbody.appendChild(row); // Añadimos la fila a la tabla
  });

  // Fila final del TOTAL
  const totalDiv = createElement('div',{
    classes: ['cart-total'],
    text: `TOTAL A PAGAR: ${getCartTotal().toFixed(2)}` // Damos el total formateado a dos decimales
  });

  // Imprimimos por consola el total
  console.log(`Total del carrito: ${getCartTotal().toFixed(2)}`);

  // Añadimos la tabla y el calculo del total al contenedor
  listContainer.appendChild(table);
  listContainer.appendChild(totalDiv);
  
};


// ---------------------------- MAIN DE LA WEB ---------------------------------
const mainContent = document.getElementById("app-content");
const links = document.querySelectorAll(".nav-link");

// Renderizado de la página
const loadPage = (pageKey) => {
  const contentGenerator = pages[pageKey];

  if (!contentGenerator) { // Devolvemos un 404 si no se encuentra la pagina
    mainContent.innerHTML = "<h1>Error 404</h1>";
    return;
  }

  // Ejecutamos la función de la página que queremos cargar
  const content = contentGenerator();

  mainContent.innerHTML = ''; // Limpiamos el main

  if (typeof content === 'string') {
    // Si la página devolvio texto, usamos innerHTML
    mainContent.innerHTML = content;
  } else {
    // Si en vez de eso devuelve un NODO, como en customProducts(), usamos appendChild
    mainContent.appendChild(content);
  }
}

// Asignamos los eventos a los clicks con un forEach() (listeners globales)
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // Evitamos el comportamiento por defecto del click al anchor
    const target = link.getAttribute("data-target"); // Leemos lo que hay en data-target
    loadPage(target); // Llamamos a la función del renderizado
  });
});

// Cargamos la página por defecto al cargar la web
loadPage("home");
