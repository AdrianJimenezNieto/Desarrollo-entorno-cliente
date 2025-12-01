import { renderCustomProductPage } from "./features/customProducts.js";
import { renderOurProducts } from "./features/ourProducts.js";
import { renderShoppingCart } from "./features/shoppingCart.js";
import { renderHomePage } from "./features/homePage.js";

// -------------------------------- RUTAS --------------------------------------

export const pages = {
  // PAGINA HOME
  home: renderHomePage, // Retorna el string

  // PAGINA CUSTOM PRODUCTS
  customProducts: renderCustomProductPage, // Render de productos personalizados

  // PAGINA PRODUCTOS PREDETERMINADOS
  ourProducts: renderOurProducts, // Render de nuestros productos

  // PAGINA DEL CARRITO
  shoppingCart: renderShoppingCart // Render del carrito
};
