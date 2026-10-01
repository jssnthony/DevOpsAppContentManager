# Arquitectura de VicHub

**Etapa:** 01 - Definición de la arquitectura inicial
**Estado:** Propuesta base para el MVP
**Fecha:** 2026-10-01

## 1. Objetivo

Definir los límites y responsabilidades principales de VicHub antes de construir su estructura inicial. Esta arquitectura sirve como referencia para las etapas posteriores; no implica que los componentes descritos ya estén implementados.

## 2. Alcance del MVP

VicHub gestionará proyectos, PBIs (Product Backlog Items), tareas, horas y progreso. En esta etapa se establece una aplicación web con frontend y backend separados, persistencia en MongoDB y ejecución local mediante Docker Compose.

Quedan fuera del MVP inicial la autenticación, los roles, el despliegue de producción y las reglas de negocio detalladas. Se abordarán en sus etapas correspondientes.

## 3. Stack tecnológico

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Frontend | Vue 3, Vite, Vue Router | Interfaz y navegación de la aplicación. |
| Comunicación | HTTP y API REST/JSON | Intercambio entre frontend y backend. |
| Backend | Node.js y Express | API, validación y coordinación de casos de uso. |
| Persistencia | MongoDB, MongoDB Node.js Driver | Almacenamiento de documentos de la aplicación. |
| Entorno local | Docker y Docker Compose | Ejecución reproducible de la aplicación y MongoDB. |

JavaScript o TypeScript se elegirá al crear la estructura inicial, respetando las convenciones que establezca el proyecto en esa etapa. No se incorporará Pinia hasta que el estado compartido del frontend lo justifique.

## 4. Vista lógica

```text
Usuario
  |
  v
Frontend Vue 3
  |  HTTP / JSON
  v
API REST (Express)
  |
  v
Routes -> Controllers -> Services
                      |
                      v
          Database config / MongoDB Driver
                      |
                      v
                   MongoDB
```

El navegador solo se comunica con la API de Express. Las credenciales y la conexión a MongoDB permanecen en el backend y nunca se exponen al frontend.

## 5. Responsabilidades por componente

### Frontend

- Presentar las vistas de Dashboard, Projects, PBIs y Tasks.
- Gestionar navegación mediante Vue Router.
- Consumir la API a través de una capa de servicios HTTP.
- Mantener componentes reutilizables y evitar concentrar la aplicación completa en `App.vue`.

### Backend

- Publicar endpoints REST bajo `/api`.
- Validar y traducir las solicitudes HTTP.
- Mantener la lógica de negocio en servicios, no en `app.js` ni directamente en las rutas.
- Convertir los resultados en respuestas JSON y utilizar códigos HTTP adecuados.

### Base de datos

- Mantener las colecciones y documentos de VicHub en MongoDB.
- Usar identificadores consistentes para las relaciones entre entidades.
- Gestionar cambios estructurales mediante migraciones reproducibles, separadas de los seeds.

### Infraestructura local

- Ejecutar los servicios de aplicación y base de datos con Docker Compose.
- Leer configuración sensible desde variables de entorno; no guardar secretos en el código fuente.
- Mantener los datos de MongoDB en un volumen persistente de Docker.

## 6. Modelo de dominio inicial

La jerarquía principal es:

```text
Project
  └── PBI
        └── Task
```

Projects, PBIs y Tasks tendrán documentos propios y referencias por identificador. Las horas estimadas y reales, el progreso y el estado se asignarán a la entidad que corresponda al definir los documentos en la Etapa 08. No se duplicarán documentos completos relacionados sin una necesidad de consulta justificada.

## 7. Contrato de API previsto

La API de negocio tendrá como recursos iniciales:

- `GET`, `POST`, `PUT` y `DELETE /api/projects`, además de `GET /api/projects/:id`.
- `GET`, `POST`, `PUT` y `DELETE /api/pbis`, además de `GET /api/pbis/:id`.
- `GET`, `POST`, `PUT` y `DELETE /api/tasks`, además de `GET /api/tasks/:id`.
- `GET /api/dashboard` para los datos agregados del Dashboard.

Los contratos concretos, filtros, validaciones y respuestas de error se definirán al implementar cada etapa de API. Los cálculos que agreguen información de MongoDB se harán preferentemente en el backend.

## 8. Estructura lógica objetivo

La estructura física se definirá en la Etapa 02. Como guía, debe conservar límites reconocibles entre frontend, backend e infraestructura. El backend separará al menos rutas, controladores, servicios, configuración de base de datos y middleware. El frontend separará vistas, componentes, servicios y router cuando se cree.

No se prescribe aquí una estructura de carpetas exacta ni se crean archivos de implementación.

## 9. Decisiones y restricciones

1. Vue no accede directamente a MongoDB; todas las operaciones pasan por la API.
2. La API usa REST sobre HTTP y JSON.
3. La conexión y las credenciales de base de datos pertenecen exclusivamente al backend.
4. Los límites entre rutas, controladores, servicios y persistencia deben permitir probar y cambiar responsabilidades sin concentrar lógica en un archivo principal.
5. MongoDB es la base de datos objetivo del proyecto; no se introduce una segunda base de datos para el MVP.
6. La arquitectura se implementará incrementalmente conforme a las etapas oficiales, sin adelantar autenticación, roles o funcionalidades de etapas futuras.

## 10. Estado del entorno LocalEnv

Este documento describe la arquitectura objetivo de VicHub, no una auditoría ni una modificación del entorno existente. Al momento de redactarlo, `LocalEnv` contiene una aplicación Node, un `docker-compose.yml` con un servicio MongoDB y un `package.json` que declara `mysql2`; por ello, el entorno actual todavía no representa de forma consistente el stack objetivo. La alineación de Docker y MongoDB corresponde a las etapas de infraestructura y base de datos, no a esta definición arquitectónica.

## 11. Etapas relacionadas

- **Etapa 02:** crear la estructura inicial de carpetas y archivos siguiendo estos límites.
- **Etapas 03-04:** configurar Docker y MongoDB.
- **Etapas 05-06:** implementar Express y su conexión con MongoDB.
- **Etapas 07-08:** definir migraciones y documentos.
- **Etapas 09-12:** implementar recursos y Dashboard.
- **Etapas 13-20:** construir el frontend e integrarlo con la API.
- **Etapas 21-28:** integración, validaciones, seguridad, pruebas, despliegue y documentación.

## Verificación

1. Abre `LocalEnv/architecture.md` y confirma que el diagrama sigue el flujo Vue -> HTTP -> Express -> servicios -> MongoDB.
2. Comprueba que el documento separa la arquitectura objetivo del estado actual de `LocalEnv`.
3. Confirma que no se modificaron archivos de implementación ni se avanzó a la Etapa 02.
