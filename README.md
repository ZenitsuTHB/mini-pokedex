# Mini Pokédex

Este proyecto es una **Mini Pokédex** construida con **React + TypeScript + Vite**.  
Consume la [PokéAPI](https://pokeapi.co/) para mostrar los 50 primeros Pokémon con búsqueda, filtros, detalle y manejo de errores.  

## 🚀 Tecnologías principales
- React 18 + TypeScript
- Vite
- React Router
- React Query (TanStack)
- Axios
- TailwindCSS (estilos)
- Jest + React Testing Library (tests)

## 🛠️ Tools
- Chatgpt ֎

## 📦 Instalación y ejecución
```bash
# Clonar el repo
git clone git@github.com:ZenitsuTHB/mini-pokedex.git
cd mini-pokedex

# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build de producción
npm run build
npm run preview

# Ejecutar tests
npm test
```

## 📂 Estructura del proyecto
```
src/
  api/               # cliente API (axios/fetch)
  app/               # providers (queryClient, theme)
  components/        # UI + componentes reusables
  context/           # favoritos (opcional)
  hooks/             # hooks personalizados
  pages/             # Home, PokemonDetail
  styles/            # CSS/Tailwind
  tests/             # tests unitarios
  utils/             # helpers
```

## ✅ Funcionalidades
- Listado de 50 Pokémon (imagen, nombre, tipos)
- Búsqueda en vivo (insensible a mayúsculas, parcial)
- Filtro por tipo (scroll horizontal si necesario)
- Detalle del Pokémon: imagen, nombre, tipos, peso, altura
- Botón volver en la página de detalle
- Loading spinner y manejo de errores
- **Opcional:** Favoritos persistentes en `localStorage`
- **Opcional:** Animaciones, accesibilidad, PWA

## 🧪 Tests
- Lista muestra 50 Pokémon
- Búsqueda filtra resultados correctamente
- Filtro por tipo funcional
- Página de detalle con información completa
- Favoritos guardados en `localStorage`

## 📖 Documentación adicional
Consulta el archivo `ANALISI.md` para ver el análisis de arquitectura, decisiones técnicas y mejoras futuras.

## 📦 Deploy
El proyecto puede desplegarse en **Vercel**, **Netlify** o GitHub Pages.

---
👨‍💻 Desarrollado como parte del reto *Hackató - Mini Pokédex*.
