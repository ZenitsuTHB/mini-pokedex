import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { usePokemon, useSelectedPokemon, useFavorites } from '../context'
import { LoadingSpinner, ErrorMessage } from '../components'
import { getPokemonDetails, convertHeight, convertWeight, formatPokemonId } from '../api'
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

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pokemon, setPokemon] = useState<Pokemon | null>(selectedPokemon)

  const loadPokemonDetails = useCallback(async (pokemonId: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const pokemonData = await getPokemonDetails(pokemonId)
      selectedActions.selectPokemon(pokemonData)
      setPokemon(pokemonData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [selectedActions])

  useEffect(() => {
    if (id) {
      const pokemonId = parseInt(id)
      const foundPokemon = pokemonList.find(p => p.id === pokemonId)
      
      if (foundPokemon && foundPokemon.id === selectedPokemon?.id) {
        setPokemon(foundPokemon)
      } else {
        loadPokemonDetails(pokemonId)
      }
    }
  }, [id, pokemonList, selectedPokemon, loadPokemonDetails])

  const handleGoBack = () => {
    navigate('/')
  }

  const handleToggleFavorite = () => {
    if (pokemon) {
      favoritesActions.toggleFavorite(pokemon.id)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600">
        <div className="container mx-auto px-4 py-8">
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600">
        <div className="container mx-auto px-4 py-8">
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
            onRetry={() => {
              if (id) {
                loadPokemonDetails(parseInt(id))
              }
            }}
          />
        </div>
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={handleGoBack}
              className="bg-white text-cc42-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              ← Volver
            </button>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-md">
              <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
                Pokémon no encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                No se pudo encontrar el Pokémon #{id}
              </p>
              <button
                onClick={handleGoBack}
                className="bg-cc42-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isFavorite = favoriteIds.includes(pokemon.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="bg-white text-cc42-blue px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            ← Volver
          </button>
          
          <button
            onClick={handleToggleFavorite}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
              isFavorite
                ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-800 shadow-lg border-2 border-yellow-500'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md border-2 border-gray-200'
            }`}
          >
            <span className={`text-lg ${isFavorite ? 'text-yellow-600' : 'text-gray-400'}`}>
              ⭐
            </span>
            {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 px-8 py-6 text-white">
              <span className="text-lg font-mono opacity-80">
                #{formatPokemonId(pokemon.id)}
              </span>
              <h1 className="text-4xl font-display font-bold capitalize mt-1">
                {pokemon.name}
              </h1>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="bg-gray-50 rounded-xl p-8 mb-6">
                  <img
                    src={pokemon.sprites.front_default || '/placeholder-pokemon.png'}
                    alt={pokemon.name}
                    className="w-48 h-48 mx-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-pokemon.png'
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Tipos</h3>
                    <div className="flex gap-2 justify-center">
                      {pokemon.types.map((typeInfo, index) => (
                        <span
                          key={index}
                          className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${getTypeColor(typeInfo.type.name)}`}
                        >
                          {typeInfo.type.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700">Altura</h4>
                      <p className="text-2xl font-bold text-gray-900">{convertHeight(pokemon.height)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700">Peso</h4>
                      <p className="text-2xl font-bold text-gray-900">{convertWeight(pokemon.weight)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Estadísticas</h3>
                <div className="space-y-4">
                  {pokemon.stats.map((stat, index) => {
                    const statName = getStatName(stat.stat.name)
                    const maxStat = 255
                    const percentage = (stat.base_stat / maxStat) * 100

                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-700">{statName}</span>
                          <span className="font-bold text-gray-900">{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${getStatColor(stat.stat.name)}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Habilidades</h3>
                  <div className="space-y-2">
                    {pokemon.abilities.map((abilityInfo, index) => (
                      <div
                        key={index}
                        className={`px-4 py-2 rounded-lg ${
                          abilityInfo.is_hidden 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        <span className="font-medium capitalize">
                          {abilityInfo.ability.name.replace('-', ' ')}
                        </span>
                        {abilityInfo.is_hidden && (
                          <span className="ml-2 text-xs bg-purple-200 px-2 py-1 rounded">
                            Oculta
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getTypeColor(type: string): string {
  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400',
    fighting: 'bg-red-500',
    flying: 'bg-indigo-400',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    rock: 'bg-yellow-800',
    bug: 'bg-green-400',
    ghost: 'bg-purple-700',
    steel: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    grass: 'bg-green-500',
    electric: 'bg-yellow-400',
    psychic: 'bg-pink-500',
    ice: 'bg-blue-300',
    dragon: 'bg-purple-600',
    dark: 'bg-gray-800',
    fairy: 'bg-pink-300',
  }
  
  return typeColors[type] || 'bg-gray-400'
}

function getStatName(statName: string): string {
  const statNames: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Ataque',
    'defense': 'Defensa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defensa Especial',
    'speed': 'Velocidad'
  }
  
  return statNames[statName] || statName
}

function getStatColor(statName: string): string {
  const statColors: Record<string, string> = {
    'hp': 'bg-green-500',
    'attack': 'bg-red-500',
    'defense': 'bg-blue-500',
    'special-attack': 'bg-purple-500',
    'special-defense': 'bg-yellow-500',
    'speed': 'bg-pink-500'
  }
  
  return statColors[statName] || 'bg-gray-500'
}