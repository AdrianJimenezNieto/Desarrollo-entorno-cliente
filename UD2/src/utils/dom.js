// Helper para crear elementos del DOM
export const createElement = (tag, { classes= [], text = '', id = ''} = {}) => {
  // Esta función sirve para crear elementos del DOM reciviendo por parámetros
  // el tipo de elemento que queremos crear (tag) y un objeto con los atributos del elemento
  const element = document.createElement(tag);
  if (classes.length) element.classList.add(...classes); // hago uso del spread operator para añadir las classes
  if (id) element.id = id;
  if (text) element.textContent = text;
  return element; // Retorno el elemento del DOM
}