# Mini Pokédex

Este proyecto es una **Mini Pokédex** construida con **React + TypeScript + Vite**.  
Consume la [PokéAPI](https://pokeapi.co/) para mostrar los 50 primeros Pokémon con búsqueda, 
filtros, detalle y manejo de errores.  

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

# 🧪 Testing
npm run test        # Ejecutar tests en modo watch
npm run test:run    # Ejecutar tests una vez
npm run test:ui     # Interfaz visual de tests

# 🔧 Usando Makefile (recomendado)
make install       # Instalar dependencias
make dev          # Modo desarrollo
make test         # Ejecutar todos los tests
make test-watch   # Tests en modo watch
make build        # Build de producción
make clean        # Limpiar archivos temporales
```

## 📂 Estructura del proyecto
```
src/
  api/               # 🌐 Cliente API REST (tipos, funciones HTTP, utils)
    types.ts         # Interfaces TypeScript para PokéAPI
    client.ts        # Cliente HTTP base con manejo de errores
    pokemon.ts       # Funciones específicas de Pokémon
    index.ts         # Punto de entrada de la API
  app/               # 🏗️ Providers (queryClient, theme)
  components/        # 🧩 UI + componentes reusables
  context/           # 📦 Context para favoritos (opcional)
  hooks/             # 🪝 Hooks personalizados
  pages/             # 📄 Home, PokemonDetail
  styles/            # 🎨 CSS/Tailwind
  tests/             # 🧪 Tests unitarios y de integración
    api.utilities.test.ts  # Tests para funciones utilitarias
    api.http.test.ts       # Tests para peticiones HTTP
    setup.ts              # Configuración global de tests
  utils/             # 🛠️ Helpers y utilidades
```

## 🧪 Testing Strategy
Este proyecto usa **Vitest** como framework de testing principal:

### Tipos de tests implementados:
- **🔧 Unit Tests**: Funciones utilitarias (formateo, conversiones, búsqueda)
- **🌐 API Tests**: Peticiones HTTP con mocks
- **🔍 Integration Tests**: Flujos completos de datos
- **⚠️ Error Handling**: Manejo de errores y reintentos

### Cobertura actual:
- ✅ **API Layer**: 85% cobertura
- ✅ **Utils**: 100% cobertura  
- ✅ **Search/Filter**: 100% cobertura
- 🔄 **Components**: En desarrollo

### Comandos de testing:
```bash
# Tests básicos
npm run test          # Modo watch (desarrollo)
npm run test:run      # Ejecutar una vez
npm run test:ui       # Interfaz visual

# Con Makefile
make test            # Ejecutar todos los tests
make test-watch      # Tests en modo watch
make test-coverage   # Reporte de cobertura
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

## � Deploy
El proyecto está **listo para despliegue** en múltiples plataformas:

### Opciones de Deploy:
- 🌐 **Vercel** (Recomendado): `make deploy-vercel`
- 🌐 **Netlify**: `make deploy-netlify` 
- 🐙 **GitHub Pages**: `make deploy-github-pages`
- 📦 **Manual**: `make deploy-ready`

### Comandos rápidos:
```bash
# Preparar para deploy
make deploy-ready

# Ver todas las opciones
make deploy-info

# Deploy en Vercel
make deploy-vercel
```

📋 **Guía completa**: Ver `DEPLOY.md` para instrucciones detalladas.

### URLs de Demo:
Una vez desplegado, estará disponible en URLs como:
- `https://mini-pokedex-usuario.vercel.app`
- `https://mini-pokedex-abc123.netlify.app`

---
👨‍💻 Desarrollado como parte del reto *Hackató - Mini Pokédex*.
