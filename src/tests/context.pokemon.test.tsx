// === TESTS PARA POKEMON CONTEXT ===
// Verificamos que el manejo del estado de Pokemon funcione correctamente

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PokemonProvider, usePokemon } from '../context/PokemonContext'
import { FavoritesProvider } from '../context/FavoritesContext'

// === MOCK DE LA API ===
vi.mock('../api', () => ({
  getFirstPokemonWithDetails: vi.fn(),
  searchPokemon: vi.fn(),
  filterPokemonByType: vi.fn(),
  extractUniqueTypes: vi.fn(),
  PokemonApiError: class PokemonApiError extends Error {}
}))

// === COMPONENTE DE TESTING ===
function TestComponent() {
  const { state, actions } = usePokemon()
  
  return (
    <div>
      <span data-testid="loading">{state.loading ? 'loading' : 'loaded'}</span>
      <span data-testid="error">{state.error || 'no-error'}</span>
      <span data-testid="pokemon-count">{state.pokemonList.length}</span>
      <span data-testid="filtered-count">{state.filteredPokemon.length}</span>
      <span data-testid="search-term">{state.searchTerm}</span>
      <span data-testid="selected-type">{state.selectedType}</span>
      <span data-testid="show-favorites">{state.showFavoritesOnly ? 'yes' : 'no'}</span>
      
      <button 
        data-testid="set-search" 
        onClick={() => actions.setSearchTerm('pikachu')}
      >
        Set Search
      </button>
      
      <button 
        data-testid="set-type" 
        onClick={() => actions.setSelectedType('electric')}
      >
        Set Type
      </button>
      
      <button 
        data-testid="toggle-favorites" 
        onClick={() => actions.setShowFavoritesOnly(!state.showFavoritesOnly)}
      >
        Toggle Favorites
      </button>
      
      <button 
        data-testid="refresh" 
        onClick={() => actions.refreshData()}
      >
        Refresh
      </button>
    </div>
  )
}

// === WRAPPER CON PROVIDERS ===
function renderWithProviders() {
  return render(
    <FavoritesProvider>
      <PokemonProvider>
        <TestComponent />
      </PokemonProvider>
    </FavoritesProvider>
  )
}

// === MOCK LOCALSTORAGE ===
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// @ts-expect-error - Mock para localStorage en tests
global.localStorage = localStorageMock

describe('🎮 PokemonContext', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Estado inicial', () => {
    it('debe inicializar con estado por defecto', () => {
      renderWithProviders()
      
      expect(screen.getByTestId('loading')).toHaveTextContent('loading')
      expect(screen.getByTestId('error')).toHaveTextContent('no-error')
      expect(screen.getByTestId('pokemon-count')).toHaveTextContent('0')
      expect(screen.getByTestId('filtered-count')).toHaveTextContent('0')
      expect(screen.getByTestId('search-term')).toHaveTextContent('')
      expect(screen.getByTestId('selected-type')).toHaveTextContent('')
      expect(screen.getByTestId('show-favorites')).toHaveTextContent('no')
    })
  })

  describe('Acciones de filtrado', () => {
    it('debe actualizar el término de búsqueda', () => {
      renderWithProviders()
      
      fireEvent.click(screen.getByTestId('set-search'))
      
      expect(screen.getByTestId('search-term')).toHaveTextContent('pikachu')
    })

    it('debe actualizar el tipo seleccionado', () => {
      renderWithProviders()
      
      fireEvent.click(screen.getByTestId('set-type'))
      
      expect(screen.getByTestId('selected-type')).toHaveTextContent('electric')
    })

    it('debe alternar el filtro de favoritos', () => {
      renderWithProviders()
      
      fireEvent.click(screen.getByTestId('toggle-favorites'))
      
      expect(screen.getByTestId('show-favorites')).toHaveTextContent('yes')
      
      fireEvent.click(screen.getByTestId('toggle-favorites'))
      
      expect(screen.getByTestId('show-favorites')).toHaveTextContent('no')
    })
  })

  describe('Manejo de errores', () => {
    it('debe manejar errores sin crashear el componente', () => {
      // No debe throw error al renderizar
      expect(() => renderWithProviders()).not.toThrow()
    })
  })
})