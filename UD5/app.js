document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.getElementById('loader');
    const successMessage = document.getElementById('successMessage');

    /**
     * Comprueba si todos los campos del formulario son válidos
     * para habilitar o deshabilitar el botón de envío.
     */
    const checkFormValidity = () => {
        // Verifica si todos los inputs tienen la clase 'is-valid'
        const allValid = Array.from(inputs).every(input => input.classList.contains('is-valid'));
        submitBtn.disabled = !allValid;
    };

    /**
     * Valida un input específico en tiempo real y aplica clases CSS.
     * @param {HTMLInputElement} input - El campo de entrada a validar.
     */
    const validateInput = (input) => {
        let isValid = false;
        const value = input.value.trim();

        if (value !== '') {
            switch (input.id) {
                case 'name':
                    isValid = value.length > 2;
                    break;
                case 'email':
                    isValid = isValidEmail(value); // Función de validator.js
                    break;
                case 'phone':
                    isValid = isValidPhone(value); // Función de validator.js
                    break;
                case 'password':
                    isValid = isValidPassword(value); // Función de validator.js
                    break;
            }
        }

        // Retroalimentación visual interactiva
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }

        // Comprobar el estado general del formulario tras validar este campo
        checkFormValidity();
    };

    // Asignación de eventos a cada input
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        
        // Limpiar estilos si el usuario vacía el campo mientras escribe
        input.addEventListener('blur', () => {
            if(input.value.trim() === '') {
                input.classList.remove('is-invalid', 'is-valid');
                checkFormValidity();
            }
        });
    });

    // Gestión del envío (Submit asíncrono)
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        // 1. Mostrar estado de carga (Loader)
        submitBtn.disabled = true;
        btnText.textContent = 'Enviando...';
        loader.style.display = 'block';
        successMessage.style.display = 'none';

        try {
            // 2. Simular la petición Fetch (retardo de 2 segundos)
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            
            // 3. Éxito: Limpiar formulario y mostrar mensaje
            form.reset();
            inputs.forEach(i => i.classList.remove('is-valid', 'is-invalid'));
            checkFormValidity(); // Vuelve a bloquear el botón
            
            successMessage.style.display = 'block';
            
            // Ocultar mensaje de éxito tras 5 segundos
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            console.error("Error al procesar la inscripción", error);
            alert("Hubo un error al enviar el formulario. Inténtalo de nuevo.");
        } finally {
            // 4. Restaurar el botón sin importar el resultado
            btnText.textContent = 'Completar Inscripción';
            loader.style.display = 'none';
        }
    });
});