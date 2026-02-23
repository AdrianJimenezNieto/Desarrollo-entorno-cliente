/**
 * @file productManager.js
 * @description Lógica de negocio central para gestionar el inventario de productos.
 * Utiliza arrays de JavaScript y sus métodos avanzados (.map, .filter, .reduce).
 */

/**
 * Matriz para almacenar todos los objetos de producto.
 * @type {Array<{id: number, name: string, price: number, quantity: number}>}
 */
let products = [
  { id: 1, name: "Manzanas Golden", price: 1.50, quantity: 50 },
  { id: 2, name: "Leche Semidesnatada", price: 0.95, quantity: 120 },
  { id: 3, name: "Aceite de Oliva VE", price: 8.50, quantity: 30 }
];

/**
 * Genera un ID único para los nuevos productos.
 * @returns {number} El ID único generado.
 */
const generateId = () => {
  // Si la matriz está vacía, empieza en 1. De lo contrario, encuentra el ID más alto y suma 1.
  if (products.length === 0) return 1;
  return Math.max(...products.map(p => p.id)) + 1;
};

/**
 * Recupera la lista actual de productos.
 * @returns {Array} La matriz de productos.
 */
const getProducts = () => {
  return products;
};

/**
 * Añade un nuevo producto al inventario.
 * @param {string} name - Nombre del producto.
 * @param {number} price - Precio unitario.
 * @param {number} quantity - Cantidad disponible.
 * @returns {Object} El objeto del producto añadido.
 */
const addProduct = (name, price, quantity) => {
  const newProduct = {
    id: generateId(),
    name,
    price: parseFloat(price),
    quantity: parseInt(quantity, 10)
  };
  products.push(newProduct);
  return newProduct;
};

/**
 * Elimina un producto del inventario por su ID.
 * Utiliza el método .filter() para reasignar la matriz sin el elemento borrado.
 * @param {number} id - El ID del producto a eliminar.
 * @returns {boolean} Verdadero si el producto se eliminó, falso en caso contrario.
 */
const deleteProduct = (id) => {
  const initialLength = products.length;
  // El filtro mantiene solo los elementos donde la condición es verdadera
  products = products.filter(product => product.id !== id);

  return products.length < initialLength;
};

/**
 * Actualiza la información de un producto existente.
 * Utiliza .map() para encontrar y reemplazar el elemento.
 * @param {number} id - El ID del producto.
 * @param {Object} updatedData - Los nuevos datos {name, price, quantity}.
 * @returns {Object|null} El producto actualizado o null si no se encuentra.
 */
const updateProduct = (id, updatedData) => {
  let updatedProduct = null;

  products = products.map(product => {
    if (product.id === id) {
      updatedProduct = {
        ...product,
        name: updatedData.name,
        price: parseFloat(updatedData.price),
        quantity: parseInt(updatedData.quantity, 10)
      };
      return updatedProduct;
    }
    return product;
  });

  return updatedProduct;
};

/**
 * Filtra los productos basándose en una consulta de búsqueda que coincida con el nombre del producto.
 * Utiliza .filter() para encontrar coincidencias parciales.
 * @param {string} query - La cadena de búsqueda.
 * @returns {Array} Matriz de productos coincidentes.
 */
const filterProducts = (query) => {
  if (!query) return products;

  const lowerCaseQuery = query.toLowerCase().trim();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerCaseQuery)
  );
};

/**
 * Calcula el valor monetario total de todos los productos en el inventario.
 * Utiliza el método .reduce() para acumular el valor.
 * @returns {number} El valor total (precio * cantidad de todos los artículos).
 */
const getTotalInventoryValue = () => {
  return products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
};

/**
 * Restablece la matriz de productos (Utilizado principalmente para aislamiento en pruebas).
 * @param {Array} newProducts - Matriz inicial opcional a establecer.
 */
const _setProducts = (newProducts = []) => {
  products = [...newProducts];
};

// Exportar módulos para Node (jest)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getProducts,
    addProduct,
    deleteProduct,
    updateProduct,
    filterProducts,
    getTotalInventoryValue,
    _setProducts // Expuesto solo para restablecer el estado en las pruebas
  };
}
