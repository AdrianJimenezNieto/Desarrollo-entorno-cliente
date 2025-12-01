import { createElement } from "../utils/dom.js";
import { getProductsList } from "../services/productService.js";
import { saveProduct } from "../services/storageService.js";
import { showError } from "../utils/ui.js";

// -------------------------- LOGICA PAGINA NUESTROS PRODUCTOS -----------------

// Variable de los datos fuera de la función por rendimiento
let allProductsCache = [];

// Función para renderizar la pagina
export const renderOurProducts = () => {
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

  try {
    // Cargo los datos
    getProductsList().then(data => {
      allProductsCache = data; // Guardamos en memoria
      pintarProductos(productListContainer, data);
    })
  } catch (error) {
    console.error('No se han podido cargar los productos.')
    showError("No se ha podido cargar la lista de productos.")
  }

  // Barra de búsqueda
  const searchDiv = createElement('div', {classes:['search-bar']})
  // Input de la barra de busqueda
  searchDiv.innerHTML = `<input type="text" placeholder="Buscar..." class="search-input" />`

  // Evento de búsqueda del input
  searchDiv.querySelector('.search-input').addEventListener('input', (e) => {
    // El evento input se dispara cada vez que cambia algo dentro de la barra de búsqueda
    console.log('Buscando...');
    const filter = e.target.value.toLowerCase();
    const filtered = allProductsCache.filter(p => p.name.toLowerCase().includes(filter));
    // Imprimo los productos
    pintarProductos(productListContainer, filtered)
  })
  
  // Añado el titulo y la lista de productos
  wrapper.appendChild(title);
  wrapper.appendChild(searchDiv);
  wrapper.appendChild(productListContainer);

  return wrapper;
};

// Función auxiliar asíncrona para manejar la lógica
const pintarProductos = async (container, data) => {
  try {
    // Limpiamos el mensaje de cargando...
    container.innerHTML = '';

    // Si no hay productos
    if (data.length === 0) {
      container.innerHTML = '<p>No hay productos disponibles.</p>';
      return; // Salimos
    }

    // Pintamos cada tarjeta de todos los productos
    data.forEach(product => {
      const card = createProductCard(product);
      container.appendChild(card);
    });

  } catch (error) {
    console.error(error.message);
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
}