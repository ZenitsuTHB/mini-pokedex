// === HOME PAGE ===
// Página principal con la lista de Pokemon

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

  // === RENDERIZADO CONDICIONAL: ESTADO DE CARGA ===
  if (loading) {
    return (
      <LoadingSpinner 
        fullScreen 
        message="Cargando Pokémon..." 
        size="large"
      />
    )
  }

  // === RENDERIZADO CONDICIONAL: ESTADO DE ERROR ===
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
        {/* === HEADER === */}
        <header className="text-center text-white mb-8">
          <h1 className="text-5xl font-display font-bold mb-2">Mini Pokédex</h1>
          <p className="text-xl text-blue-100">
            Descobreix el món dels Pokémon
          </p>
          
          {/* === CAMPO DE BÚSQUEDA === */}
          <div className="mt-4">
            <SearchInput 
              placeholder="Buscar Pokémon..."
              className="w-full max-w-xs"
            />
          </div>

          {/* === FILTRO POR TIPO === */}
          <div className="mt-6">
            <TypeFilter />
          </div>
        </header>

        {/* === GRID PRINCIPAL DE POKÉMON === */}
        {filteredPokemon.length === 0 && (searchTerm.trim() !== '' || selectedType !== '' || showFavoritesOnly) ? (
          // Mensaje cuando no se encuentran coincidencias
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-md">
              <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
                {showFavoritesOnly && favoriteIds.length === 0 
                  ? "No tens favorits"
                  : "No s'han trobat pokémons"
                }
              </h3>
              <p className="text-gray-600">
                {showFavoritesOnly && favoriteIds.length === 0 
                  ? "Afegeix alguns Pokémon als teus favorits fent clic a l'estrella ⭐"
                  : showFavoritesOnly
                    ? `No hi ha favorits que coincideixin amb els filtres aplicats`
                    : searchTerm.trim() !== '' && selectedType !== '' 
                      ? `No hi ha cap pokémon que coincideixi amb "${searchTerm}" del tipus ${selectedType}`
                      : searchTerm.trim() !== '' 
                        ? `No hi ha cap pokémon que coincideixi amb "${searchTerm}"`
                        : `No hi ha cap pokémon del tipus ${selectedType}`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* Iteramos sobre cada Pokémon filtrado y usamos nuestro componente reutilizable */}
            {filteredPokemon.map((pokemon) => (
              <PokemonCard 
                key={pokemon.id}
                pokemon={pokemon}
              />
            ))}
          </div>
        )}

        {/* === FOOTER === */}
        <footer className="text-center py-8 text-blue-100">
          <p>
            Mostrando {filteredPokemon.length} Pokémon
            {showFavoritesOnly ? ' favorits' : ''}
            {(searchTerm.trim() !== '' || selectedType !== '' || showFavoritesOnly) && ` (de ${pokemonList.length} totals)`}
            {selectedType !== '' && ` - Tipus: ${selectedType}`}
            {favoriteIds.length > 0 && !showFavoritesOnly && ` | ${favoriteIds.length} favorits`}
          </p>
        </footer>
      </div>
    </div>
  )
}