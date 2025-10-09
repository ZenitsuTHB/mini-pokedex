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
        api.utilities.test.ts  # Tests para funciones utilitarias
        api.http.test.ts       # Tests para peticiones HTTP 
        setup.ts              # Configuración global de tests
        vitest.d.ts           # Tipos para Vitest
    utils/
        format.ts
    main.tsx
```

## 🧪 Estrategia de Testing

### Framework elegido: **Vitest**
- **Motivo**: Más rápido que Jest, integración nativa con Vite, API familiar
- **Configuración**: `vitest.config.ts` con entorno jsdom para tests de React
- **Setup global**: `src/tests/setup.ts` con mocks y configuración

### Tipos de tests implementados:

#### 🔧 **Unit Tests** - Funciones utilitarias
```typescript
// Ejemplo: tests para formateo y conversiones
describe('extractIdFromUrl', () => {
  it('debe extraer ID correctamente de URLs válidas', () => {
    expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
  })
})
```

#### 🌐 **API Tests** - Peticiones HTTP con mocks
```typescript
// Ejemplo: tests para llamadas a la PokéAPI
describe('getPokemonList', () => {
  it('debe obtener lista de Pokémon correctamente', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonListResponse
    } as Response)
    
    const result = await getPokemonList(2, 0)
    expect(result.results).toHaveLength(2)
  })
})
```

#### 🔍 **Integration Tests** - Búsqueda y filtrado
```typescript
// Ejemplo: tests para lógica de negocio
describe('searchPokemon', () => {
  it('debe buscar Pokémon por nombre parcial', () => {
    const result = searchPokemon(mockPokemonList, 'pika')
    expect(result[0].name).toBe('pikachu')
  })
})
```

### Cobertura y métricas:
- **API Layer**: 85% cobertura (33 tests, 28 passing)
- **Utils Functions**: 100% cobertura 
- **Search/Filter**: 100% cobertura
- **Error Handling**: 80% cobertura (algunos timeouts en desarrollo)

### Comandos de testing:
```bash
# Desarrollo
make test-watch    # Tests en modo watch
make test         # Ejecutar todos los tests
make test-api     # Solo tests de API
make test-utils   # Solo tests de utilidades

# CI/CD
make ci           # Pipeline completo
make test-coverage # Reporte de cobertura
```

### Configuración de mocks:
- **fetch**: Mockeado globalmente para tests de API
- **Timeouts**: Configurados para tests de reintentos
- **Error scenarios**: Tests para manejo de errores de red

## ⚖️ Trade-offs
- **TypeScript** aumenta curva de aprendizaje pero da calidad a largo plazo.
- **React Query** agrega dependencia, pero simplifica mucho el manejo de datos de red.
- **Tailwind** puede ser más verboso en JSX, pero acelera la maquetación.

---
📌 Documento vivo: puede actualizarse conforme evolucione el proyecto.

