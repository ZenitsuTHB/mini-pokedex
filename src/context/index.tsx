// === PROVIDER PRINCIPAL ===
// Este archivo combina todos los contexts en un solo provider para facilitar su uso

import type { ReactNode } from 'react'
import { PokemonProvider } from './PokemonContext'
import { FavoritesProvider } from './FavoritesContext'
import { SelectedPokemonProvider } from './SelectedPokemonContext'

// === PROVIDER QUE COMBINA TODOS LOS CONTEXTS ===
interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <FavoritesProvider>
      <SelectedPokemonProvider>
        <PokemonProvider>
          {children}
        </PokemonProvider>
      </SelectedPokemonProvider>
    </FavoritesProvider>
  )
}

// === EXPORTAR TODOS LOS HOOKS ===
export { usePokemon } from './PokemonContext'
export { useFavorites } from './FavoritesContext'
export { useSelectedPokemon } from './SelectedPokemonContext'

// === EXPORTAR TIPOS ===
export type { Pokemon } from '../api'