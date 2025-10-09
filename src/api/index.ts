// === PUNTO DE ENTRADA PRINCIPAL PARA LA API ===
// Este archivo exporta todas las funciones y tipos que la aplicación necesita
// Es el único archivo que necesitas importar desde otros componentes

// === EXPORTAR TIPOS ===
export type {
  Pokemon,
  PokemonListResponse,
  PokemonListItem,
  PokemonType,
  PokemonStat,
  PokemonAbility,
  TypeResponse,
  ApiError,
  ApiConfig
} from './types'

// === EXPORTAR FUNCIONES DE API ===
export {
  // Funciones principales para obtener datos
  getPokemonList,
  getPokemonDetails,
  getPokemonListWithDetails,
  getFirstPokemonWithDetails,
  getPokemonType,
  getAllPokemonTypes,
  
  // Funciones de filtrado y búsqueda (no hacen peticiones HTTP)
  searchPokemon,
  filterPokemonByType,
  extractUniqueTypes,
  
  // Funciones utilitarias para formatear datos
  convertHeight,
  convertWeight,
  formatPokemonId
} from './pokemon'

// === EXPORTAR UTILIDADES DEL CLIENTE ===
export {
  PokemonApiError,
  buildUrl,
  extractIdFromUrl,
  formatPokemonName,
  getApiConfig,
  updateApiConfig
} from './client'

// === FUNCIÓN CONVENIENTE PARA INICIALIZAR LA APP ===
// Esta función carga todos los datos iniciales que necesita la aplicación
export async function initializeAppData(pokemonCount: number = 50) {
  console.log(`🚀 Initializing app data with ${pokemonCount} Pokemon`)
  
  try {
    // Importamos la función principal
    const { getFirstPokemonWithDetails } = await import('./pokemon')
    
    // Cargamos los datos
    const pokemon = await getFirstPokemonWithDetails(pokemonCount)
    
    console.log(`✅ App data initialized successfully: ${pokemon.length} Pokemon loaded`)
    return pokemon
    
  } catch (error) {
    console.error('❌ Failed to initialize app data:', error)
    throw error
  }
}