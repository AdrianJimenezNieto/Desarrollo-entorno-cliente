import { renderCustomProductPage } from "./features/customProducts.js";
import { renderOurProducts } from "./features/ourProducts.js";
import { renderShoppingCart } from "./features/shoppingCart.js";

// -------------------------------- RUTAS --------------------------------------

export const pages = {
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
