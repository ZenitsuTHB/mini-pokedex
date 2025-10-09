import { useNavigate } from 'react-router-dom'
import type { Pokemon } from '../api'
import { useFavorites, useSelectedPokemon } from '../context'

interface PokemonCardProps {
  pokemon: Pokemon
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const navigate = useNavigate()
  const { actions: favoritesActions } = useFavorites()
  const { actions: selectedActions } = useSelectedPokemon()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    favoritesActions.toggleFavorite(pokemon.id)
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
    >
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 ${
          favoritesActions.isFavorite(pokemon.id)
            ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-500 shadow-yellow-200'
            : 'bg-white border-2 border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={`text-lg transition-all duration-300 ${
          favoritesActions.isFavorite(pokemon.id) 
            ? 'text-yellow-700 drop-shadow-sm' 
            : 'text-gray-300 hover:text-gray-400'
        }`}>
          ⭐
        </span>
      </button>

      <div className="p-6 text-center">
        <div className="mb-4 relative">
          <img
            src={pokemon.sprites.front_default || '/placeholder-pokemon.png'}
            alt={pokemon.name}
            className="w-32 h-32 mx-auto object-contain transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-pokemon.png'
            }}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-display font-bold text-gray-800 capitalize">
            {pokemon.name}
          </h3>

          <div className="flex gap-2 justify-center flex-wrap mb-3">
            {pokemon.types.map((typeInfo, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(typeInfo.type.name)}`}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              selectedActions.selectPokemon(pokemon)
              navigate(`/pokemon/${pokemon.id}`)
            }}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full transition-colors duration-200"
          >
            View Details
          </button>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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