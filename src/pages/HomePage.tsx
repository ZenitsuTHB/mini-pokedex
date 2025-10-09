import { usePokemon, useFavorites } from '../context'
import { PokemonCard, SearchInput, TypeFilter, LoadingSpinner, ErrorMessage } from '../components'

export function HomePage() {
  const { state: pokemonState, actions: pokemonActions } = usePokemon()
  const { state: favoritesState } = useFavorites()

  const {
    pokemonList,
    filteredPokemon,
    loading,
    error,
    searchTerm,
    selectedType,
    showFavoritesOnly
  } = pokemonState

  const { favoriteIds } = favoritesState

  if (loading) {
    return (
      <LoadingSpinner 
        fullScreen 
        message="Cargando Pokémon..." 
        size="large"
      />
    )
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={pokemonActions.refreshData}
        fullScreen
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center text-white mb-8">
          <h1 className="text-5xl font-display font-bold mb-2">Mini Pokédex</h1>
          <p className="text-xl text-blue-100">
            Descubre el mundo de los Pokémon
          </p>
          
          <div className="mt-4">
            <SearchInput 
              placeholder="Buscar Pokémon..."
              className="w-full max-w-xs"
            />
          </div>

          <div className="mt-6">
            <TypeFilter />
          </div>
        </header>

        {filteredPokemon.length === 0 && (searchTerm.trim() !== '' || selectedType !== '' || showFavoritesOnly) ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-md">
              <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
                {showFavoritesOnly && favoriteIds.length === 0 
                  ? "No tienes favoritos"
                  : "No se encontraron pokémons"
                }
              </h3>
              <p className="text-gray-600">
                {showFavoritesOnly && favoriteIds.length === 0 
                  ? "Agrega algunos Pokémon a tus favoritos haciendo clic en la estrella ⭐"
                  : showFavoritesOnly
                    ? `No hay favoritos que coincidan con los filtros aplicados`
                    : searchTerm.trim() !== '' && selectedType !== '' 
                      ? `No hay pokémons que coincidan con "${searchTerm}" del tipo ${selectedType}`
                      : searchTerm.trim() !== '' 
                        ? `No hay pokémons que coincidan con "${searchTerm}"`
                        : `No hay pokémons del tipo ${selectedType}`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPokemon.map((pokemon) => (
              <PokemonCard 
                key={pokemon.id}
                pokemon={pokemon}
              />
            ))}
          </div>
        )}

        <footer className="text-center py-8 text-blue-100">
          <p>
            Mostrando {filteredPokemon.length} Pokémon
            {showFavoritesOnly ? ' favoritos' : ''}
            {(searchTerm.trim() !== '' || selectedType !== '' || showFavoritesOnly) && ` (de ${pokemonList.length} totales)`}
            {selectedType !== '' && ` - Tipo: ${selectedType}`}
            {favoriteIds.length > 0 && !showFavoritesOnly && ` | ${favoriteIds.length} favoritos`}
          </p>
        </footer>
      </div>
    </div>
  )
}