// ------------------------- MANEJO DE ERRORES ---------------------------------
// Timer para la caja de errores
let errorTimer = null;

// Función para mostrar errores en el DOM
export const showError = (message) => {
  const errorBox = document.getElementById("error-container");

  if(!errorBox) return; // Salimos si no se ha creado la caja de errores

  // Si ya había un error en pantalla, lo matamos
  // Evitamos que el error anterior oculte el nuevo
  if (errorTimer) clearTimeout(errorTimer);

  // Renderizamos el texto y lo mostramos
  // TODO: formatear el texto del mensaje a un parrafo
  errorBox.innerText = message;

  // Iniciamos la cuenta regresiva de 5 segundos (tiempo del error en pantalla)
  errorTimer = setTimeout(() => {
    // Limpiamos la caja de errores
    errorBox.innerText = '';
    errorTimer = null; // Limpiamos la variable del contador
  }, 5000); // 5000ms en pantalla
}

// --------------------------- MANEJO MENSAJES ---------------------------------
// Timer para el mensaje
let messageTimer = null;

// Función para mostrar el mensaje en el DOM
export const showMessage = (message) => {
  const messageBox = document.getElementById('message-container');

  if(!messageBox) return; // Salimos si no se ha creado la caja

  // Generamos un nuevo div dentro de la caja
  const notification = document.createElement('div');
  // TODO: añadir las clases para hacerlo visible
  notification.innerText = message;

  // Inyectamos el div que acabamos de crear en la caja de notificaciones
  messageBox.appendChild(notification);

  // Destrucción del mensaje de notificación
  setTimeout(() => {
    // TODO: animación de desvanecimiento
    // Esperar a que termine la animación y borrar el elemento del DOM
    // mirar el evento transitioned
    notification.remove();
  }, 5000);
};