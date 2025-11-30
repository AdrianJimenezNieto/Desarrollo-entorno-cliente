import { createElement } from "../utils/dom.js";
import { showError } from "../utils/ui.js";
import { saveProduct } from "../services/storage.js";

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
export const renderPromptButton = (container) => {
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
export const renderCustomProductPage = () => {
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