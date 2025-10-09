// Cliente base para peticiones HTTP a la PokéAPI

import type { ApiConfig } from './types'

const API_CONFIG: ApiConfig = {
  baseUrl: 'https://pokeapi.co/api/v2',
  timeout: 10000,
  retries: 3
}

export class PokemonApiError extends Error {
  public status?: number
  public details?: string

  constructor(message: string, status?: number, details?: string) {
    super(message)
    this.name = 'PokemonApiError'
    this.status = status
    this.details = details
  }
}

export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_CONFIG.baseUrl}${endpoint}`
  
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Timeout usando AbortController
    signal: AbortSignal.timeout(API_CONFIG.timeout)
  }

  const finalOptions = { ...defaultOptions, ...options }

  const makeRequest = async (attempt: number): Promise<T> => {
    try {
      const response = await fetch(url, finalOptions)
      
      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`
        
        switch (response.status) {
          case 404:
            errorMessage = 'Pokémon no encontrado'
            break
          case 429:
            errorMessage = 'Demasiadas peticiones. Intenta de nuevo en un momento'
            break
          case 500:
            errorMessage = 'Error del servidor. Intenta de nuevo más tarde'
            break
          case 503:
            errorMessage = 'Servicio no disponible temporalmente'
            break
        }
        
        throw new PokemonApiError(
          errorMessage,
          response.status,
          `${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()
      return data
      
    } catch (error) {
      if (attempt >= API_CONFIG.retries) {
        if (error instanceof PokemonApiError) {
          throw error
        }
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new PokemonApiError(
            'Error de conexión. Verifica tu conexión a internet',
            0,
            error.message
          )
        }
        
        if (error instanceof DOMException && error.name === 'TimeoutError') {
          throw new PokemonApiError(
            'La petición tardó demasiado. Intenta de nuevo',
            0,
            'Request timeout'
          )
        }
        
        throw new PokemonApiError(
          'Error inesperado al cargar datos',
          0,
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
      
      const delay = Math.pow(2, attempt) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      return makeRequest(attempt + 1)
    }
  }

  return makeRequest(1)
}

// Construir URLs con parámetros de consulta
export function buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
  if (endpoint.startsWith('http')) {
    const url = new URL(endpoint)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
    return url.toString()
  }
  
  const url = new URL(endpoint, API_CONFIG.baseUrl)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value))
  })
  
  return url.toString()
}

// Extraer ID de una URL de la PokéAPI
export function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/?$/)
  return matches ? parseInt(matches[1], 10) : 0
}

// Formatear nombres de Pokémon
export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const getApiConfig = (): ApiConfig => ({ ...API_CONFIG })

export function updateApiConfig(newConfig: Partial<ApiConfig>): void {
  Object.assign(API_CONFIG, newConfig)
}