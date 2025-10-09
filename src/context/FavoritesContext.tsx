// === CONTEXT PARA FAVORITOS ===
// Este context maneja el estado de los Pokémon favoritos con persistencia en localStorage

import { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'

// === TIPOS PARA EL CONTEXT ===
interface FavoritesState {
  favoriteIds: number[]
}

type FavoritesAction = 
  | { type: 'ADD_FAVORITE'; payload: number }
  | { type: 'REMOVE_FAVORITE'; payload: number }
  | { type: 'LOAD_FAVORITES'; payload: number[] }
  | { type: 'CLEAR_FAVORITES' }

interface FavoritesContextType {
  state: FavoritesState
  actions: {
    addFavorite: (pokemonId: number) => void
    removeFavorite: (pokemonId: number) => void
    toggleFavorite: (pokemonId: number) => void
    isFavorite: (pokemonId: number) => boolean
    clearAllFavorites: () => void
    getFavoriteCount: () => number
  }
}

// === CONSTANTES ===
const FAVORITES_STORAGE_KEY = 'pokemon-favorites'

// === ESTADO INICIAL ===
const initialState: FavoritesState = {
  favoriteIds: []
}

// === REDUCER ===
function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (state.favoriteIds.includes(action.payload)) {
        return state // Ya está en favoritos
      }
      return {
        ...state,
        favoriteIds: [...state.favoriteIds, action.payload]
      }
    
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favoriteIds: state.favoriteIds.filter(id => id !== action.payload)
      }
    
    case 'LOAD_FAVORITES':
      return {
        ...state,
        favoriteIds: action.payload
      }
    
    case 'CLEAR_FAVORITES':
      return {
        ...state,
        favoriteIds: []
      }
    
    default:
      return state
  }
}

// === UTILIDADES PARA LOCALSTORAGE ===
function loadFavoritesFromStorage(): number[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (error) {
    console.warn('⚠️ [FavoritesContext] Error cargando favoritos del localStorage:', error)
  }
  return []
}

function saveFavoritesToStorage(favoriteIds: number[]): void {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
    console.log(`💾 [FavoritesContext] Favoritos guardados: ${favoriteIds.length} items`)
  } catch (error) {
    console.warn('⚠️ [FavoritesContext] Error guardando favoritos en localStorage:', error)
  }
}

// === CREAR CONTEXT ===
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// === PROVIDER COMPONENT ===
interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState)

  // === CARGAR FAVORITOS AL MONTAR ===
  useEffect(() => {
    const storedFavorites = loadFavoritesFromStorage()
    if (storedFavorites.length > 0) {
      dispatch({ type: 'LOAD_FAVORITES', payload: storedFavorites })
      console.log(`📋 [FavoritesContext] Favoritos cargados: ${storedFavorites.length} items`)
    }
  }, [])

  // === GUARDAR FAVORITOS CUANDO CAMBIEN ===
  useEffect(() => {
    if (state.favoriteIds.length > 0 || loadFavoritesFromStorage().length > 0) {
      saveFavoritesToStorage(state.favoriteIds)
    }
  }, [state.favoriteIds])

  // === ACCIONES ===
  const actions = {
    addFavorite: (pokemonId: number) => {
      console.log(`⭐ [FavoritesContext] Agregando favorito: ${pokemonId}`)
      dispatch({ type: 'ADD_FAVORITE', payload: pokemonId })
    },

    removeFavorite: (pokemonId: number) => {
      console.log(`💔 [FavoritesContext] Removiendo favorito: ${pokemonId}`)
      dispatch({ type: 'REMOVE_FAVORITE', payload: pokemonId })
    },

    toggleFavorite: (pokemonId: number) => {
      if (state.favoriteIds.includes(pokemonId)) {
        dispatch({ type: 'REMOVE_FAVORITE', payload: pokemonId })
        console.log(`💔 [FavoritesContext] Toggle: Removido ${pokemonId}`)
      } else {
        dispatch({ type: 'ADD_FAVORITE', payload: pokemonId })
        console.log(`⭐ [FavoritesContext] Toggle: Agregado ${pokemonId}`)
      }
    },

    isFavorite: (pokemonId: number): boolean => {
      return state.favoriteIds.includes(pokemonId)
    },

    clearAllFavorites: () => {
      console.log('🧹 [FavoritesContext] Limpiando todos los favoritos')
      dispatch({ type: 'CLEAR_FAVORITES' })
    },

    getFavoriteCount: (): number => {
      return state.favoriteIds.length
    }
  }

  // === CONTEXT VALUE ===
  const value: FavoritesContextType = {
    state,
    actions
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

// === HOOK PERSONALIZADO ===
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider')
  }
  return context
}

// Evita warning de react-refresh/only-export-components
useFavorites.displayName = 'useFavorites'