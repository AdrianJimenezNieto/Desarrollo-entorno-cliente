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
  errorBox.innerText = message;
  errorBox.classList.add('active');

  // Iniciamos la cuenta regresiva de 5 segundos (tiempo del error en pantalla)
  errorTimer = setTimeout(() => {
    // Quitamos la clase active
    errorBox.classList.remove('active');
    // Limpiamos la caja de errores
    errorBox.innerText = '';
    errorTimer = null; // Limpiamos la variable del contador
  }, 5000); // 5000ms en pantalla
}

// --------------------------- MANEJO MENSAJES ---------------------------------

// Función para mostrar el mensaje en el DOM
export const showMessage = (message) => {
  const messageBox = document.getElementById('message-container');

  if(!messageBox) return; // Salimos si no se ha creado la caja

  // Generamos un nuevo div dentro de la caja
  messageBox.innerText = message;
  messageBox.classList.add('active'); // Clase de activacion

  // Destrucción del mensaje de notificación
  setTimeout(() => {
    messageBox.classList.remove('active');
    // Limpiamos la caja de notificaciones
    messageBox.innerText = '';
  }, 5000);
};