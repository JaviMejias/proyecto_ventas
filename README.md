# 🍜 Sistema de Gestión de Ventas y Pedidos de Comida

## 🎯 Descripción General

Este proyecto es una aplicación web integral construida con Ruby on Rails, diseñada para optimizar y simplificar el proceso de gestión de ventas de comida, ideal para eventos de recaudación de fondos, ferias o pequeños negocios de catering. La plataforma abarca desde la configuración dinámica de menús hasta el control financiero mediante cierres de caja detallados, proporcionando una solución robusta para la administración de pedidos.

## ✨ Características y Módulos Clave

### 1. **Administración de Menú y Agregados**
* **Platos Principales:** Permite definir y gestionar un catálogo de platos principales (ej., Pollo, Pescado, Vacuno) con sus respectivos precios base.
* **Configuración de Agregados por Plato:** Capacidad para establecer la cantidad máxima de agregados permitidos por cada plato principal, ofreciendo flexibilidad en la personalización de la oferta.
* **Gestión de Agregados:** Módulo para la creación y administración de una lista exhaustiva de agregados disponibles. Incluye una funcionalidad de modal para añadir múltiples agregados de forma eficiente.

### 2. **Módulo de Ventas y Pedidos (Punto de Venta)**
* **Tabla Dinámica de Pedidos:** Interfaz de usuario intuitiva con una tabla dinámica que permite añadir múltiples líneas de pedido por transacción.
    * **Columnas:** `Menú Item`, `Agregados`, `Cantidad`, `Precio`, `Total`, `Eliminar`.
* **Selección Inteligente de Agregados:** Un `select` de agregados se habilita y restringe dinámicamente según el plato principal seleccionado, aplicando el límite predefinido de agregados por plato. Al intentar exceder el límite, se muestra una alerta.
* **Cálculos Automáticos:** El precio unitario se carga automáticamente al seleccionar un plato, y el total de la línea se calcula en tiempo real al ingresar la cantidad.
* **Detalle del Cliente y Pago:** Registro del nombre del cliente, método de pago (Efectivo, Tarjeta, Transferencia) y un total general de la venta por transacción.

### 3. **Historial de Ventas**
* Interfaz dedicada para visualizar un registro cronológico de todos los pedidos y transacciones previamente ingresadas.

### 4. **Cierre de Caja**
* Módulo financiero para realizar cierres de caja de todas las ventas no consolidadas.
* **Agrupación por Tipo de Pago:** Agrupa y muestra los totales acumulados por cada método de pago (efectivo, tarjeta, transferencia).
* **Conciliación:** Permite al usuario ingresar el total físico "en caja". El sistema compara este valor con el total calculado, mostrando automáticamente cualquier diferencia para facilitar la conciliación.

## 🛠️ Tecnologías Utilizadas

* **Backend:**
    * Rails (versión 7.2.2)
    * Ruby (versión 3.3.5)
    * PostgreSQL (como base de datos)
* **Frontend:**
    * HTML, CSS
    * JavaScript
    * jQuery
    * Stimulus
* **Control de Versiones:**
    * Git

## 🚀 Instalación y Configuración (para desarrolladores)

Para poner este proyecto en funcionamiento en tu entorno local:

1.  **Clonar el repositorio:**
    ```bash
    git clone git@github.com:JaviMejias/proyecto_ventas.git
    cd proyecto_ventas
    ```

2.  **Instalar dependencias de Ruby:**
    ```bash
    npm install
    bundle install
    ```

3.  **Configurar la base de datos PostgreSQL:**
    * Asegúrate de tener PostgreSQL instalado y en ejecución.
    * Crea una base de datos para el proyecto (puedes ajustar `config/database.yml` si es necesario).
    * Ejecuta las migraciones de la base de datos:
        ```bash
        rails db:create
        rails db:migrate

4.  **Iniciar el servidor Rails:**
    ```bash
    rails s
    ```

5.  **Acceder a la aplicación:**
    * Abre tu navegador y visita `http://localhost:3000` (o el puerto que Rails esté usando).

## 👨‍💻 Autor

* **Javier Mejías** ([Tu Perfil de LinkedIn](https://www.linkedin.com/in/javier-mejías-655a7936a)) - *Desarrollador Full-Stack*

---
