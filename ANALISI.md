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
    api/                # cliente API (axios/fetch) + endpoints
        pokemon.ts
    app/
        providers.tsx   # QueryClientProvider, ThemeProvider
    components/
        UI/             # Button, Badge, Spinner, Card...
        PokemonCard.tsx
        SearchInput.tsx
        TypeFilter.tsx
    context/
        Favorites.tsx   # (opcional) context for favorites
    hooks/
        useDebounce.ts
    pages/
        Home.tsx
        PokemonDetail.tsx
    styles/
        globals.css
    tests/
    utils/
        format.ts
    main.tsx
```

## ⚖️ Trade-offs
- **TypeScript** aumenta curva de aprendizaje pero da calidad a largo plazo.
- **React Query** agrega dependencia, pero simplifica mucho el manejo de datos de red.
- **Tailwind** puede ser más verboso en JSX, pero acelera la maquetación.

---
📌 Documento vivo: puede actualizarse conforme evolucione el proyecto.

quiero empezar a modularizar un poco pero paso a paso para poder entender bien como crear componentes en typescript y como funciona bien yo quiero que me enseñes empezando para decirme que es la api rest y como establecemos la api rest respestando una estructura profesional para eso echa un vistazo a la estructura que tengo en analisi.md
la api rest seguira este plan 
ESCENARI FUNCIONAL
Has de construir una aplicació web que permeti explorar Pokémons mitjançant la PokéAPI