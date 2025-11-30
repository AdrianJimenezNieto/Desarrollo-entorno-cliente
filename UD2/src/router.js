import { renderCustomProductPage } from "./features/customProducts.js";

// -------------------------------- RENDERIZADO --------------------------------

export const pages = {
  // PAGINA HOME
  home: () => `
    <h1>Bienvenido a FakeStore</h1>
    <p>Puedes decirnos qué productos quieres o elegir uno de nuestros propios productos</p>
  `, // Retorna el string

  // PAGINA CUSTOM PRODUCTS
  customProducts: renderCustomProductPage,

  // PAGINA PRODUCTOS PREDETERMINADOS
  ourProducts: () => `<p>Productos predeterminados</p>`,

  // PAGINA DEL CARRITO
  cart: () => `<p>Pagina del carrito</p>`
};
