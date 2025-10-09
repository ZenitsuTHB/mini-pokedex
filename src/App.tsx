// === IMPORTS ===
// Importamos los hooks necesarios de React
import { useState, useEffect } from 'react'
import './App.css'

// === DEBUG TEMPORAL ===
import './debug-api'

// === IMPORTAR NUESTRA API MODULAR ===
// Ahora usamos nuestra API profesional en lugar de hacer fetch manualmente
import { 
  // Funciones principales de la API
  getFirstPokemonWithDetails,
  searchPokemon,
  filterPokemonByType,
  extractUniqueTypes,
  convertHeight,
  convertWeight,
  formatPokemonId,
  
  // Tipos TypeScript
  type Pokemon,
  
  // Manejo de errores
  PokemonApiError
} from './api'

function App() {
  // === ESTADOS DEL COMPONENTE ===
  // Estado para almacenar la lista completa de Pokémon con todos sus detalles
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')
  const [availableTypes, setAvailableTypes] = useState<string[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // === FUNCIÓN PRINCIPAL PARA OBTENER DATOS ===
  // Ahora usamos nuestra API modular en lugar de fetch manual
  const fetchPokemonList = async () => {
    try {
      // Activamos el estado de carga
      setLoading(true)
      
      // 🚀 NUEVA API: Una sola llamada obtiene todo lo que necesitamos
      // Antes: múltiples fetch manuales + manejo de errores complejo
      // Ahora: una función que maneja todo internamente
      console.log('🚀 Iniciando carga con nueva API...')
      const pokemonWithDetails = await getFirstPokemonWithDetails(50)
      
      // PASO 1: Guardamos los Pokémon
      setPokemonList(pokemonWithDetails)
      
      // PASO 2: Extraemos tipos únicos usando nuestra función utilitaria
      const uniqueTypes = extractUniqueTypes(pokemonWithDetails)
      console.log('🏷️ Tipos únicos extraídos:', uniqueTypes)
      setAvailableTypes(uniqueTypes)
      
      // Limpiamos errores si todo sale bien
      setError(null)
      console.log('✅ Carga completada exitosamente')
      
    } catch (err) {
      // 🎯 MEJOR MANEJO DE ERRORES: La API ya formatea los mensajes
      console.error('❌ Error en fetchPokemonList:', err)
      
      if (err instanceof PokemonApiError) {
        // Error específico de nuestra API con mensaje amigable
        setError(`Error de API: ${err.message}`)
      } else {
        // Error genérico
        setError('Error inesperado al cargar los Pokémon')
      }
    } finally {
      // Siempre desactivamos el loading
      setLoading(false)
    }
  }

  // === EFECTO PARA CARGAR DATOS AL INICIAR ===
  // useEffect se ejecuta cuando el componente se monta por primera vez
  // El array vacío [] significa que solo se ejecuta una vez
  useEffect(() => {
    fetchPokemonList() // Iniciamos la carga de datos automáticamente
  }, [])

  // === RENDERIZADO CONDICIONAL: ESTADO DE CARGA ===
  // Si estamos cargando, mostramos un spinner elegante
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-2xl font-display">
            Cargando Pokémon...
          </div>
        </div>
      </div>
    )
  }

  // === RENDERIZADO CONDICIONAL: ESTADO DE ERROR ===
  // Si hay un error, mostramos mensaje de error con botón para reintentar
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-display mb-4">¡Oops!</h2>
          <p className="text-lg">{error}</p>
          <button 
            onClick={fetchPokemonList} // Botón para reintentar la carga
            className="mt-4 px-6 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // === FUNCIÓN PARA FILTRAR POKÉMON ===
  // 🚀 NUEVA LÓGICA: Usamos nuestras funciones especializadas
  const filteredPokemon = (() => {
    let result = pokemonList;
    
    // Aplicar búsqueda usando nuestra función optimizada
    if (search.trim() !== '') {
      result = searchPokemon(result, search);
      console.log(`🔍 Búsqueda "${search}": ${result.length} resultados`);
    }
    
    // Aplicar filtro de tipo usando nuestra función
    if (selectedType !== '') {
      result = filterPokemonByType(result, selectedType);
      console.log(`🏷️ Filtro tipo "${selectedType}": ${result.length} resultados`);
    }
    
    // Aplicar filtro de favoritos (mantener lógica original)
    if (showFavoritesOnly) {
      result = result.filter(pokemon => favorites.includes(pokemon.id));
      console.log(`⭐ Solo favoritos: ${result.length} resultados`);
    }
    
    return result;
  })();

  // === FUNCIONES PARA MANEJAR FAVORITOS ===
  const toggleFavorite = (pokemonId: number) => {
    setFavorites(prev => 
      prev.includes(pokemonId) 
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    )
  }

  const isFavorite = (pokemonId: number) => favorites.includes(pokemonId)

  // === EXTRAER TIPOS ÚNICOS ===
  // 🚀 SIMPLIFICADO: Usamos nuestra función utilitaria como backup
  const typesToShow = availableTypes.length > 0 
    ? availableTypes 
    : extractUniqueTypes(pokemonList);

  // === RENDERIZADO CONDICIONAL: PANTALLA DE DETALLE ===
  // Si hay un Pokémon seleccionado, mostramos la pantalla de detalle
  if (selectedPokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cc42-blue to-blue-600 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Botón para volver */}
          <button
            onClick={() => setSelectedPokemon(null)}
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
                onClick={() => toggleFavorite(selectedPokemon.id)}
                className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 ${
                  isFavorite(selectedPokemon.id) 
                    ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-500 shadow-yellow-200' 
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`text-2xl transition-all duration-300 ${
                  isFavorite(selectedPokemon.id) 
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
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* === FILTRO POR TIPO === */}
          <div className="mt-6">
            <h3 className="text-blue-100 text-sm font-semibold mb-3">Filtrar per tipus:</h3>
            
            {/* === BOTONES TODOS Y FAVORITOS === */}
            <div className="flex gap-3 justify-center mb-4">
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  !showFavoritesOnly 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'bg-blue-300 text-white hover:bg-white hover:text-blue-600'
                }`}
              >
                Tots els Pokémon
              </button>
              <button
                onClick={() => setShowFavoritesOnly(true)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  showFavoritesOnly 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : favorites.length > 0
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg hover:from-yellow-500 hover:to-yellow-600 border-2 border-yellow-300'
                      : 'bg-blue-300 text-white hover:bg-white hover:text-blue-600'
                }`}
              >
                <span className={favorites.length > 0 && !showFavoritesOnly ? 'animate-pulse' : ''}>⭐</span>
                Favorits ({favorites.length})
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
              {/* Botón "Todos" los tipos */}
              <button
                onClick={() => setSelectedType('')}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedType === '' 
                    ? 'bg-white text-blue-600 underline decoration-2 underline-offset-2' 
                    : 'bg-blue-400 text-white hover:bg-blue-300 hover:underline hover:decoration-2 hover:underline-offset-2'
                }`}
              >
                Tots els tipus
              </button>
              
              {/* Botones de tipos */}
              {typesToShow.length > 0 ? (
                typesToShow.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
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
        {filteredPokemon.length === 0 && (search.trim() !== '' || selectedType !== '' || showFavoritesOnly) ? (
          // Mensaje cuando no se encuentran coincidencias
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-md">
              <h3 className="text-xl font-display font-bold text-gray-800 mb-2">
                {showFavoritesOnly && favorites.length === 0 
                  ? "No tens favorits"
                  : "No s'han trobat pokémons"
                }
              </h3>
              <p className="text-gray-600">
                {showFavoritesOnly && favorites.length === 0 
                  ? "Afegeix alguns Pokémon als teus favorits fent clic a l'estrella ⭐"
                  : showFavoritesOnly
                    ? `No hi ha favorits que coincideixin amb els filtres aplicats`
                    : search.trim() !== '' && selectedType !== '' 
                      ? `No hi ha cap pokémon que coincideixi amb "${search}" del tipus ${selectedType}`
                      : search.trim() !== '' 
                        ? `No hi ha cap pokémon que coincideixi amb "${search}"`
                        : `No hi ha cap pokémon del tipus ${selectedType}`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* Iteramos sobre cada Pokémon filtrado y creamos una tarjeta */}
            {filteredPokemon.map((pokemon) => (
            <div
              key={pokemon.id} // Key único para React
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative"
            >
              
              {/* === BOTÓN DE FAVORITO === */}
              <button
                onClick={(e) => {
                  e.stopPropagation() // Evita que se active el detalle del Pokémon
                  toggleFavorite(pokemon.id)
                }}
                className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 ${
                  isFavorite(pokemon.id)
                    ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-500 shadow-yellow-200'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className={`text-lg transition-all duration-300 ${
                  isFavorite(pokemon.id) 
                    ? 'text-yellow-700 drop-shadow-sm' 
                    : 'text-gray-300 hover:text-gray-400'
                }`}>
                  ⭐
                </span>
              </button>
              
              {/* === SECCIÓN DE IMAGEN === */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex justify-center">
                <img
                  src={pokemon.sprites.front_default} // URL de la imagen del Pokémon
                  alt={pokemon.name}                  // Texto alternativo para accesibilidad
                  className="w-24 h-24 object-contain" // Tamaño fijo y contener imagen
                  loading="lazy"                      // Carga perezosa para mejor rendimiento
                />
              </div>
              
              {/* === SECCIÓN DE INFORMACIÓN === */}
              <div className="p-4">
                <div className="text-center">
                  
                  {/* Número del Pokémon con formato (ej: #001, #025) */}
                  {/* 🚀 NUEVA LÓGICA: Usamos función de formateo de nuestra API */}
                  <span className="text-sm text-gray-500 font-mono">
                    #{formatPokemonId(pokemon.id)}
                  </span>
                  
                  {/* Nombre del Pokémon capitalizado */}
                  <h3 className="text-xl font-display font-bold text-gray-800 capitalize mb-2">
                    {pokemon.name}
                  </h3>
                  
                  {/* === TIPOS DEL POKÉMON === */}
                  <div className="flex justify-center gap-2 flex-wrap">
                    {/* Iteramos sobre cada tipo y creamos una pill/badge */}
                    {pokemon.types.map((type, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white
                          ${getTypeColor(type.type.name)} // Función que devuelve color según el tipo
                        `}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                  
                  {/* === BOTÓN AZUL === */}
                  <div className="mt-3">
                    <button 
                      onClick={() => setSelectedPokemon(pokemon)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded-lg transition-colors duration-200"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* === FOOTER === */}
        <footer className="text-center py-8 text-blue-100">
          <p>
            Mostrando {filteredPokemon.length} Pokémon
            {showFavoritesOnly ? ' favorits' : ''}
            {(search.trim() !== '' || selectedType !== '' || showFavoritesOnly) && ` (de ${pokemonList.length} totals)`}
            {selectedType !== '' && ` - Tipus: ${selectedType}`}
            {favorites.length > 0 && !showFavoritesOnly && ` | ${favorites.length} favorits`}
          </p>
        </footer>
      </div>
    </div>
  )
}

// === FUNCIÓN HELPER PARA COLORES DE TIPOS ===
// Esta función devuelve una clase CSS de Tailwind según el tipo de Pokémon
// Cada tipo tiene un color característico que coincide con los juegos oficiales
function getTypeColor(type: string): string {
  // Objeto que mapea cada tipo con su color correspondiente
  const colors: { [key: string]: string } = {
    normal: 'bg-gray-400',      // Gris para tipo normal
    fire: 'bg-red-500',         // Rojo para tipo fuego
    water: 'bg-blue-500',       // Azul para tipo agua
    electric: 'bg-yellow-400',  // Amarillo para tipo eléctrico
    grass: 'bg-green-500',      // Verde para tipo planta
    ice: 'bg-blue-200',         // Azul claro para tipo hielo
    fighting: 'bg-red-700',     // Rojo oscuro para tipo lucha
    poison: 'bg-purple-500',    // Morado para tipo veneno
    ground: 'bg-yellow-600',    // Amarillo oscuro para tipo tierra
    flying: 'bg-indigo-400',    // Índigo para tipo volador
    psychic: 'bg-pink-500',     // Rosa para tipo psíquico
    bug: 'bg-green-400',        // Verde claro para tipo bicho
    rock: 'bg-yellow-800',      // Amarillo muy oscuro para tipo roca
    ghost: 'bg-purple-700',     // Morado oscuro para tipo fantasma
    dragon: 'bg-indigo-700',    // Índigo oscuro para tipo dragón
    dark: 'bg-gray-800',        // Gris muy oscuro para tipo siniestro
    steel: 'bg-gray-500',       // Gris medio para tipo acero
    fairy: 'bg-pink-300'        // Rosa claro para tipo hada
  }
  
  // Retornamos el color correspondiente o gris por defecto si no existe
  return colors[type] || 'bg-gray-400'
}

export default App
