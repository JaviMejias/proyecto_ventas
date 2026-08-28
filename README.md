# GestiónFood

Sistema web de gestión de pedidos y ventas para locales gastronómicos, ferias y eventos. Reúne en una sola aplicación la administración de la carta, un punto de venta rápido, el seguimiento de pedidos en cocina y los cierres de caja por usuario o globales.

El proyecto está construido como una SPA instalable: React se encarga de la experiencia de uso y consume una API de Ruby on Rails, mientras Action Cable mantiene el tablero de pedidos actualizado en tiempo real.

## Qué demuestra el proyecto

- Un flujo de negocio completo, desde la configuración de productos hasta el cierre de caja.
- Una SPA responsive conectada a una API REST autenticada mediante sesiones de Devise.
- Pedidos en tiempo real mediante WebSockets y Action Cable.
- Modelado de ventas con productos, cantidades y agregados asociados.
- Reportes descargables en Excel y comprobantes de cierre en PDF.
- Una interfaz adaptable con PWA, modo claro/oscuro y temas de color persistentes.
- Entornos de desarrollo y producción preparados con Docker, PostgreSQL y Nginx.

## Funcionalidades

### Usuarios y acceso

- Registro con nombre, apellido, correo y contraseña.
- Inicio y cierre de sesión con Devise.
- Rutas privadas en el frontend y validación de sesión contra la API.
- Asociación de cada venta y cierre personal con el usuario que lo registró.

### Carta y agregados

- Creación, edición y eliminación de platos.
- Precio y cantidad máxima de agregados configurable por plato.
- Catálogo independiente de agregados.
- Activación o pausa temporal de platos y agregados sin eliminarlos.
- Protección del historial: un plato o agregado que ya participa en ventas no se elimina si la base conserva relaciones asociadas.
- Solo los elementos activos aparecen disponibles en el punto de venta.

### Punto de venta

- Registro del nombre del cliente y método de pago: efectivo, tarjeta o transferencia.
- Pedidos con uno o varios productos y cantidades independientes.
- Selección de agregados respetando el máximo definido para cada plato.
- Resumen del pedido y total calculado en tiempo real.
- Los agregados representan opciones del plato; el precio se calcula con el precio del plato multiplicado por su cantidad.

### Pedidos y cocina en tiempo real

- Estados de pedido: `recibido`, `en_proceso`, `listo` y `entregado`.
- Tableros para pedidos pendientes, listos, entregados y todos.
- Orden FIFO para las vistas operativas de pendientes y listos.
- Detalle de cada venta con sus platos, cantidades y agregados.
- Historial paginado con carga infinita.
- Nuevos pedidos y cambios de estado propagados por Action Cable.
- Aviso visual y sonido al recibir un pedido nuevo.

### Cierres de caja y reportes

- Vista previa de las ventas que todavía no pertenecen a un cierre.
- Cierre personal para las ventas del usuario actual.
- Cierre global para consolidar las ventas abiertas de todos los usuarios.
- Desglose esperado por efectivo, tarjeta y transferencia.
- Ingreso de montos declarados para visualizar faltantes, sobrantes o un cuadre exacto antes de confirmar.
- Historial de cierres, detalle de sus ventas y responsable del cierre.
- Exportación de las ventas del mes actual y del historial de cierres a Excel.
- Generación desde el navegador de un comprobante de cierre en PDF.

### Experiencia de uso

- Diseño responsive con navegación lateral en escritorio y barra inferior en móviles.
- Aplicación instalable como PWA con actualización automática del service worker.
- Tema claro, oscuro o sincronizado con el sistema.
- Cinco colores de acento configurables y persistidos en el navegador.
- Animaciones, estados vacíos, skeletons de carga, alertas y confirmaciones.
- Formato monetario y fechas adaptados a `es-CL`.

## Flujo principal

```text
Configurar carta y agregados
            ↓
Registrar pedido en el punto de venta
            ↓
Recibido → En proceso → Listo → Entregado
            ↓
Revisar ventas abiertas por método de pago
            ↓
Crear cierre personal o global
            ↓
Consultar historial y exportar reportes
```

