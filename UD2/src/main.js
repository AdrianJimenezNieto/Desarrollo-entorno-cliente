import { pages } from "./router.js";

const mainContent = document.getElementById("app-content");
const links = document.querySelectorAll(".nav-link");

// Renderizado de la página
const loadPage = (pageKey) => {
  const contentGenerator = pages[pageKey];

  if (!contentGenerator) { // Devolvemos un 404 si no se encuentra la pagina
    mainContent.innerHTML = "<h1>Error 404</h1>";
    return;
  }

  // Ejecutamos la función de la página que queremos cargar
  const content = contentGenerator();

  mainContent.innerHTML = ''; // Limpiamos el main

  if (typeof content === 'string') {
    // Si la página devolvio texto, usamos innerHTML
    mainContent.innerHTML = content;
  } else {
    // Si en vez de eso devuelve un NODO, como en customProducts(), usamos appendChild
    mainContent.appendChild(content);
  }
}

// Asignamos los eventos a los clicks con un forEach() (listeners globales)
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // Evitamos el comportamiento por defecto del click al anchor
    const target = link.getAttribute("data-target"); // Leemos lo que hay en data-target
    loadPage(target); // Llamamos a la función del renderizado
  });
});

// Cargamos la página por defecto al cargar la web
loadPage("home");
