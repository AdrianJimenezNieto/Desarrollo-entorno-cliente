import { createElement } from "../utils/dom.js"

// HOMEPAGE
export const renderHomePage = () => {
  // Estructura base
  const wrapper = createElement('div', {classes: ['home-content']});
  const title = createElement('h1', { text:'Bienvenido a fakestore'});
  const p = createElement('p', {text: 'Puedes decirnos qué productos quieres o elegir uno de nuestros propios productos'});
  
  // Añado el title y el p al contenedor
  wrapper.appendChild(title);
  wrapper.appendChild(p);

  // Devuelvo el contenedor
  return wrapper;
};