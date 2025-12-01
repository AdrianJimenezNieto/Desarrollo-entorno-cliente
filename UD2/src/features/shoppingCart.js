import { createElement } from "../utils/dom.js";
import { getCart,removeFromCart, getCartTotal, clearCart } from "../services/storageService.js";
import { showMessage } from "../utils/ui.js";
// ------------------------ LOGICA PAGINA CARRITO ------------------------------
// Elemento donde pintamos la tabla dinámica
let listContainer = null;

export const renderShoppingCart = () => {
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
  
}