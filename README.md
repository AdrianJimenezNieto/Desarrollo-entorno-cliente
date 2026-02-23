# **Desarrollo Web en Entorno Cliente**

Repositorio dedicado para almacenar y controlar las versiones de los trabajos, casos prácticos y proyectos correspondientes a la asignatura **Desarrollo Web en Entorno Cliente** del ciclo de formación superior **Desarrollo de Aplicaciones Web (DAW)**.

---

## 📚 Estructura del Repositorio

A lo largo del curso se han desarrollado diferentes proyectos separados en "Unidades Didácticas" (UD), abordando desde los conceptos fundamentales de la web corporativa y el DOM hasta la manipulación dinámica del estado, estructuras de datos avanzadas y pruebas unitarias con librerías modernas.

### [Unidad 1 - Fundamentos Web](./UD1/)
Introducción al entorno cliente, enfocada en la maquetación web, la estructura semántica y la inclusión progresiva de CSS y JavaScript base.
👉 **[Ver proyecto UD1 online](https://adrianjimeneznieto.github.io/Desarrollo-entorno-cliente/UD1/)**

### [Unidad 2 - Estructuras y Flujos](./UD2/)
Profundización en JavaScript mediante el uso de estructuras de datos fundamentales, control de flujo (bucles, condicionales) y modularización del código fuente.
👉 **[Ver proyecto UD2 online](https://adrianjimeneznieto.github.io/Desarrollo-entorno-cliente/UD2/)**

### [Unidad 3 - DOM y Asincronía (Sistema de Reservas)](./UD3/)
Creación de un proyecto completamente interactivo (App de Reservas Hoteleras) utilizando manipulación dinámica del **DOM**, renderizado de vistas lógicas, gestión de colisiones de fechas en un calendario custom y preservación de estado a través de la API `LocalStorage`.
👉 **[Ver proyecto UD3 online](https://adrianjimeneznieto.github.io/Desarrollo-entorno-cliente/UD3/)**

### [Unidad 4 - Uso Avanzado de Arrays (Gestor de Inventario)](./UD4/)
Construcción de una herramienta de gestión de inventarios para probar a fondo el funcionamiento interno y procesamiento estructurado y paramétrico de **Arrays**. Incluye el uso intensivo de métodos funcionales (*map, filter, reduce*), abstracción estricta en el controlador independiente del DOM, y un ecosistema de Integración Contínua básica a través de Pruebas Unitarias (**Jest**) y empaquetamiento con **Node+NPM**.
👉 **[Ver proyecto UD4 online](https://adrianjimeneznieto.github.io/Desarrollo-entorno-cliente/UD4/)**

---

## 🛠 Entorno y Ejecución Global

Todos los ejercicios visuales son desarrollos puros en frontend ("Vanilla JS"), lo cual aboga por la universalidad y simplicidad de revisión:

1. **Uso Sin Compilar:** La inmensa mayoría de carpetas poseen un index.html ejecutable al vuelo.
2. **Uso Empaquetado o Pruebas (Test Driven):** Determinadas unidades (ej: `UD4`), pueden utilizar o requerir dependencias locales instalables. Para ejecutarlas:
   - Necesitas la instalación local de [NodeJS](https://nodejs.org/).
   - Accede dentro de la carpeta pertinente mediante consola y ejecuta el comando `npm install` seguido de `npm test` para visualizar las validaciones lógicas del código desarrollado.
3. **Visor Automático:** Si no deseas interactuar ni descargar nada en local, haz uso de los enlaces expuestos a **GitHub Pages** en el listado de arriba u observando los READMEs propios situados en cada subcarpeta.

> *Este repositorio es puramente académico.*