import { showError, showMessage } from "../utils/ui.js";

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
export const saveProduct = (product) => {
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
export const getCart = () => {
  // Devolvemos el carrito
  return [...cart];
}

// Borrar un item del carrito
export const removeFromCart = (index) => {
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
export const getCartTotal = () => {
  // usamos reduce para sumar arrays
  return cart.reduce((total, product) => total + (product.price * product.quantity), 0);
};

// Función para limpiar el carrito
export const clearCart = () => {
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
}