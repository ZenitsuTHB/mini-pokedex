# Análisis del proyecto: Mini Pokédex

Este documento describe las **decisiones técnicas**, la **arquitectura** del proyecto y posibles **mejoras futuras**.

## 🎯 Objetivo
Construir una SPA en React que consuma la PokéAPI para mostrar 50 Pokémon, con búsqueda, filtro por tipo y detalle.  
Debe incluir documentación, tests y buenas prácticas de desarrollo.

## 🏗️ Arquitectura del proyecto
- **Framework:** React + Vite + TypeScript
- **Estado y fetching:** React Query para cacheo, estados de loading y error.
- **Estilos:** TailwindCSS para rapidez y consistencia.
- **Routing:** React Router (Home + PokemonDetail).
- **Persistencia:** `localStorage` para favoritos (opcional).

## 🔧 Decisiones técnicas
- **TypeScript**: elegido para robustez y autocompletado al manejar la PokéAPI.
- **React Query**: facilita caching y control de estados de red.
- **Axios**: para un cliente HTTP sencillo y claro.
- **Tailwind**: diseño rápido, responsivo y mantenible.
- **Testing Library + Jest**: tests unitarios y de integración.

## 📂 Estructura de carpetas
```
src/
  api/
  app/
  components/
  context/
  hooks/
  pages/
  styles/
  tests/
  utils/
```

## ⚖️ Trade-offs
- **TypeScript** aumenta curva de aprendizaje pero da calidad a largo plazo.
- **React Query** agrega dependencia, pero simplifica mucho el manejo de datos de red.
- **Tailwind** puede ser más verboso en JSX, pero acelera la maquetación.

## 🚀 Posibles mejoras futuras
- **PWA**: soporte offline con service worker.
- **Accesibilidad (a11y)**: mejorar navegación por teclado y contraste.
- **Animaciones**: framer-motion para transiciones suaves.
- **Prefetching**: precargar detalles en hover para navegación instantánea.
- **CI/CD**: GitHub Actions con build + tests automáticos.

---
📌 Documento vivo: puede actualizarse conforme evolucione el proyecto.