## Arquitectura

```text
┌──────────────────────────────────────────┐
│ React + TypeScript + Vite                │
│ SPA responsive · PWA · reportes PDF     │
└──────────────────┬───────────────────────┘
                   │ JSON / sesión HTTP
                   │ WebSocket / Action Cable
┌──────────────────▼───────────────────────┐
│ Ruby on Rails                            │
│ API REST · Devise · reglas de negocio   │
└──────────────────┬───────────────────────┘
                   │ Active Record
┌──────────────────▼───────────────────────┐
│ PostgreSQL                               │
│ usuarios · carta · ventas · cierres     │
└──────────────────────────────────────────┘
```

En producción, Nginx sirve el frontend compilado y actúa como reverse proxy para `/api`, `/users` y `/cable`. Así, la SPA, la autenticación, la API y los WebSockets quedan disponibles desde un mismo origen.

### Modelo de datos

- `User`: cuenta autenticada; posee ventas y cierres de caja.
- `MenuItem`: plato con nombre, precio, disponibilidad y máximo de agregados.
- `Addon`: agregado reutilizable y activable.
- `Sell`: venta con cliente, medio de pago, estado, total, usuario y cierre opcional.
- `SellMaterial`: línea de venta que conserva plato, cantidad, precio y subtotal.
- `SellMaterialAddon`: relación entre una línea de venta y sus agregados.
- `CashClose`: agrupa ventas cerradas y sus totales por medio de pago.

## Stack tecnológico

### Frontend

- React 18, TypeScript, Vite 5 y React Router 6.
- Tailwind CSS 4, Framer Motion y Lucide React.
- React Hot Toast y SweetAlert2.
- jsPDF y jsPDF AutoTable.
- Vite PWA Plugin y Action Cable.

### Backend

- Ruby 3.3.5 y Ruby on Rails 8.1.3.
- PostgreSQL y Active Record.
- Devise para autenticación por sesión.
- Kaminari para paginación y caxlsx para reportes Excel.
- Action Cable con adaptador asíncrono en desarrollo y PostgreSQL en producción.

### Infraestructura y calidad

- Docker, Docker Compose y Nginx.
- Minitest, pruebas de sistema con Capybara y soporte para RSpec.
- RuboCop, Brakeman, ESLint, Prettier, Vitest y Husky.

## API principal

Todas las rutas de negocio requieren una sesión autenticada.

| Recurso | Operaciones |
| --- | --- |
| `/api/v1/menu_items` | Listar, crear, editar y eliminar platos |
| `/api/v1/addons` | Listar, crear, editar y eliminar agregados |
| `/api/v1/sells` | Listar, crear, consultar detalle y cambiar estado |
| `/api/v1/sells/export_excel` | Descargar ventas en XLSX |
| `/api/v1/cash_closes` | Listar, crear y consultar cierres |
| `/api/v1/cash_closes/preview` | Previsualizar cierre personal o global |
| `/api/v1/cash_closes/export_excel` | Descargar cierres en XLSX |
| `/api/v1/auth/me` | Consultar el usuario de la sesión actual |
| `/cable` | Canal WebSocket de pedidos |

## Puesta en marcha local

### Requisitos

- Ruby 3.3.5 y Bundler.
- PostgreSQL.
- Node.js 20 o compatible y npm.

### 1. Clonar el repositorio

```bash
git clone git@github.com:JaviMejias/proyecto_ventas.git
cd proyecto_ventas
```

### 2. Configurar la base de datos

| Variable | Valor predeterminado |
| --- | --- |
| `DATABASE_HOST` | `localhost` |
| `DATABASE_USERNAME` | `postgres` |
| `DATABASE_PASSWORD` | `postgres` |
| Base de desarrollo | `proyecto_ventas_development` |

Si tu instalación utiliza otras credenciales, expórtalas antes de preparar la base:

```bash
export DATABASE_HOST=localhost
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=tu_contraseña
```

### 3. Instalar dependencias y preparar la aplicación

```bash
bundle install
npm install
npm install --prefix frontend
bin/rails db:prepare
```

