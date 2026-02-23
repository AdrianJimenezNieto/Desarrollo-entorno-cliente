// Importamos los métodos desde el archivo de lógica
const {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  filterProducts,
  getTotalInventoryValue,
  _setProducts
} = require('./productManager');

describe('Administración de Inventario - Caso Práctico 1', () => {

  // Antes de cada test, reseteamos el array para no arrastrar estado
  beforeEach(() => {
    _setProducts([
      { id: 1, name: "Test Product A", price: 10, quantity: 2 },
      { id: 2, name: "Test Product B", price: 5, quantity: 5 }
    ]);
  });

  // 1. Pruebas de Lectura
  test('Debe devolver todos los productos actuales', () => {
    const products = getProducts();
    expect(products.length).toBe(2);
    expect(products[0].name).toBe("Test Product A");
  });

  // 2. Pruebas de Agregación
  test('Debe agregar un nuevo producto correctamente', () => {
    const newProduct = addProduct("Test Product C", 20.5, 10);

    expect(newProduct).toBeDefined();
    expect(newProduct.id).toBe(3); // El max era 2
    expect(newProduct.name).toBe("Test Product C");

    const products = getProducts();
    expect(products.length).toBe(3);
  });

  // 3. Pruebas de Eliminación
  test('Debe eliminar un producto por su id', () => {
    const success = deleteProduct(1);

    expect(success).toBe(true);
    const products = getProducts();
    expect(products.length).toBe(1);
    expect(products[0].id).toBe(2); // Queda el id 2
  });

  test('Debe retornar false si se intenta borrar un id que no existe', () => {
    const success = deleteProduct(999);
    expect(success).toBe(false);
    expect(getProducts().length).toBe(2);
  });

  // 4. Pruebas de Actualización
  test('Debe actualizar los datos de un producto correctamente', () => {
    const updated = updateProduct(1, { name: "Updated Product A", price: 15, quantity: 3 });

    expect(updated).not.toBeNull();
    expect(updated.name).toBe("Updated Product A");
    expect(updated.price).toBe(15);
    expect(updated.quantity).toBe(3);
  });

  // 5. Pruebas de Filtrado
  test('Debe filtrar productos ignorando mayusculas y respetando substring', () => {
    const results = filterProducts("test product b");
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(2);
  });

  test('Debe devolver todos los arrays si el query esta vacio', () => {
    const results = filterProducts("   ");
    expect(results.length).toBe(2);
  });

  // 6. Pruebas de Agregación Total (.reduce)
  test('Debe calcular el valor total del inventario correctamente', () => {
    // (10 * 2) = 20 + (5 * 5) = 25 -> Total 45
    const total = getTotalInventoryValue();
    expect(total).toBe(45);
  });

});
