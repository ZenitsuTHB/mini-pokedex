// === CLIENTE BASE PARA LA API ===
// Este archivo contiene la configuración base y funciones utilitarias para hacer peticiones HTTP

import type { ApiConfig } from './types'

// === CONFIGURACIÓN DE LA API ===
const API_CONFIG: ApiConfig = {
  baseUrl: 'https://pokeapi.co/api/v2',     // URL base de la PokéAPI
  timeout: 10000,                           // 10 segundos de timeout
  retries: 3                                // 3 intentos máximo
}

// === CLASE PARA MANEJAR ERRORES DE API ===
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

// === FUNCIÓN PARA HACER PETICIONES HTTP CON MANEJO DE ERRORES ===
// Esta función wrappea fetch() con manejo de errores, timeouts y reintentos
export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`
  
  // Configuración por defecto de la petición
  const defaultOptions: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    // Timeout usando AbortController
    signal: AbortSignal.timeout(API_CONFIG.timeout)
  }

  // Combinamos opciones por defecto con las opciones pasadas
  const finalOptions = { ...defaultOptions, ...options }

  // === FUNCIÓN INTERNA PARA HACER LA PETICIÓN CON REINTENTOS ===
  const makeRequest = async (attempt: number): Promise<T> => {
    try {
      console.log(`🌐 API Request [Attempt ${attempt}]: ${url}`)
      
      const response = await fetch(url, finalOptions)
      
      // === MANEJO DE CÓDIGOS DE ERROR HTTP ===
      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`
        
        // Mensajes específicos para códigos de error comunes
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

      // === PARSEAR RESPUESTA JSON ===
      const data = await response.json()
      console.log(`✅ API Response [Attempt ${attempt}]: Success`)
      
      return data
      
    } catch (error) {
      console.error(`❌ API Error [Attempt ${attempt}]:`, error)
      
      // Si es el último intento, lanzamos el error
      if (attempt >= API_CONFIG.retries) {
        if (error instanceof PokemonApiError) {
          throw error
        }
        
        // Manejo de errores de red
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new PokemonApiError(
            'Error de conexión. Verifica tu conexión a internet',
            0,
            error.message
          )
        }
        
        // Manejo de timeout
        if (error instanceof DOMException && error.name === 'TimeoutError') {
          throw new PokemonApiError(
            'La petición tardó demasiado. Intenta de nuevo',
            0,
            'Request timeout'
          )
        }
        
        // Error genérico
        throw new PokemonApiError(
          'Error inesperado al cargar datos',
          0,
          error instanceof Error ? error.message : 'Unknown error'
        )
      }
      
      // Si no es el último intento, esperamos un poco y reintentamos
      const delay = Math.pow(2, attempt) * 1000 // Backoff exponencial: 1s, 2s, 4s...
      console.log(`⏳ Retrying in ${delay}ms...`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
      return makeRequest(attempt + 1)
    }
  }

  // Iniciamos la petición con el primer intento
  return makeRequest(1)
}

// === FUNCIONES UTILITARIAS ===

// Función para construir URLs con parámetros de consulta
export function buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
  const url = new URL(endpoint, API_CONFIG.baseUrl)
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value))
  })
  
  return url.toString().replace(API_CONFIG.baseUrl, '') // Retornamos solo el endpoint relativo
}

// Función para extraer ID de una URL de la PokéAPI
// Ejemplo: "https://pokeapi.co/api/v2/pokemon/25/" → 25
export function extractIdFromUrl(url: string): number {
  const matches = url.match(/\/(\d+)\/?$/)
  return matches ? parseInt(matches[1], 10) : 0
}

// Función para formatear nombres de Pokémon
// Ejemplo: "pikachu" → "Pikachu", "mr-mime" → "Mr. Mime"
export function formatPokemonName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// === EXPORTAR CONFIGURACIÓN PARA USO EXTERNO ===
export const getApiConfig = (): ApiConfig => ({ ...API_CONFIG })

// Función para actualizar configuración (útil para testing)
export function updateApiConfig(newConfig: Partial<ApiConfig>): void {
  Object.assign(API_CONFIG, newConfig)
}