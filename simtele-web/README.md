# SIMTELE-WEB — Panel educativo de prevención y monitoreo

Proyecto académico de Programación Web I. Es una simulación educativa; no utiliza datos reales ni representa límites operativos de Mi Teleférico.

## Estructura
- `index.html`: estructura semántica y formularios.
- `css/styles.css`: diseño visual adaptable.
- `js/app.js`: lógica, validaciones, eventos y manipulación del DOM.

## Cómo ejecutar
1. Descomprime la carpeta.
2. Abre `index.html` en un navegador.
3. Para editar, abre la carpeta completa en Visual Studio Code.

## Módulos
1. **Detención de emergencia:** calcula `d = (v / 3.6) × t`. Umbral ficticio: 30 m.
2. **Mantenimiento:** permite agregar, visualizar y eliminar componentes. Utiliza arreglo de objetos, `push()` y `splice()`.
3. **Viento y oscilación:** registra cinco valores y calcula promedio, máximo y clasificación didáctica.
4. **Sensores:** valida códigos con `/^SEN-\d{3}$/`, comprueba lecturas y permite eliminar registros.

## Pruebas sugeridas
- Detención: velocidad `72`, reacción `3` → `60.00 m`.
- Mantenimiento: agrega dos componentes, elimina uno y verifica que quede una fila.
- Viento: `10`, `20`, `30`, `40`, `50` → promedio `30`, máximo `50`.
- Sensores: `SEN-001` debe ser válido; `SEN-1` y código vacío deben mostrar error.

## Publicar en GitHub Pages
1. Crea un repositorio público en GitHub.
2. Sube `index.html`, `css/`, `js/` y este `README.md`.
3. En el repositorio entra a **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona `main` y `/ (root)`, guarda y espera la URL pública.

## Personalización de imágenes
Las imágenes panorámicas se declaran en el arreglo `heroImages`, al inicio de `js/app.js`. Reemplaza las URLs por fotografías autorizadas que quieras utilizar.
