// Declaracion de variables
let contador = 0;
const botonMas = document.getElementById('mas');
const botonMenos = document.getElementById('menos');
const botonReset = document.getElementById('reset');
const numero = document.querySelector('.numero');

// Acciones
botonMas.addEventListener('click', () => {
  // Incremento el contador cuando se pulsa el boton mas
  contador++;
  // Actualizo el texto del span en el DOM
  numero.innerText = contador;
})

botonMenos.addEventListener('click', () => {
  // Decremento el contador cuando se pulsa el boton menos
  contador--;
  // Actualizo el texto del span en el DOM
  numero.innerText = contador;
})

botonReset.addEventListener('click', () => {
  // Reseteo el contador a 0 cuando se pulsa el boton de reset
  contador = 0;
  // Actualizo el texto del span el el DOM
  numero.innerText = contador;
})