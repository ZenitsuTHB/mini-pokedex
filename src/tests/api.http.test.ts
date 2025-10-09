// === TESTS PARA FUNCIONES DE API HTTP ===
// Estos tests verifican que las peticiones HTTP funcionen correctamente

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  getPokemonList, 
  getPokemonDetails,
  getFirstPokemonWithDetails
} from '../api/pokemon'
import { PokemonApiError } from '../api/client'

// Mock de datos de respuesta de la API
const mockPokemonListResponse = {
  count: 1302,
  next: "https://pokeapi.co/api/v2/pokemon?offset=50&limit=50",
  previous: null,
  results: [
    {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
      name: "ivysaur", 
      url: "https://pokeapi.co/api/v2/pokemon/2/"
    }
  ]
}

const mockPokemonDetails = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  base_experience: 64,
  order: 1,
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
  },
  types: [
    {
      slot: 1,
      type: {
        name: "grass",
        url: "https://pokeapi.co/api/v2/type/12/"
      }
    },
    {
      slot: 2,
      type: {
        name: "poison",
        url: "https://pokeapi.co/api/v2/type/4/"
      }
    }
  ],
  stats: [
    {
      base_stat: 45,
      effort: 0,
      stat: {
        name: "hp",
        url: "https://pokeapi.co/api/v2/stat/1/"
      }
    }
  ],
  abilities: [
    {
      is_hidden: false,
      slot: 1,
      ability: {
        name: "overgrow",
        url: "https://pokeapi.co/api/v2/ability/65/"
      }
    }
  ]
}

describe('🌐 API HTTP Functions', () => {
  
  beforeEach(() => {
    // Limpiamos todos los mocks antes de cada test
    vi.clearAllMocks()
  })

  describe('getPokemonList', () => {
    it('debe obtener lista de Pokémon correctamente', async () => {
      // Configuramos el mock de fetch para que devuelva datos exitosos
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse
      } as Response)

      // Ejecutamos la función
      const result = await getPokemonList(2, 0)

      // Verificamos que fetch se llamó con los parámetros correctos
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/pokemon'),
        expect.objectContaining({
          method: 'GET'
        })
      )

      // Verificamos que el resultado tiene la estructura esperada
      expect(result).toEqual(mockPokemonListResponse)
      expect(result.results).toHaveLength(2)
    })

    it('debe usar parámetros por defecto', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse
      } as Response)

      await getPokemonList()

      // Verificamos que se usen los valores por defecto (limit=50, offset=0)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=50'),
        expect.anything()
      )
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('offset=0'),
        expect.anything()
      )
    })

    it('debe manejar errores de red correctamente', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockRejectedValueOnce(new TypeError('Network error'))

      // Verificamos que la función lance una excepción del tipo correcto
      await expect(getPokemonList()).rejects.toThrow(PokemonApiError)
      await expect(getPokemonList()).rejects.toThrow('Error de conexión')
    })

    it('debe manejar errores HTTP correctamente', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response)

      await expect(getPokemonList()).rejects.toThrow(PokemonApiError)
      await expect(getPokemonList()).rejects.toThrow('Pokémon no encontrado')
    })
  })

  describe('getPokemonDetails', () => {
    it('debe obtener detalles de Pokémon por ID', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails
      } as Response)

      const result = await getPokemonDetails(1)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/pokemon/1'),
        expect.anything()
      )
      expect(result).toEqual(mockPokemonDetails)
      expect(result.name).toBe('bulbasaur')
      expect(result.id).toBe(1)
    })

    it('debe obtener detalles de Pokémon por nombre', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonDetails
      } as Response)

      const result = await getPokemonDetails('bulbasaur')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/pokemon/bulbasaur'),
        expect.anything()
      )
      expect(result.name).toBe('bulbasaur')
    })

    it('debe manejar Pokémon no encontrado', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response)

      await expect(getPokemonDetails('nonexistent')).rejects.toThrow(PokemonApiError)
      await expect(getPokemonDetails('nonexistent')).rejects.toThrow('Pokémon no encontrado')
    })
  })

  describe('getFirstPokemonWithDetails', () => {
    it('debe obtener lista con detalles completos', async () => {
      const mockFetch = vi.mocked(fetch)
      
      // Primera llamada: lista de Pokémon
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse
      } as Response)
      
      // Segunda y tercera llamada: detalles de cada Pokémon
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockPokemonDetails, id: 1, name: 'bulbasaur' })
      } as Response)
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockPokemonDetails, id: 2, name: 'ivysaur' })
      } as Response)

      const result = await getFirstPokemonWithDetails(2)

      // Verificamos que se hicieron 3 llamadas: 1 para la lista + 2 para detalles
      expect(mockFetch).toHaveBeenCalledTimes(3)
      
      // Verificamos que el resultado tiene los detalles completos
      expect(result).toHaveLength(2)
      expect(result[0]).toHaveProperty('sprites')
      expect(result[0]).toHaveProperty('types')
      expect(result[0]).toHaveProperty('stats')
    })

    it('debe usar valor por defecto de 50 Pokémon', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockPokemonListResponse, results: [] })
      } as Response)

      await getFirstPokemonWithDetails()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=50'),
        expect.anything()
      )
    })
  })

  describe('Reintentos y manejo de errores avanzado', () => {
    it('debe reintentar en caso de error temporal', async () => {
      const mockFetch = vi.mocked(fetch)
      
      // Primera llamada falla
      mockFetch.mockRejectedValueOnce(new TypeError('Network error'))
      
      // Segunda llamada es exitosa
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonListResponse
      } as Response)

      const result = await getPokemonList()

      // Verificamos que se hicieron 2 llamadas (la primera falló, la segunda fue exitosa)
      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(result).toEqual(mockPokemonListResponse)
    })

    it('debe fallar después del máximo número de reintentos', async () => {
      const mockFetch = vi.mocked(fetch)
      
      // Todas las llamadas fallan
      mockFetch.mockRejectedValue(new TypeError('Network error'))

      await expect(getPokemonList()).rejects.toThrow(PokemonApiError)
      
      // Verificamos que se hicieron 3 intentos (configuración por defecto)
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })
})