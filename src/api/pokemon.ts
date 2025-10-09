// === API ESPECÍFICA PARA POKÉMON ===
// Este archivo contiene todas las funciones para interactuar con la PokéAPI
// Cada función representa un endpoint específico y maneja su lógica particular

import { apiRequest, buildUrl, extractIdFromUrl } from './client'
import type { 
  Pokemon, 
  PokemonListResponse, 
  PokemonListItem,
  TypeResponse 
} from './types'

// === FUNCIONES PRINCIPALES DE LA API ===

/**
 * Obtiene una lista paginada de Pokémon
 * @param limit - Número máximo de Pokémon a obtener (por defecto 50)
 * @param offset - Número de Pokémon a saltar (para paginación, por defecto 0)
 * @returns Promise con la lista de Pokémon y metadatos de paginación
 */
export async function getPokemonList(
  limit: number = 50, 
  offset: number = 0
): Promise<PokemonListResponse> {
  console.log(`Fetching Pokemon list: limit=${limit}, offset=${offset}`)
  
  const endpoint = buildUrl('/pokemon', { limit, offset })
  const response = await apiRequest<PokemonListResponse>(endpoint)
  
  console.log(`Pokemon list fetched: ${response.results.length} items`)
  return response
}

/**
 * Obtiene los detalles completos de un Pokémon específico
 * @param identifier - Puede ser el ID (número) o el nombre (string) del Pokémon
 * @returns Promise con todos los datos del Pokémon
 */
export async function getPokemonDetails(identifier: string | number): Promise<Pokemon> {
  console.log(`Fetching Pokemon details for: ${identifier}`)
  
  const endpoint = `/pokemon/${identifier}`
  const response = await apiRequest<Pokemon>(endpoint)
  
  console.log(`Pokemon details fetched: ${response.name} (#${response.id})`)
  return response
}

/**
 * Obtiene los detalles de múltiples Pokémon en paralelo
 * Esta función es muy útil para cargar la lista inicial con todos los detalles
 * @param pokemonList - Array de objetos con name y url de cada Pokémon
 * @returns Promise con array de Pokémon completos
 */
export async function getPokemonListWithDetails(
  pokemonList: PokemonListItem[]
): Promise<Pokemon[]> {
  console.log(`Fetching details for ${pokemonList.length} Pokemon in parallel`)
  
  // Usamos Promise.all para hacer todas las peticiones en paralelo
  // Esto es mucho más eficiente que hacerlas una por una
  const pokemonDetails = await Promise.all(
    pokemonList.map(async (pokemon) => {
      // Extraemos el ID de la URL para usar como identificador
      const id = extractIdFromUrl(pokemon.url)
      return getPokemonDetails(id || pokemon.name)
    })
  )
  
  console.log(`All Pokemon details fetched: ${pokemonDetails.length} items`)
  return pokemonDetails
}

/**
 * Función conveniente para obtener los primeros N Pokémon con todos sus detalles
 * Esta función combina getPokemonList + getPokemonListWithDetails
 * @param count - Número de Pokémon a obtener (por defecto 50)
 * @returns Promise con array de Pokémon completos
 */
export async function getFirstPokemonWithDetails(count: number = 50): Promise<Pokemon[]> {
  console.log(`Starting to fetch first ${count} Pokemon with full details`)
  
  // PASO 1: Obtener la lista básica
  const listResponse = await getPokemonList(count, 0)
  
  // PASO 2: Obtener detalles de todos los Pokémon
  const pokemonWithDetails = await getPokemonListWithDetails(listResponse.results)
  
  console.log(`Successfully fetched ${pokemonWithDetails.length} Pokemon with full details`)
  return pokemonWithDetails
}

/**
 * Obtiene información de un tipo específico de Pokémon
 * @param typeName - Nombre del tipo (fire, water, grass, etc.)
 * @returns Promise con información del tipo y lista de Pokémon que lo tienen
 */
export async function getPokemonType(typeName: string): Promise<TypeResponse> {
  console.log(`Fetching type information for: ${typeName}`)
  
  const endpoint = `/type/${typeName}`
  const response = await apiRequest<TypeResponse>(endpoint)
  
  console.log(`Type information fetched: ${typeName} (${response.pokemon.length} Pokemon)`)
  return response
}

/**
 * Obtiene la lista de todos los tipos disponibles
 * @returns Promise con array de nombres de tipos
 */
export async function getAllPokemonTypes(): Promise<string[]> {
  console.log(`Fetching all available Pokemon types`)
  
  const endpoint = '/type'
  const response = await apiRequest<{ results: Array<{ name: string }> }>(endpoint)
  
  const typeNames = response.results.map(type => type.name)
  console.log(`All types fetched: ${typeNames.length} types`)
  
  return typeNames
}

/**
 * Busca Pokémon por nombre (usando la lista cargada localmente)
 * Esta función no hace peticiones a la API, sino que filtra datos ya cargados
 * @param pokemonList - Lista de Pokémon donde buscar
 * @param searchTerm - Término de búsqueda
 * @param caseSensitive - Si la búsqueda debe ser sensible a mayúsculas (por defecto false)
 * @returns Array de Pokémon que coinciden con la búsqueda
 */
export function searchPokemon(
  pokemonList: Pokemon[], 
  searchTerm: string, 
  caseSensitive: boolean = false
): Pokemon[] {
  if (!searchTerm.trim()) {
    return pokemonList
  }
  
  const normalizedSearch = caseSensitive ? searchTerm : searchTerm.toLowerCase()
  
  return pokemonList.filter(pokemon => {
    const pokemonName = caseSensitive ? pokemon.name : pokemon.name.toLowerCase()
    return pokemonName.includes(normalizedSearch)
  })
}

/**
 * Filtra Pokémon por tipo
 * @param pokemonList - Lista de Pokémon a filtrar
 * @param typeName - Nombre del tipo a filtrar
 * @returns Array de Pokémon que tienen el tipo especificado
 */
export function filterPokemonByType(pokemonList: Pokemon[], typeName: string): Pokemon[] {
  if (!typeName) {
    return pokemonList
  }
  
  return pokemonList.filter(pokemon => 
    pokemon.types.some(type => type.type.name === typeName)
  )
}

/**
 * Extrae todos los tipos únicos de una lista de Pokémon
 * @param pokemonList - Lista de Pokémon
 * @returns Array de nombres de tipos únicos, ordenados alfabéticamente
 */
export function extractUniqueTypes(pokemonList: Pokemon[]): string[] {
  const allTypes = pokemonList.flatMap(pokemon => 
    pokemon.types.map(type => type.type.name)
  )
  
  return [...new Set(allTypes)].sort()
}

// === FUNCIONES UTILITARIAS DE DATOS ===

/**
 * Convierte altura de decímetros a metros
 * @param heightInDecimeters - Altura en decímetros (como viene de la API)
 * @returns Altura en metros
 */
export function convertHeight(heightInDecimeters: number): number {
  return heightInDecimeters / 10
}

/**
 * Convierte peso de hectogramos a kilogramos
 * @param weightInHectograms - Peso en hectogramos (como viene de la API)
 * @returns Peso en kilogramos
 */
export function convertWeight(weightInHectograms: number): number {
  return weightInHectograms / 10
}

/**
 * Formatea el ID del Pokémon con ceros a la izquierda
 * @param id - ID del Pokémon
 * @param padding - Número de dígitos total (por defecto 3)
 * @returns ID formateado (ej: 001, 025, 150)
 */
export function formatPokemonId(id: number, padding: number = 3): string {
  return id.toString().padStart(padding, '0')
}
