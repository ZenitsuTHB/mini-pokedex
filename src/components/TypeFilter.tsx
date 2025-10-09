// === TYPE FILTER COMPONENT ===
// Componente reutilizable para filtrar por tipos de Pokemon

import { usePokemon, useFavorites } from '../context'

export function TypeFilter() {
  const { state: pokemonState, actions: pokemonActions } = usePokemon()
  const { state: favoritesState } = useFavorites()

  const { availableTypes, selectedType, showFavoritesOnly } = pokemonState
  const { favoriteIds } = favoritesState

  return (
    <div className="space-y-4">
      {/* === TÍTULO === */}
      <h3 className="text-blue-100 text-sm font-semibold mb-3">
        Filtrar per tipus:
      </h3>
      
      {/* === BOTONES TODOS Y FAVORITOS === */}
      <div className="flex gap-3 justify-center mb-4">
        <button
          onClick={() => pokemonActions.setShowFavoritesOnly(false)}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            !showFavoritesOnly 
              ? 'bg-white text-blue-600 shadow-lg' 
              : 'bg-blue-300 text-white hover:bg-white hover:text-blue-600'
          }`}
        >
          Tots els Pokémon
        </button>
        
        <button
          onClick={() => pokemonActions.setShowFavoritesOnly(true)}
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
            showFavoritesOnly 
              ? 'bg-white text-blue-600 shadow-lg' 
              : favoriteIds.length > 0
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg hover:from-yellow-500 hover:to-yellow-600 border-2 border-yellow-300'
                : 'bg-blue-300 text-white hover:bg-white hover:text-blue-600'
          }`}
          disabled={favoriteIds.length === 0}
        >
          <span className={favoriteIds.length > 0 && !showFavoritesOnly ? 'animate-pulse' : ''}>⭐</span>
          Favorits ({favoriteIds.length})
        </button>
      </div>

      {/* === FILTROS DE TIPO === */}
      <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
        {/* Botón "Todos" los tipos */}
        <button
          onClick={() => pokemonActions.setSelectedType('')}
          className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
            selectedType === '' 
              ? 'bg-white text-blue-600 underline decoration-2 underline-offset-2' 
              : 'bg-blue-400 text-white hover:bg-blue-300 hover:underline hover:decoration-2 hover:underline-offset-2'
          }`}
        >
          Tots els tipus
        </button>
        
        {/* Botones de tipos */}
        {availableTypes.length > 0 ? (
          availableTypes.map((type) => (
            <button
              key={type}
              onClick={() => pokemonActions.setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 capitalize ${
                selectedType === type 
                  ? 'bg-white text-blue-600 underline decoration-2 underline-offset-2' 
                  : 'bg-blue-400 text-white hover:bg-blue-300 hover:underline hover:decoration-2 hover:underline-offset-2'
              }`}
            >
              {type}
            </button>
          ))
        ) : (
          <span className="text-blue-100 text-sm">Carregant tipus...</span>
        )}
      </div>

      {/* === INDICADOR DE FILTROS ACTIVOS === */}
      {(selectedType || showFavoritesOnly) && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500 bg-opacity-50 text-blue-100 px-3 py-1 rounded-full text-xs">
            <span>Filtros activos:</span>
            {selectedType && (
              <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full capitalize">
                {selectedType}
              </span>
            )}
            {showFavoritesOnly && (
              <span className="bg-yellow-400 text-yellow-800 px-2 py-0.5 rounded-full">
                ⭐ Favoritos
              </span>
            )}
            <button
              onClick={() => {
                pokemonActions.setSelectedType('')
                pokemonActions.setShowFavoritesOnly(false)
              }}
              className="ml-1 text-blue-200 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}