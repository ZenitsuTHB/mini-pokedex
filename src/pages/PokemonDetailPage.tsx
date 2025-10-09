// === POKEMON DETAIL PAGE ===
// Página detallada de un Pokemon individual

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePokemon, useSelectedPokemon, useFavorites } from '../context'
import { LoadingSpinner, ErrorMessage } from '../components'
import { getPokemonDetails } from '../api'
import type { Pokemon } from '../api'

export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { state: pokemonState } = usePokemon()
  const { state: selectedState, actions: selectedActions } = useSelectedPokemon()
  const { actions: favoritesActions, state: favoritesState } = useFavorites()

  const { pokemonList } = pokemonState
  const { selectedPokemon } = selectedState
  const { favoriteIds } = favoritesState

  // Estados locales para esta página
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pokemon, setPokemon] = useState<Pokemon | null>(selectedPokemon)

  // === EFECTOS ===
  useEffect(() => {
    if (id) {
      const pokemonId = parseInt(id)
      
      // Buscar en la lista cargada primero
      const foundPokemon = pokemonList.find(p => p.id === pokemonId)
      
      if (foundPokemon) {
        selectedActions.selectPokemon(foundPokemon)
        setPokemon(foundPokemon)
        setError(null)
      } else {
        // Si no lo encontramos, cargar desde API
        loadPokemonDetails(pokemonId)
      }
    }
  }, [id, pokemonList, selectedActions])

  const loadPokemonDetails = async (pokemonId: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const pokemonData = await getPokemonDetails(pokemonId)
      selectedActions.selectPokemon(pokemonData)
      setPokemon(pokemonData)
    } catch (err) {
      console.error('Error cargando detalles del Pokémon:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  // === HANDLERS ===
  const handleGoBack = () => {
    navigate('/')
  }

  const handleToggleFavorite = () => {
    if (pokemon) {
      favoritesActions.toggleFavorite(pokemon.id)
    }
  }

  // === RENDERIZADO CONDICIONAL: ID INVÁLIDO ===
  if (!id || isNaN(parseInt(id))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600 flex items-center justify-center">
        <ErrorMessage
          message="ID de Pokémon no válido"
          onRetry={handleGoBack}
          fullScreen
        />
      </div>
    )
  }

  // === RENDERIZADO CONDICIONAL: ESTADO DE CARGA ===
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600">
        <div className="container mx-auto px-4 py-8">
          {/* Header con botón de volver */}
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="bg-white text-cc42-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              ← Volver
            </button>
          </div>
          
          <LoadingSpinner 
            message={`Cargando Pokémon #${id}...`} 
            size="large"
          />
        </div>
      </div>
    )
  }

  // === RENDERIZADO CONDICIONAL: ESTADO DE ERROR ===
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600">
        <div className="container mx-auto px-4 py-8">
          {/* Header con botón de volver */}
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="bg-white text-cc42-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              ← Volver
            </button>
          </div>
          
          <ErrorMessage
            message={error}
            onRetry={() => loadPokemonDetails(parseInt(id!))}
          />
        </div>
      </div>
    )
  }

  // === RENDERIZADO CONDICIONAL: POKEMON NO ENCONTRADO ===
  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600">
        <div className="container mx-auto px-4 py-8">
          {/* Header con botón de volver */}
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="bg-white text-cc42-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              ← Volver
            </button>
          </div>
          
          <ErrorMessage
            message={`Pokémon #${id} no encontrado`}
            onRetry={handleGoBack}
          />
        </div>
      </div>
    )
  }

  const isFavorite = favoriteIds.includes(pokemon.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600">
      <div className="container mx-auto px-4 py-8">
        {/* === HEADER CON NAVEGACIÓN === */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleGoBack}
            className="bg-white text-cc42-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            ← Volver
          </button>
          
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-all ${
              isFavorite 
                ? 'bg-yellow-400 text-yellow-800 hover:bg-yellow-300' 
                : 'bg-white text-gray-400 hover:bg-gray-100 hover:text-yellow-500'
            }`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <span className="text-2xl">
              {isFavorite ? '⭐' : '☆'}
            </span>
          </button>
        </div>

        {/* === CONTENIDO PRINCIPAL === */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* === HEADER DEL POKEMON === */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-bold text-gray-800 mb-2">
                {pokemon.name}
              </h1>
              <p className="text-lg text-gray-600">
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
            </div>

            {/* === IMAGEN Y DETALLES === */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Imagen */}
              <div className="text-center">
                <div className="bg-gray-50 rounded-xl p-8 mb-4">
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="w-48 h-48 mx-auto object-contain"
                    loading="lazy"
                  />
                </div>
                
                {/* Sprites adicionales si están disponibles */}
                {pokemon.sprites && (
                  <div className="grid grid-cols-2 gap-2">
                    {pokemon.sprites.front_shiny && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <img
                          src={pokemon.sprites.front_shiny}
                          alt={`${pokemon.name} shiny`}
                          className="w-16 h-16 mx-auto object-contain"
                          loading="lazy"
                        />
                        <p className="text-xs text-gray-500 mt-1">Shiny</p>
                      </div>
                    )}
                    {pokemon.sprites.back_default && (
                      <div className="bg-gray-50 rounded-lg p-2">
                        <img
                          src={pokemon.sprites.back_default}
                          alt={`${pokemon.name} back`}
                          className="w-16 h-16 mx-auto object-contain"
                          loading="lazy"
                        />
                        <p className="text-xs text-gray-500 mt-1">Back</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Detalles */}
              <div className="space-y-6">
                {/* Tipos */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Tipos</h3>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.types.map((typeInfo) => (
                      <span
                        key={typeInfo.type.name}
                        className="px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: `var(--color-type-${typeInfo.type.name})` }}
                      >
                        {typeInfo.type.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estadísticas básicas */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Información básica</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Altura</p>
                      <p className="font-semibold">{pokemon.height / 10} m</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Peso</p>
                      <p className="font-semibold">{pokemon.weight / 10} kg</p>
                    </div>
                  </div>
                </div>

                {/* Habilidades */}
                {pokemon.abilities && pokemon.abilities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Habilidades</h3>
                    <div className="space-y-2">
                      {pokemon.abilities.map((ability, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium">{ability.ability.name}</p>
                          {ability.is_hidden && (
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                              Oculta
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estadísticas */}
                {pokemon.stats && pokemon.stats.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Estadísticas</h3>
                    <div className="space-y-2">
                      {pokemon.stats.map((stat) => (
                        <div key={stat.stat.name} className="flex items-center">
                          <div className="w-20 text-sm text-gray-600">
                            {stat.stat.name.replace('-', ' ')}
                          </div>
                          <div className="flex-1 mx-3">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-cc42-blue h-2 rounded-full"
                                style={{ 
                                  width: `${Math.min((stat.base_stat / 200) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-12 text-sm font-medium text-right">
                            {stat.base_stat}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}