# 🍜 Sistema de Gestión de Ventas y Pedidos de Comida

Sistema web desarrollado en Ruby on Rails para la gestión de ventas y pedidos de comida, pensado para ferias, eventos o pequeños negocios gastronómicos. Permite administrar menús, ventas, historial y cierres de caja de forma simple y ordenada.

CARACTERÍSTICAS PRINCIPALES

- Administración de platos principales con precios.
- Configuración del máximo de agregados permitidos por plato.
- Gestión de agregados mediante formularios dinámicos.
- Punto de venta con tabla dinámica de pedidos.
- Cálculo automático de precios y totales.
- Registro de cliente y método de pago (efectivo, tarjeta, transferencia).
- Historial de ventas.
- Cierre de caja con conciliación por tipo de pago.

TECNOLOGÍAS UTILIZADAS

Backend:
- Ruby 3.3.5
- Rails 7.2.2
- PostgreSQL

Frontend:
- TailwindCSS (tailwindcss-rails)
- HTML
- JavaScript
- Stimulus

Otros:
- Docker
- Docker Compose
- Git

INSTALACIÓN Y EJECUCIÓN SIN DOCKER

Clonar el repositorio:

git clone git@github.com:JaviMejias/proyecto_ventas.git
cd proyecto_ventas

Instalar dependencias:

bundle install
npm install

IMPORTANTE – Compilar TailwindCSS (obligatorio):

rails tailwindcss:build

Si este comando no se ejecuta, la aplicación fallará al iniciar.

Configurar base de datos:

rails db:create
rails db:migrate

Iniciar la aplicación:

./bin/dev

Acceder desde el navegador:

http://localhost:3000

EJECUCIÓN CON DOCKER

Requisitos:
- Docker
- Docker Compose

Construir las imágenes:

docker compose build

Levantar los contenedores:

docker compose up -d

Entrar al contenedor web:

docker compose exec web bash

Dentro del contenedor ejecutar:

rails tailwindcss:build
rails db:create
rails db:migrate
rails s -b 0.0.0.0

Acceder a la aplicación en:

http://localhost:3000

NOTAS IMPORTANTES

- TailwindCSS no se compila automáticamente en la primera ejecución.
- El comando rails tailwindcss:build es obligatorio:
  - en la primera instalación
  - al cambiar estilos
  - al ejecutar el proyecto en un entorno nuevo
- Docker evita problemas de versiones de Ruby, Node y dependencias del sistema.

AUTOR

Javier Mejías  
Desarrollador Full-Stack  
https://www.linkedin.com/in/javier-mejías-655a7936a
