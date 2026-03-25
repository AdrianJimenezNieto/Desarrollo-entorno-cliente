const { isValidEmail, isValidPassword, isValidPhone } = require('./validator');

describe('Validación de Formulario - Expresiones Regulares', () => {
    
    // Pruebas para Email
    describe('isValidEmail', () => {
        test('Debería aceptar correos válidos', () => {
            expect(isValidEmail('usuario@dominio.com')).toBe(true);
            expect(isValidEmail('nombre.apellido@empresa.es')).toBe(true);
        });

        test('Debería rechazar correos inválidos', () => {
            expect(isValidEmail('usuariodominio.com')).toBe(false);
            expect(isValidEmail('usuario@dominio')).toBe(false);
            expect(isValidEmail('@dominio.com')).toBe(false);
        });
    });

    // Pruebas para Contraseña
    describe('isValidPassword', () => {
        test('Debería aceptar contraseñas que cumplan todos los requisitos', () => {
            expect(isValidPassword('Segura123!')).toBe(true);
            expect(isValidPassword('P@ssw0rdPro')).toBe(true);
        });

        test('Debería rechazar contraseñas débiles', () => {
            expect(isValidPassword('segura123!')).toBe(false); // Falta mayúscula
            expect(isValidPassword('SEGURA123!')).toBe(false); // Falta minúscula
            expect(isValidPassword('Seguraaa!')).toBe(false);  // Falta número
            expect(isValidPassword('Segura123')).toBe(false);  // Falta carácter especial
            expect(isValidPassword('Se1!')).toBe(false);       // Menos de 8 caracteres
        });
    });

    // Pruebas para Teléfono
    describe('isValidPhone', () => {
        test('Debería aceptar el formato +34 600-123-456', () => {
            expect(isValidPhone('+34 600-123-456')).toBe(true);
            expect(isValidPhone('+34 712-345-678')).toBe(true);
        });

        test('Debería rechazar formatos incorrectos', () => {
            expect(isValidPhone('600123456')).toBe(false); // Sin prefijo ni guiones
            expect(isValidPhone('+34 600123456')).toBe(false); // Sin guiones
            expect(isValidPhone('+33 600-123-456')).toBe(false); // Prefijo incorrecto
        });
    });
});