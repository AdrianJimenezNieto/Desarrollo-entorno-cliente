/**
 * Módulo de validación de formularios.
 * @module Validator
 */

/**
 * Valida un correo electrónico.
 * @param {string} email - El correo a validar.
 * @returns {boolean} Retorna true si el correo es válido, false en caso contrario.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida una contraseña según criterios de seguridad.
 * Al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
 * @param {string} password - La contraseña a validar.
 * @returns {boolean} Retorna true si cumple los criterios de seguridad.
 */
function isValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

/**
 * Valida un número de teléfono en formato internacional específico (+34 600-123-456).
 * @param {string} phone - El número de teléfono a validar.
 * @returns {boolean} Retorna true si el formato es correcto.
 */
function isValidPhone(phone) {
    const phoneRegex = /^\+34 \d{3}-\d{3}-\d{3}$/;
    return phoneRegex.test(phone);
}

// Exportación para Jest (entorno Node) sin romper el navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { isValidEmail, isValidPassword, isValidPhone };
}