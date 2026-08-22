# 🍜 Sistema de Gestión de Ventas y Pedidos de Comida

Sistema web desarrollado con arquitectura moderna (Frontend en React + Vite y Backend en Ruby on Rails API) para la gestión de ventas y pedidos de comida, pensado para ferias, eventos o pequeños negocios gastronómicos. Permite administrar menús, ventas, historial y cierres de caja de forma simple y ordenada. Además, ¡soporta instalación como Aplicación Web Progresiva (PWA)!

## ✨ CARACTERÍSTICAS PRINCIPALES

- **Administración de Platos:** Gestión de platos principales con precios.
- **Gestión de Agregados:** Configuración del máximo de agregados permitidos por plato mediante formularios dinámicos.
- **Punto de Venta Dinámico:** Interfaz ágil en React para tomar pedidos rápidamente.
- **Cálculo Automático:** Precios, totales y cálculo de agregados extra.
- **Registro de Pagos:** Soporte para múltiples métodos de pago (efectivo, tarjeta, transferencia) e información del cliente.
- **Historial de Ventas y Filtros:** Exportación de ventas a Excel.
- **Cierre de Caja:** Conciliación por tipo de pago, cálculo de diferencias, reporte global/personal y exportación a Excel.
- **Soporte PWA (Progressive Web App):** Instalable en dispositivos móviles y de escritorio a pantalla completa (requiere HTTPS en producción).

## 🚀 TECNOLOGÍAS UTILIZADAS

### Frontend (SPA & PWA)
- React 18
- Vite
- TypeScript
- TailwindCSS 4
- Vite PWA Plugin
- React Router DOM
- SweetAlert2 & Hot Toast para alertas

### Backend (API REST & WebSockets)
- Ruby 3.3.5
- Ruby on Rails 8.1 (Modo API)
- PostgreSQL
- ActionCable (WebSockets vía PostgreSQL adapter para notificaciones en vivo)

### Despliegue e Infraestructura
- Docker & Docker Compose
- Nginx (Reverse Proxy)

---

## 💻 DESARROLLO LOCAL (Sin Docker)

### Requisitos

- Ruby 3.3.5 y Bundler
- PostgreSQL
- Node.js y npm

En desarrollo local, Rails se ejecuta en `http://localhost:3000` y Vite en
`http://localhost:5173`.

### 1. Clonar el repositorio

```bash
git clone git@github.com:JaviMejias/proyecto_ventas.git
cd proyecto_ventas
```

### 2. Configurar PostgreSQL

Inicia PostgreSQL:

```bash
sudo systemctl start postgresql
```

La configuración local usa los siguientes valores predeterminados:

- Host: `localhost`
- Usuario: `postgres`
- Contraseña: `postgres`
- Base de datos: `proyecto_ventas_development`

Si tu usuario `postgres` tiene otra contraseña, puedes indicarla mediante una
variable de entorno sin modificar el código:

```bash
export DATABASE_PASSWORD='TU_CONTRASEÑA'
```

También puedes configurar `DATABASE_HOST` y `DATABASE_USERNAME` de la misma
manera si tu instalación utiliza otros valores.

### 3. Configurar e iniciar el backend

```bash
# Instalar gemas
bundle install

# Crear y migrar la base de datos
rails db:create db:migrate db:seed

# Iniciar la API en http://localhost:3000
rails server
```

Puedes comprobar que el backend está disponible visitando
`http://localhost:3000/up`.

### 4. Configurar e iniciar el frontend

Abre otra terminal y ejecuta:

```bash
cd ~/proyecto_ventas/frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Accede a `http://localhost:5173`. En desarrollo, el frontend utiliza
`http://localhost:3000` como URL predeterminada de la API. Puedes reemplazarla
antes de iniciar Vite mediante:

```bash
VITE_API_URL='http://localhost:OTRO_PUERTO' npm run dev
```

### Solución de problemas

#### Error de autenticación de PostgreSQL

Si aparece `password authentication failed for user "postgres"`, la contraseña
de PostgreSQL no coincide con la configuración predeterminada. Define
`DATABASE_PASSWORD` con tu contraseña real y vuelve a ejecutar las tareas de la
base de datos.

#### Error de red o CORS al llamar a la API

Un error con código de estado `(null)` normalmente indica que el backend no está
disponible en el puerto esperado. Verifica primero `http://localhost:3000/up` y
confirma que ejecutaste `rails server`.

El backend permite solicitudes desde `http://localhost:5173`. Si Vite selecciona
otro puerto porque el `5173` está ocupado, libera ese puerto o inicia Vite de
forma explícita:

```bash
npm run dev -- --port 5173
```

### Puertos con Docker Compose en desarrollo

La configuración de `docker-compose.yml` publica servicios en puertos distintos
a los usados directamente en el equipo:

- Backend: `http://localhost:3002`
- Frontend: `http://localhost:5174`
- PostgreSQL: `localhost:5432`

Dentro de Docker, `VITE_API_URL` configura automáticamente el frontend para usar
el backend publicado en el puerto `3002`.

---

## 🐳 DESPLIEGUE EN PRODUCCIÓN (Con Docker)

El proyecto está preparado para desplegarse fácilmente usando Docker Compose con Nginx sirviendo el Frontend compilado y haciendo proxy al Backend.

### Requisitos:
- Docker y Docker Compose instalados.

### Ejecución:
1. Asegúrate de estar en la raíz del proyecto.
2. Levanta los contenedores en segundo plano:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
3. Prepara la base de datos en producción por primera vez (esto creará la base de datos, las tablas y los usuarios por defecto):
```bash
docker compose -f docker-compose.prod.yml exec web bundle exec rails db:create db:migrate db:seed RAILS_ENV=production
```
4. Ingresa a la aplicación desde tu navegador apuntando a la IP/Dominio de tu servidor en el puerto 8082 (según la configuración actual):
`http://TU_IP:8082`

### Logs y Mantenimiento:
Para ver los registros (logs) del backend:
```bash
sudo docker compose -f docker-compose.prod.yml logs --tail 100 -f web
```

---

## 👤 AUTOR

**Javier Mejías**  
Desarrollador Full-Stack  
https://www.linkedin.com/in/javier-mejías-655a7936a
