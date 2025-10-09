// === TESTS PARA FAVORITES CONTEXT ===
// Verificamos que el manejo de favoritos funcione correctamente

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FavoritesProvider, useFavorites } from '../context/FavoritesContext'

// === COMPONENTE DE TESTING ===
// Componente helper para probar el hook
function TestComponent() {
  const { state, actions } = useFavorites()
  
  return (
    <div>
      <span data-testid="favorite-count">{state.favoriteIds.length}</span>
      <span data-testid="favorite-list">{state.favoriteIds.join(',')}</span>
      
      <button 
        data-testid="add-favorite-1" 
        onClick={() => actions.addFavorite(1)}
      >
        Add Favorite 1
      </button>
      
      <button 
        data-testid="toggle-favorite-2" 
        onClick={() => actions.toggleFavorite(2)}
      >
        Toggle Favorite 2
      </button>
      
      <button 
        data-testid="remove-favorite-1" 
        onClick={() => actions.removeFavorite(1)}
      >
        Remove Favorite 1
      </button>
      
      <button 
        data-testid="clear-all" 
        onClick={() => actions.clearAllFavorites()}
      >
        Clear All
      </button>
      
      <span data-testid="is-favorite-1">
        {actions.isFavorite(1) ? 'yes' : 'no'}
      </span>
    </div>
  )
}

// === WRAPPER CON PROVIDER ===
function renderWithProvider() {
  return render(
    <FavoritesProvider>
      <TestComponent />
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

// @ts-ignore
global.localStorage = localStorageMock

describe('🌟 FavoritesContext', () => {

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
    
    // Mock retorna array vacío por defecto
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Estado inicial', () => {
    it('debe inicializar con array vacío de favoritos', () => {
      renderWithProvider()
      
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('0')
      expect(screen.getByTestId('favorite-list')).toHaveTextContent('')
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('no')
    })

    it('debe cargar favoritos desde localStorage', () => {
      localStorageMock.getItem.mockReturnValue('[1,2,3]')
      
      renderWithProvider()
      
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('3')
      expect(screen.getByTestId('favorite-list')).toHaveTextContent('1,2,3')
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('yes')
    })
  })

  describe('Agregar favoritos', () => {
    it('debe agregar un favorito correctamente', () => {
      renderWithProvider()
      
      fireEvent.click(screen.getByTestId('add-favorite-1'))
      
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('1')
      expect(screen.getByTestId('favorite-list')).toHaveTextContent('1')
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('yes')
      
      // Verificar que se guardó en localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'pokemon-favorites',
        '[1]'
      )
    })

    it('no debe agregar favoritos duplicados', () => {
      renderWithProvider()
      
      // Agregar el mismo favorito dos veces
      fireEvent.click(screen.getByTestId('add-favorite-1'))
      fireEvent.click(screen.getByTestId('add-favorite-1'))
      
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('1')
      expect(screen.getByTestId('favorite-list')).toHaveTextContent('1')
    })
  })

  describe('Toggle favoritos', () => {
    it('debe agregar favorito si no existe', () => {
      renderWithProvider()
      
      fireEvent.click(screen.getByTestId('toggle-favorite-2'))
      
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('1')
      expect(screen.getByTestId('favorite-list')).toHaveTextContent('2')
    })

    it('debe remover favorito si ya existe', () => {
      localStorageMock.getItem.mockReturnValue('[2]')
      renderWithProvider()
      
      fireEvent.click(screen.getByTestId('toggle-favorite-2'))
      
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('0')
      expect(screen.getByTestId('favorite-list')).toHaveTextContent('')
    })
  })

  describe('Remover favoritos', () => {
    it('debe remover un favorito específico', () => {
      localStorageMock.getItem.mockReturnValue('[1,2,3]')
      renderWithProvider()
      
      fireEvent.click(screen.getByTestId('remove-favorite-1'))
      
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('2')
      expect(screen.getByTestId('favorite-list')).toHaveTextContent('2,3')
      expect(screen.getByTestId('is-favorite-1')).toHaveTextContent('no')
    })

    it('debe limpiar todos los favoritos', () => {
      localStorageMock.getItem.mockReturnValue('[1,2,3]')
      renderWithProvider()
      
      fireEvent.click(screen.getByTestId('clear-all'))
      
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('0')
      expect(screen.getByTestId('favorite-list')).toHaveTextContent('')
      
      // Verificar que se removió de localStorage
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('pokemon-favorites')
    })
  })

  describe('Persistencia en localStorage', () => {
    it('debe intentar cargar desde localStorage al inicializar', () => {
      renderWithProvider()
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('pokemon-favorites')
    })

    it('debe manejar JSON inválido en localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')
      
      // No debe crashear, debe usar array vacío
      expect(() => renderWithProvider()).not.toThrow()
      
      expect(screen.getByTestId('favorite-count')).toHaveTextContent('0')
    })
  })
})