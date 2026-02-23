/**
 * @file app.js
 * @description Lógica para la manipulación del DOM e integración con productManager.js.
 * Implementa una tabla dinámica y funciones de búsqueda para el inventario.
 *
 * INSTRUCCIONES DE EJECUCIÓN(Para el profesor / a):
 * 1. Uso normal: Abrir el archivo `index.html` directamente en el navegador.No requiere servidor.
 * 2. Visualización Online: Se puede ejecutar directamente en GitHub Pages a través del enlace: https://adrianjimeneznieto.github.io/Desarrollo-entorno-cliente/UD4/
 * 3. Instalación de dependencias para los tests: Abrir una terminal en esta carpeta(UD4) y ejecutar`npm install`.
 * 4. Ejecución de Tests Unitarios(Jest): Ejecutar en la terminal el comando`npm test`.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Referencias al DOM
  const productForm = document.getElementById("productForm");
  const productNameInput = document.getElementById("productName");
  const productPriceInput = document.getElementById("productPrice");
  const productQuantityInput = document.getElementById("productQuantity");
  const productIdInput = document.getElementById("productId");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnCancel = document.getElementById("btnCancel");
  const totalValueSpan = document.getElementById("totalValue");
  const productTableBody = document.getElementById("productTableBody");
  const searchInput = document.getElementById("searchInput");
  const formTitle = document.getElementById("formTitle");

  /**
   * Vuelve a renderizar toda la tabla HTML de productos.
   * Utiliza .map() nativo de productManager u obtiene la lista formateada.
   * @param {Array} productsToRender - Matriz de objetos de producto.
   */
  const renderTable = (productsToRender = getProducts()) => {
    // Limpiamos la tabla
    productTableBody.innerHTML = "";

    if (productsToRender.length === 0) {
      productTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center empty-state">No se encontraron productos.</td>
                </tr>
            `;
      updateTotal();
      return;
    }

    // Iteramos para crear las filas
    productsToRender.forEach(product => {
      const tr = document.createElement("tr");

      // Subtotal
      const subtotal = (product.price * product.quantity).toFixed(2);

      tr.innerHTML = `
                <td>#${product.id}</td>
                <td><strong>${product.name}</strong></td>
                <td class="price-col">${product.price.toFixed(2)}</td>
                <td>${product.quantity} u.</td>
                <td class="price-col">${subtotal} €</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-edit" data-id="${product.id}">Editar</button>
                        <button class="btn btn-sm btn-delete" data-id="${product.id}">Eliminar</button>
                    </div>
                </td>
            `;

      productTableBody.appendChild(tr);
    });

    // Añadimos event listeners a los botones generados
    attachTableEvents();
    // Actualizamos estadística total
    updateTotal();
  };

  /**
   * Actualiza el valor total agregado en la interfaz.
   */
  const updateTotal = () => {
    const total = getTotalInventoryValue();
    totalValueSpan.textContent = `${total.toFixed(2)} €`;
  };

  /**
   * Añade eventos de clic a los botones generados dinámicamente de Editar y Eliminar.
   */
  const attachTableEvents = () => {
    // Botones de eliminación
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"), 10);
        if (confirm(`¿Estás seguro de que quieres eliminar el producto #${id}?`)) {
          deleteProduct(id);
          // Re-renderizamos con la lista base o manteniendo el filtro
          handleSearch();
        }
      });
    });

    // Botones de edición
    document.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"), 10);
        const product = getProducts().find(p => p.id === id);

        if (product) {
          // Llenar formulario con los datos
          productIdInput.value = product.id;
          productNameInput.value = product.name;
          productPriceInput.value = product.price;
          productQuantityInput.value = product.quantity;

          // Cambiar UI del formulario para modo edición
          formTitle.textContent = "Editar Producto";
          btnSubmit.textContent = "Actualizar Cambios";
          btnCancel.classList.remove("hidden");
        }
      });
    });
  };

  /**
   * Resetea el formulario a su estado de "Añadir".
   */
  const resetForm = () => {
    productForm.reset();
    productIdInput.value = "";
    formTitle.textContent = "Añadir Producto";
    btnSubmit.textContent = "Guardar Producto";
    btnCancel.classList.add("hidden");
  };

  /**
   * Maneja el evento de envío para añadir o actualizar.
   */
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const quantity = parseInt(productQuantityInput.value, 10);
    const idToUpdate = parseInt(productIdInput.value, 10);

    if (!name || isNaN(price) || isNaN(quantity)) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    if (idToUpdate) {
      // Modo Actualización
      updateProduct(idToUpdate, { name, price, quantity });
    } else {
      // Modo Nuevo
      addProduct(name, price, quantity);
    }

    // Limpiar y renderizar
    resetForm();
    handleSearch(); // Mantiene el filtro aplicado si lo hubiese
  });

  /**
   * Botón para cancelar la edición
   */
  btnCancel.addEventListener("click", () => {
    resetForm();
  });

  /**
   * Búsqueda dinámica y filtrado.
   */
  const handleSearch = () => {
    const query = searchInput.value;
    const filtered = filterProducts(query);
    renderTable(filtered);
  };

  searchInput.addEventListener("input", handleSearch);

  // Renderizado inicial
  renderTable();
});
