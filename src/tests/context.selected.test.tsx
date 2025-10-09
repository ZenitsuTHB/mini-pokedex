// === TESTS PARA SELECTED POKEMON CONTEXT ===
// Verificamos que la selección de Pokemon funcione correctamente

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SelectedPokemonProvider, useSelectedPokemon } from '../context/SelectedPokemonContext'
import type { Pokemon } from '../api'

// === POKEMON DE TESTING ===
const mockPokemon = {
  id: 25,
  name: 'pikachu',
  sprites: {
    front_default: 'https://example.com/pikachu.png'
  },
  types: [{ 
    slot: 1,
    type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } 
  }],
  height: 4,
  weight: 60,
  stats: [
    { 
      stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' }, 
      base_stat: 35,
      effort: 0
    }
  ]
} as Pokemon

// === COMPONENTE DE TESTING ===
function TestComponent() {
  const { state, actions } = useSelectedPokemon()
  
  return (
    <div>
      <span data-testid="selected-id">
        {state.selectedPokemon?.id || 'none'}
      </span>
      <span data-testid="selected-name">
        {state.selectedPokemon?.name || 'none'}
      </span>
      <span data-testid="is-selected-25">
        {actions.isSelected(25) ? 'yes' : 'no'}
      </span>
      
      <button 
        data-testid="select-pokemon" 
        onClick={() => actions.selectPokemon(mockPokemon)}
      >
        Select Pokemon
      </button>
      
      <button 
        data-testid="clear-selection" 
        onClick={() => actions.clearSelection()}
      >
        Clear Selection
      </button>
    </div>
  )
}

// === WRAPPER CON PROVIDER ===
function renderWithProvider() {
  return render(
    <SelectedPokemonProvider>
      <TestComponent />
    </SelectedPokemonProvider>
  )
}

describe('🎯 SelectedPokemonContext', () => {
  beforeEach(() => {
    // Reset antes de cada test
  })

  describe('Estado inicial', () => {
    it('debe inicializar sin Pokemon seleccionado', () => {
      renderWithProvider()
      
      expect(screen.getByTestId('selected-id')).toHaveTextContent('none')
      expect(screen.getByTestId('selected-name')).toHaveTextContent('none')
      expect(screen.getByTestId('is-selected-25')).toHaveTextContent('no')
    })
  })

  describe('Seleccionar Pokemon', () => {
    it('debe seleccionar un Pokemon correctamente', () => {
      renderWithProvider()
      
      fireEvent.click(screen.getByTestId('select-pokemon'))
      
      expect(screen.getByTestId('selected-id')).toHaveTextContent('25')
      expect(screen.getByTestId('selected-name')).toHaveTextContent('pikachu')
      expect(screen.getByTestId('is-selected-25')).toHaveTextContent('yes')
    })

    it('debe limpiar la selección', () => {
      renderWithProvider()
      
      // Primero seleccionar
      fireEvent.click(screen.getByTestId('select-pokemon'))
      expect(screen.getByTestId('selected-id')).toHaveTextContent('25')
      
      // Luego limpiar
      fireEvent.click(screen.getByTestId('clear-selection'))
      expect(screen.getByTestId('selected-id')).toHaveTextContent('none')
      expect(screen.getByTestId('is-selected-25')).toHaveTextContent('no')
    })
  })

  describe('Función isSelected', () => {
    it('debe identificar correctamente Pokemon seleccionado', () => {
      renderWithProvider()
      
      // Inicialmente no hay nada seleccionado
      expect(screen.getByTestId('is-selected-25')).toHaveTextContent('no')
      
      // Después de seleccionar
      fireEvent.click(screen.getByTestId('select-pokemon'))
      expect(screen.getByTestId('is-selected-25')).toHaveTextContent('yes')
    })
  })
})