`db/seeds.rb` no crea usuarios ni datos de demostración. La primera cuenta se crea desde `/register`.

### 4. Iniciar backend y frontend

Para iniciar Rails, Vite y el watcher de Tailwind en un solo comando:

```bash
npm run dev
```

También se pueden ejecutar por separado:

```bash
bin/rails server
npm run dev --prefix frontend
```

- Frontend: <http://localhost:5173>
- API Rails: <http://localhost:3000>
- Health check: <http://localhost:3000/up>

La URL HTTP de la API puede cambiarse al iniciar Vite:

```bash
VITE_API_URL=http://localhost:3000 npm run dev --prefix frontend
```

> La configuración actual de Action Cable en desarrollo apunta a `ws://localhost:3002/cable`. Para probar las actualizaciones en vivo fuera de Docker, inicia Rails en el puerto `3002` o ajusta `frontend/src/services/cable.ts` para que coincida con tu puerto local.

## Desarrollo con Docker

```bash
docker compose up --build
```

En otra terminal, prepara la base la primera vez:

```bash
docker compose exec web bin/rails db:prepare
```

- Frontend: <http://localhost:5174>
- Backend: <http://localhost:3002>
- PostgreSQL: `localhost:5432`

> Si el navegador bloquea las peticiones por CORS desde el puerto `5174`, agrega ese origen a `config/initializers/cors.rb` o usa Vite en `5173`, que es el origen habilitado actualmente.

## Producción con Docker Compose

La configuración de producción compila la SPA, la sirve con Nginx y mantiene Rails y PostgreSQL dentro de la red de Docker.

```bash
export SECRET_KEY_BASE='una_clave_larga_y_segura'
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec web bin/rails db:prepare
```

Abre <http://localhost:8082>. Para consultar los logs del backend:

```bash
docker compose -f docker-compose.prod.yml logs --tail 100 -f web
```

En un despliegue real también deben reemplazarse las credenciales predeterminadas de PostgreSQL y configurarse HTTPS para proteger las sesiones y habilitar la instalación PWA de forma segura.

## Pruebas y análisis

```bash
# Backend
bin/rails test
bin/rails test:system
bin/rubocop
bin/brakeman

# Frontend
npm test --prefix frontend
npm run build --prefix frontend
npm run lint --prefix frontend
```

La base de pruebas existente es inicial y varios archivos conservan casos pendientes o generados como plantilla; ampliar la cobertura de los flujos de venta, estados y cierres es una línea natural de evolución.

## Estructura del repositorio

```text
app/
├── channels/              # Actualizaciones de pedidos por Action Cable
├── controllers/api/v1/    # Endpoints JSON
├── models/                # Entidades y relaciones de negocio
├── services/              # Proceso de cierre de caja
└── views/api/v1/          # Plantillas de exportación XLSX
config/                    # Rutas, base de datos, CORS y entornos Rails
db/                        # Migraciones y esquema PostgreSQL
frontend/
├── src/components/        # Componentes de layout, UI y protección de rutas
├── src/contexts/          # Autenticación y personalización visual
├── src/pages/             # Carta, POS, historial, cierres y ajustes
├── src/services/          # Cliente API, WebSockets y PDF
└── vite.config.ts         # React, Tailwind, Vitest y PWA
test/                      # Pruebas Rails y de sistema
docker-compose*.yml        # Entornos de desarrollo y producción
```

## Posibles siguientes pasos

- Añadir roles y permisos para separar administración, caja y cocina.
- Persistir los montos declarados y las diferencias de caja.
- Incorporar filtros por fecha al historial antes de exportar.
- Centralizar la URL HTTP/WebSocket del backend en variables de entorno.
- Ampliar las pruebas automatizadas de reglas de negocio y flujos críticos.
- Sustituir los íconos PWA de ejemplo por recursos definitivos del producto.

## Autor

**Javier Mejías** — Desarrollador Full Stack

[LinkedIn](https://www.linkedin.com/in/javier-mejías-655a7936a) · [GitHub](https://github.com/JaviMejias)
