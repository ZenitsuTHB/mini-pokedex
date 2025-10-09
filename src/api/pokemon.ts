// API para interactuar con la PokéAPI

import { apiRequest, extractIdFromUrl } from './client'
import type { 
  Pokemon, 
  PokemonListResponse, 
  PokemonListItem,
  TypeResponse 
} from './types'

/**
 * Obtiene una lista paginada de Pokémon
 */
export async function getPokemonList(
  limit: number = 50, 
  offset: number = 0
): Promise<PokemonListResponse> {
  const endpoint = `/pokemon?limit=${limit}&offset=${offset}`
  const response = await apiRequest<PokemonListResponse>(endpoint)
  
  console.log(`✅ Pokemon list fetched: ${response.results.length} items`)
  return response
}

/**
 * Obtiene los detalles completos de un Pokémon específico
 */
export async function getPokemonDetails(identifier: string | number): Promise<Pokemon> {
  const endpoint = `/pokemon/${identifier}`
  const response = await apiRequest<Pokemon>(endpoint)
  return response
}

/**
 * Obtiene los detalles de múltiples Pokémon en paralelo
 */
export async function getPokemonListWithDetails(
  pokemonList: PokemonListItem[]
): Promise<Pokemon[]> {
  const pokemonDetails = await Promise.all(
    pokemonList.map(async (pokemon) => {
      const id = extractIdFromUrl(pokemon.url)
      return getPokemonDetails(id || pokemon.name)
    })
  )
  
  return pokemonDetails
}

/**
 * Obtiene los primeros N Pokémon con todos sus detalles
 */
export async function getFirstPokemonWithDetails(count: number = 50): Promise<Pokemon[]> {
  const listResponse = await getPokemonList(count, 0)
  const pokemonWithDetails = await getPokemonListWithDetails(listResponse.results)
  
  return pokemonWithDetails
}

/**
 * Obtiene información de un tipo específico de Pokémon
 */
export async function getPokemonType(typeName: string): Promise<TypeResponse> {
  const endpoint = `/type/${typeName}`
  const response = await apiRequest<TypeResponse>(endpoint)
  
  return response
}

/**
 * Obtiene la lista de todos los tipos disponibles
 */
export async function getAllPokemonTypes(): Promise<string[]> {
  const endpoint = '/type'
  const response = await apiRequest<{ results: Array<{ name: string }> }>(endpoint)
  
  const typeNames = response.results.map(type => type.name)
  
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
