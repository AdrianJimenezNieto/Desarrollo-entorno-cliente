import { data } from "../data/products.js";
// -------------- SERVICIO PARA OBTENER LOS DATOS DEL JSON ---------------------

export const getProductsList = async () => {
  try {
    // Simulamos una respuesta http real
    const response = data;

    if(!response) {
      throw new Error('No se pudo cargar el catálogo de productos.');
    }

    // Limpiamos la data
    const cleanData = data.map((p) => ({
      name: p.title,
      price: p.price,
      image: p.image
    }));
    
    return cleanData; // La devolvemos
  } catch (error) {
    console.error(error.message);
    // Mostramos el error en el dom
    throw error; // UI maneja el renderizado de errores
  }
};