// === CONTEXT PARA POKÉMON SELECCIONADO ===
// Este context maneja qué Pokémon está seleccionado para mostrar en detalle

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Pokemon } from '../api'

// === TIPOS PARA EL CONTEXT ===
interface SelectedPokemonState {
  selectedPokemon: Pokemon | null
}

interface SelectedPokemonContextType {
  state: SelectedPokemonState
  actions: {
    selectPokemon: (pokemon: Pokemon) => void
    clearSelection: () => void
    isSelected: (pokemonId: number) => boolean
  }
}

// === CREAR CONTEXT ===
const SelectedPokemonContext = createContext<SelectedPokemonContextType | undefined>(undefined)

// === PROVIDER COMPONENT ===
interface SelectedPokemonProviderProps {
  children: ReactNode
}

export function SelectedPokemonProvider({ children }: SelectedPokemonProviderProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)

  // === ACCIONES ===
  const actions = {
    selectPokemon: (pokemon: Pokemon) => {
      console.log(`🎯 [SelectedPokemonContext] Seleccionando: ${pokemon.name} (#${pokemon.id})`)
      setSelectedPokemon(pokemon)
    },

    clearSelection: () => {
      console.log('↩️ [SelectedPokemonContext] Limpiando selección')
      setSelectedPokemon(null)
    },

    isSelected: (pokemonId: number): boolean => {
      return selectedPokemon?.id === pokemonId
    }
  }

  // === CONTEXT VALUE ===
  const value: SelectedPokemonContextType = {
    state: { selectedPokemon },
    actions
  }

  return (
    <SelectedPokemonContext.Provider value={value}>
      {children}
    </SelectedPokemonContext.Provider>
  )
}

// === HOOK PERSONALIZADO ===
export function useSelectedPokemon() {
  const context = useContext(SelectedPokemonContext)
  if (context === undefined) {
    throw new Error('useSelectedPokemon debe ser usado dentro de un SelectedPokemonProvider')
  }
  return context
}

// Evita warning de react-refresh/only-export-components
useSelectedPokemon.displayName = 'useSelectedPokemon'