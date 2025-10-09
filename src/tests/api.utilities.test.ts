// === TESTS PARA FUNCIONES UTILITARIAS DE LA API ===
// Estos tests verifican que las funciones helper funcionen correctamente

import { describe, it, expect } from 'vitest'
import {
  extractIdFromUrl,
  formatPokemonName,
  buildUrl
} from '../api/client'
import {
  searchPokemon,
  filterPokemonByType,
  extractUniqueTypes,
  convertHeight,
  convertWeight,
  formatPokemonId
} from '../api/pokemon'
import type { Pokemon } from '../api/types'

describe('🔧 API Utilities', () => {
  
  describe('extractIdFromUrl', () => {
    it('debe extraer ID correctamente de URLs válidas', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/1/')).toBe(1)
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/150/')).toBe(150)
    })

    it('debe retornar 0 para URLs inválidas', () => {
      expect(extractIdFromUrl('https://pokeapi.co/api/v2/pokemon/')).toBe(0)
      expect(extractIdFromUrl('invalid-url')).toBe(0)
      expect(extractIdFromUrl('')).toBe(0)
    })
  })

  describe('formatPokemonName', () => {
    it('debe formatear nombres simples correctamente', () => {
      expect(formatPokemonName('pikachu')).toBe('Pikachu')
      expect(formatPokemonName('bulbasaur')).toBe('Bulbasaur')
    })

    it('debe formatear nombres con guiones', () => {
      expect(formatPokemonName('mr-mime')).toBe('Mr Mime')
      expect(formatPokemonName('ho-oh')).toBe('Ho Oh')
    })
  })

  describe('buildUrl', () => {
    it('debe construir URLs sin parámetros', () => {
      expect(buildUrl('/pokemon')).toBe('/pokemon')
      expect(buildUrl('/type')).toBe('/type')
    })

    it('debe construir URLs con parámetros', () => {
      const url = buildUrl('/pokemon', { limit: 50, offset: 0 })
      expect(url).toContain('limit=50')
      expect(url).toContain('offset=0')
    })
  })

  describe('convertHeight', () => {
    it('debe convertir decímetros a metros', () => {
      expect(convertHeight(10)).toBe(1) // 10 decímetros = 1 metro
      expect(convertHeight(35)).toBe(3.5) // 35 decímetros = 3.5 metros
    })
  })

  describe('convertWeight', () => {
    it('debe convertir hectogramos a kilogramos', () => {
      expect(convertWeight(10)).toBe(1) // 10 hectogramos = 1 kg
      expect(convertWeight(690)).toBe(69) // 690 hectogramos = 69 kg
    })
  })

  describe('formatPokemonId', () => {
    it('debe formatear IDs con ceros a la izquierda', () => {
      expect(formatPokemonId(1)).toBe('001')
      expect(formatPokemonId(25)).toBe('025')
      expect(formatPokemonId(150)).toBe('150')
    })

    it('debe usar padding personalizado', () => {
      expect(formatPokemonId(1, 4)).toBe('0001')
      expect(formatPokemonId(1, 2)).toBe('01')
    })
  })
})

describe('🔍 Pokemon Search & Filter Functions', () => {
  
  // Datos de test - creamos un tipo simplificado para tests
  const mockPokemonList: Pokemon[] = [
    {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      base_experience: 64,
      order: 1,
      sprites: { front_default: 'url1' },
      types: [{ slot: 1, type: { name: 'grass', url: '' } }, { slot: 2, type: { name: 'poison', url: '' } }],
      stats: [],
      abilities: []
    },
    {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      order: 35,
      sprites: { front_default: 'url2' },
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      stats: [],
      abilities: []
    },
    {
      id: 6,
      name: 'charizard',
      height: 17,
      weight: 905,
      base_experience: 267,
      order: 7,
      sprites: { front_default: 'url3' },
      types: [{ slot: 1, type: { name: 'fire', url: '' } }, { slot: 2, type: { name: 'flying', url: '' } }],
      stats: [],
      abilities: []
    }
  ]

  describe('searchPokemon', () => {
    it('debe buscar Pokémon por nombre exacto', () => {
      const result = searchPokemon(mockPokemonList, 'pikachu')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('pikachu')
    })

    it('debe buscar Pokémon por nombre parcial', () => {
      const result = searchPokemon(mockPokemonList, 'pika')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('pikachu')
    })

    it('debe ser case-insensitive por defecto', () => {
      const result = searchPokemon(mockPokemonList, 'PIKACHU')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('pikachu')
    })

    it('debe retornar lista completa si el término está vacío', () => {
      const result = searchPokemon(mockPokemonList, '')
      expect(result).toHaveLength(3)
    })

    it('debe retornar array vacío si no encuentra coincidencias', () => {
      const result = searchPokemon(mockPokemonList, 'mew')
      expect(result).toHaveLength(0)
    })
  })

  describe('filterPokemonByType', () => {
    it('debe filtrar Pokémon por tipo específico', () => {
      const result = filterPokemonByType(mockPokemonList, 'fire')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('charizard')
    })

    it('debe encontrar Pokémon con múltiples tipos', () => {
      const result = filterPokemonByType(mockPokemonList, 'poison')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('bulbasaur')
    })

    it('debe retornar lista completa si no se especifica tipo', () => {
      const result = filterPokemonByType(mockPokemonList, '')
      expect(result).toHaveLength(3)
    })

    it('debe retornar array vacío si no encuentra el tipo', () => {
      const result = filterPokemonByType(mockPokemonList, 'water')
      expect(result).toHaveLength(0)
    })
  })

  describe('extractUniqueTypes', () => {
    it('debe extraer todos los tipos únicos', () => {
      const result = extractUniqueTypes(mockPokemonList)
      expect(result).toContain('grass')
      expect(result).toContain('poison')
      expect(result).toContain('electric')
      expect(result).toContain('fire')
      expect(result).toContain('flying')
      expect(result).toHaveLength(5)
    })

    it('debe retornar tipos ordenados alfabéticamente', () => {
      const result = extractUniqueTypes(mockPokemonList)
      expect(result).toEqual(['electric', 'fire', 'flying', 'grass', 'poison'])
    })

    it('debe retornar array vacío si no hay Pokémon', () => {
      const result = extractUniqueTypes([])
      expect(result).toHaveLength(0)
    })
  })
})