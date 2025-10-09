// === IMPORTS ===
// Importamos los hooks de Context API y los nuevos componentes
import './App.css'

// === DEBUG TEMPORAL ===
import './debug-api'

// === IMPORTAR CONTEXT HOOKS ===
import { 
  usePokemon,
  useFavorites,
  useSelectedPokemon
} from './context'

// === IMPORTAR COMPONENTES REUTILIZABLES ===
import {
  PokemonCard,
  SearchInput,
  TypeFilter,
  LoadingSpinner,
  ErrorMessage
} from './components'

// === IMPORTAR UTILIDADES DE LA API ===
import { 
  convertHeight,
  convertWeight,
  formatPokemonId
} from './api'

function App() {
  // === USAR CONTEXT HOOKS ===
  // Reemplazamos useState locales with hooks del Context API
  const { state: pokemonState, actions: pokemonActions } = usePokemon()
  const { state: favoritesState, actions: favoritesActions } = useFavorites()
  const { state: selectedPokemonState, actions: selectedPokemonActions } = useSelectedPokemon()

  // === DESTRUCTURING PARA FACILITAR USO ===
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
  const { selectedPokemon } = selectedPokemonState

  // === RENDERIZADO CONDICIONAL: ESTADO DE CARGA ===
  // Si estamos cargando, mostramos el spinner elegante
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
  // Si hay un error, mostramos mensaje de error con botón para reintentar
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={pokemonActions.refreshData}
        fullScreen
      />
    )
  }

  // === RENDERIZADO CONDICIONAL: PANTALLA DE DETALLE ===
  // Si hay un Pokémon seleccionado, mostramos la pantalla de detalle
  if (selectedPokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Botón para volver */}
          <button
            onClick={() => selectedPokemonActions.clearSelection()}
            className="mb-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            ← Tornar a la llista
          </button>

          {/* Tarjeta de detalle */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* === HEADER CON TÍTULO Y ESTRELLA ALINEADOS === */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              {/* Espacio izquierdo para equilibrar */}
              <div className="w-12"></div>
              
              {/* Título centrado */}
              <div className="flex-1 text-center">
                <span className="text-lg text-gray-500 font-mono block mb-1">
                  #{formatPokemonId(selectedPokemon.id)}
                </span>
                <h1 className="text-4xl font-display font-bold text-gray-800 capitalize">
                  {selectedPokemon.name}
                </h1>
              </div>
              
              {/* Estrella destacada */}
              <button
                onClick={() => favoritesActions.toggleFavorite(selectedPokemon.id)}
                className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 ${
                  favoritesActions.isFavorite(selectedPokemon.id) 
                    ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-500 shadow-yellow-200' 
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`text-2xl transition-all duration-300 ${
                  favoritesActions.isFavorite(selectedPokemon.id) 
                    ? 'text-yellow-700 drop-shadow-sm' 
                    : 'text-gray-400'
                }`}>
                  ⭐
                </span>
              </button>
            </div>

            {/* Sección de imagen */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 text-center">
              <img
                src={selectedPokemon.sprites.front_default}
                alt={selectedPokemon.name}
                className="w-48 h-48 mx-auto object-contain"
              />
            </div>

            {/* Sección de información */}
            <div className="p-8">
              <div className="text-center mb-6">

                {/* Tipos */}
                <div className="flex justify-center gap-3 mb-8">
                  {selectedPokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${getTypeColor(type.type.name)}`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>

                {/* === ESTADÍSTICAS FÍSICAS === */}
                {/* 🚀 NUEVA LÓGICA: Usamos funciones de conversión de nuestra API */}
                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Alçada</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {convertHeight(selectedPokemon.height).toFixed(1)} m
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-1">Pes</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {convertWeight(selectedPokemon.weight).toFixed(1)} kg
                    </p>
                  </div>
                </div>

                {/* === TABLA DE ESTADÍSTICAS === */}
                <div className="max-w-lg mx-auto">
                  <h3 className="text-2xl font-display font-bold text-gray-800 mb-4 text-center">
                    Stats
                  </h3>
                  <div className="space-y-3">
                    {selectedPokemon.stats.map((stat, index) => {
                      // Mapeo de nombres de estadísticas para mostrar nombres más amigables
                      const statNames: { [key: string]: string } = {
                        'hp': 'HP',
                        'attack': 'Attack',
                        'defense': 'Defense',
                        'special-attack': 'Sp. Attack',
                        'special-defense': 'Sp. Defense',
                        'speed': 'Speed'
                      }
                      
                      const statName = statNames[stat.stat.name] || stat.stat.name
                      const percentage = Math.min((stat.base_stat / 150) * 100, 100) // Máximo 150 para calcular porcentaje
                      
                      return (
                        <div key={index} className="flex items-center gap-3">
                          {/* Nombre de la estadística */}
                          <div className="w-20 text-sm font-semibold text-gray-700 text-right">
                            {statName}
                          </div>
                          
                          {/* Barra de progreso */}
                          <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          
                          {/* Valor numérico */}
                          <div className="w-8 text-sm font-bold text-gray-800 text-left">
                            {stat.base_stat}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // === RENDERIZADO PRINCIPAL: LISTA DE POKÉMON ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600 p-4">
      {/* Contenedor principal con ancho máximo y centrado */}
      <div className="max-w-7xl mx-auto">
        
        {/* === HEADER/CABECERA === */}
        <header className="text-center py-8">
          <h1 className="text-5xl font-display text-white font-bold mb-2">
            Mini Pokédex
          </h1>
          <p className="text-blue-100 text-lg">
            Descubre los primeros 50 Pokémon
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
        {/* Grid responsivo que se adapta al tamaño de pantalla:
            - móvil: 1 columna
            - sm: 2 columnas  
            - md: 3 columnas
            - lg: 4 columnas
            - xl: 5 columnas */}
        
        {/* Verificamos si hay Pokémon que coincidan con la búsqueda */}
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

// === FUNCIÓN HELPER TEMPORAL PARA COLORES DE TIPOS ===
function getTypeColor(type: string): string {
  const colors: { [key: string]: string } = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300'
  }
  return colors[type] || 'bg-gray-400'
}

export default App
