🎲 Bingo App
🎯 Descripción General

Este proyecto es una aplicación web interactiva y fácil de usar, diseñada específicamente para gestionar y visualizar partidas de bingo. Es ideal para ser proyectada en una pantalla grande (como un proyector o TV), permitiendo que todos los participantes sigan de cerca los números sorteados de manera clara y visible. Ofrece flexibilidad tanto para el ingreso manual de números como para un sorteo automático tipo "tómbola", e incluye herramientas para corregir errores y configurar la tabla.
✨ Características y Módulos Clave
1. Gestión de Números

    Modo Manual: Permite al usuario ingresar los números uno por uno a medida que son dictados, marcándolos en el tablero.

    Modo Tómbola: Ofrece una funcionalidad de sorteo automático de números aleatorios, acompañada de una animación visual para una experiencia más dinámica.

    Visualización de Últimos Números: Muestra claramente el último número sorteado y el número anterior, facilitando el seguimiento del juego.

2. Interacción con el Tablero

    Tablero Dinámico: Un tablero de bingo que se actualiza en tiempo real, resaltando visualmente los números a medida que son ingresados o sorteados. El tamaño de las celdas está optimizado para una alta visibilidad en pantallas grandes.

    Búsqueda de Números: Permite buscar rápidamente si un número específico ya ha sido sorteado y lo resalta temporalmente en el tablero para su fácil ubicación.

    Corrección de Errores: Incluye una opción para "desmarcar" un número que haya sido ingresado o sorteado por error en el modo manual, permitiendo corregir el estado del tablero.

3. Configuración y Usabilidad

    Configuración Personalizable: A través de un menú de configuración (accesible mediante un icono de tuerca), se puede ajustar el número máximo de la tabla de bingo (ej. de 1 a 150), adaptándose a diferentes variantes del juego.

    Diseño Responsivo: La interfaz está diseñada para adaptarse y funcionar correctamente en una amplia gama de dispositivos y tamaños de pantalla, desde móviles hasta proyectores y televisores.

    Notificaciones Interactivas: Utiliza "toasts" (notificaciones emergentes) para mensajes de éxito, advertencia o error. Estas notificaciones se pueden cerrar haciendo clic en ellas o mediante un botón "X" dedicado.

    Control de Dropdown Mejorado: El menú de configuración se cierra automáticamente al detectar un clic fuera de su área, mejorando la experiencia de usuario.

🛠️ Tecnologías Utilizadas

Este proyecto fue construido utilizando las siguientes tecnologías modernas para asegurar un desarrollo eficiente y un rendimiento óptimo:

    Frontend:

        Vite: Un bundler de próxima generación que proporciona un entorno de desarrollo frontend extremadamente rápido.

        TypeScript: Un superset de JavaScript que añade tipado estático, lo que mejora la calidad del código, la detección de errores y la mantenibilidad.

        Tailwind CSS: Un framework CSS utilitario que permite construir diseños personalizados directamente en el HTML, fomentando un desarrollo ágil y responsivo.

        Font Awesome: Una popular biblioteca de iconos vectoriales escalables, utilizada para los elementos visuales de la interfaz.

        SweetAlert2: Una librería para crear alertas y modales personalizables, atractivos e interactivos, utilizada para las notificaciones "toast".

🚀 Instalación y Configuración (para desarrolladores)

Para poner este proyecto en funcionamiento en tu entorno local, sigue los pasos a continuación:
Prerrequisitos

Asegúrate de tener Node.js (que incluye npm) instalado en tu sistema.
Pasos

    Clonar el repositorio:

    git clone git@github.com:JaviMejias/bingo.git
    cd bingo

    Nota: Si tienes problemas con SSH, puedes usar HTTPS:

    git clone https://github.com/JaviMejias/bingo.git
    cd bingo

    Instalar dependencias:

    npm install
    # o si usas yarn
    # yarn install

    Ejecutar la aplicación en modo desarrollo:

    npm run dev
    # o si usas yarn
    # yarn dev

    Esto iniciará un servidor de desarrollo y abrirá la aplicación en tu navegador predeterminado (generalmente en http://localhost:5173/).

    Construir para producción (opcional):
    Si deseas generar una versión optimizada de la aplicación para despliegue, ejecuta:

    npm run build
    # o si usas yarn
    # yarn build

    Esto creará los archivos de producción estáticos en la carpeta dist/.

👨‍💻 Autor

    Javier Mejías (Tu Perfil de LinkedIn) - Desarrollador Full-Stack
