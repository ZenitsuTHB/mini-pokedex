// === CONTEXT PARA POKÉMON ===
// Este context maneja todo el estado relacionado con la lista de Pokémon,
// carga de datos, búsqueda y filtrado

import { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'
import { 
  getFirstPokemonWithDetails,
  searchPokemon,
  filterPokemonByType,
  extractUniqueTypes,
  type Pokemon,
  PokemonApiError
} from '../api'
import { useFavorites } from './FavoritesContext'

// === TIPOS PARA EL CONTEXT ===
interface PokemonState {
  // Datos principales
  pokemonList: Pokemon[]
  filteredPokemon: Pokemon[]
  availableTypes: string[]
  
  // Estados de UI
  loading: boolean
  error: string | null
  
  // Filtros y búsqueda
  searchTerm: string
  selectedType: string
  showFavoritesOnly: boolean
}

// Acciones que puede manejar el reducer
type PokemonAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_POKEMON_LIST'; payload: Pokemon[] }
  | { type: 'SET_AVAILABLE_TYPES'; payload: string[] }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_SELECTED_TYPE'; payload: string }
  | { type: 'SET_SHOW_FAVORITES_ONLY'; payload: boolean }
  | { type: 'UPDATE_FILTERED_POKEMON'; payload: Pokemon[] }

// Interface para las funciones del context
interface PokemonContextType {
  // Estado
  state: PokemonState
  
  // Acciones
  actions: {
    loadPokemonData: () => Promise<void>
    setSearchTerm: (term: string) => void
    setSelectedType: (type: string) => void
    setShowFavoritesOnly: (show: boolean) => void
    refreshData: () => Promise<void>
  }
}

// === ESTADO INICIAL ===
const initialState: PokemonState = {
  pokemonList: [],
  filteredPokemon: [],
  availableTypes: [],
  loading: true,
  error: null,
  searchTerm: '',
  selectedType: '',
  showFavoritesOnly: false
}

// === REDUCER PARA MANEJAR ESTADO ===
function pokemonReducer(state: PokemonState, action: PokemonAction): PokemonState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_POKEMON_LIST':
      return { ...state, pokemonList: action.payload }
    
    case 'SET_AVAILABLE_TYPES':
      return { ...state, availableTypes: action.payload }
    
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload }
    
    case 'SET_SELECTED_TYPE':
      return { ...state, selectedType: action.payload }
    
    case 'SET_SHOW_FAVORITES_ONLY':
      return { ...state, showFavoritesOnly: action.payload }
    
    case 'UPDATE_FILTERED_POKEMON':
      return { ...state, filteredPokemon: action.payload }
    
    default:
      return state
  }
}

// === CREAR CONTEXT ===
const PokemonContext = createContext<PokemonContextType | undefined>(undefined)

// === PROVIDER COMPONENT ===
interface PokemonProviderProps {
  children: ReactNode
}

export function PokemonProvider({ children }: PokemonProviderProps) {
  const [state, dispatch] = useReducer(pokemonReducer, initialState)
  const { state: favoritesState } = useFavorites() // Obtener favoritos del context

  // === FUNCIÓN PARA CARGAR DATOS ===
  const loadPokemonData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      
      console.log('🚀 [PokemonContext] Iniciando carga de datos...')
      
      // Cargar Pokémon usando nuestra API
      const pokemonWithDetails = await getFirstPokemonWithDetails(50)
      
      // Extraer tipos únicos
      const uniqueTypes = extractUniqueTypes(pokemonWithDetails)
      
      // Actualizar estado
      dispatch({ type: 'SET_POKEMON_LIST', payload: pokemonWithDetails })
      dispatch({ type: 'SET_AVAILABLE_TYPES', payload: uniqueTypes })
      
      console.log('✅ [PokemonContext] Datos cargados exitosamente:', {
        pokemon: pokemonWithDetails.length,
        types: uniqueTypes.length
      })
      
    } catch (err) {
      console.error('❌ [PokemonContext] Error cargando datos:', err)
      
      if (err instanceof PokemonApiError) {
        dispatch({ type: 'SET_ERROR', payload: `Error de API: ${err.message}` })
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Error inesperado al cargar los Pokémon' })
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // === FUNCIONES DE FILTRADO ===
  const updateFilteredPokemon = (
    pokemonList: Pokemon[], 
    searchTerm: string, 
    selectedType: string, 
    showFavoritesOnly: boolean,
    favoriteIds: number[]
  ) => {
    let result = pokemonList

    // Aplicar búsqueda
    if (searchTerm.trim() !== '') {
      result = searchPokemon(result, searchTerm)
      console.log(`🔍 [PokemonContext] Búsqueda "${searchTerm}": ${result.length} resultados`)
    }

    // Aplicar filtro de tipo
    if (selectedType !== '') {
      result = filterPokemonByType(result, selectedType)
      console.log(`🏷️ [PokemonContext] Filtro tipo "${selectedType}": ${result.length} resultados`)
    }

    // Aplicar filtro de favoritos
    if (showFavoritesOnly) {
      result = result.filter(pokemon => favoriteIds.includes(pokemon.id))
      console.log(`⭐ [PokemonContext] Solo favoritos: ${result.length} resultados`)
    }

    dispatch({ type: 'UPDATE_FILTERED_POKEMON', payload: result })
  }

  // === ACCIONES ===
  const actions = {
    loadPokemonData,
    
    setSearchTerm: (term: string) => {
      dispatch({ type: 'SET_SEARCH_TERM', payload: term })
    },
    
    setSelectedType: (type: string) => {
      dispatch({ type: 'SET_SELECTED_TYPE', payload: type })
    },
    
    setShowFavoritesOnly: (show: boolean) => {
      dispatch({ type: 'SET_SHOW_FAVORITES_ONLY', payload: show })
    },
    
    refreshData: async () => {
      await loadPokemonData()
    }
  }

  // === CARGAR DATOS AL MONTAR ===
  useEffect(() => {
    loadPokemonData()
  }, [])

  // === ACTUALIZAR CUANDO CAMBIAN LOS FAVORITOS ===
  useEffect(() => {
    if (state.pokemonList.length > 0) {
      updateFilteredPokemon(
        state.pokemonList,
        state.searchTerm,
        state.selectedType,
        state.showFavoritesOnly,
        favoritesState.favoriteIds
      )
    }
  }, [favoritesState.favoriteIds, state.pokemonList, state.searchTerm, state.selectedType, state.showFavoritesOnly])

  // === CONTEXT VALUE ===
  const value: PokemonContextType = {
    state,
    actions
  }

  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  )
}

// === HOOK PERSONALIZADO ===
export function usePokemon() {
  const context = useContext(PokemonContext)
  if (context === undefined) {
    throw new Error('usePokemon debe ser usado dentro de un PokemonProvider')
  }
  return context
}

// Evita warning de react-refresh/only-export-components
usePokemon.displayName = 'usePokemon'