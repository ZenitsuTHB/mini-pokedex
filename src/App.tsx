// Importamos los hooks necesarios de React
import { useState, useEffect } from 'react'
import './App.css'

// === DEFINICIÓN DE TIPOS/INTERFACES ===
// Define la estructura de un Pokémon completo con toda la información que necesitamos
interface Pokemon {
  id: number              // ID único del Pokémon (ej: 1, 2, 3...)
  name: string           // Nombre del Pokémon (ej: "bulbasaur")
  url: string            // URL de la API para obtener más detalles
  sprites: {             // Objeto que contiene las imágenes del Pokémon
    front_default: string // URL de la imagen frontal por defecto
  }
  types: Array<{         // Array de tipos del Pokémon (puede tener 1 o 2 tipos)
    type: {
      name: string       // Nombre del tipo (ej: "grass", "poison")
    }
  }>
}

// Define la estructura de la respuesta de la API cuando pedimos la lista inicial
interface PokemonListResponse {
  results: Array<{       // Array con información básica de cada Pokémon
    name: string         // Solo el nombre
    url: string          // URL para obtener los detalles completos
  }>
}

function App() {
  // === ESTADOS DEL COMPONENTE ===
  // Estado para almacenar la lista completa de Pokémon con todos sus detalles
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  
  // Estado para controlar si estamos cargando datos (muestra spinner)
  const [loading, setLoading] = useState(true)
  
  // Estado para manejar errores (muestra mensaje de error si algo falla)
  const [error, setError] = useState<string | null>(null)

  // === FUNCIÓN PRINCIPAL PARA OBTENER DATOS ===
  const fetchPokemonList = async () => {
    try {
      // Activamos el estado de carga
      setLoading(true)
      
      // PASO 1: Obtenemos la lista básica de 50 Pokémon desde la API
      // Esta llamada solo nos da nombres y URLs, no los detalles completos
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
      const data: PokemonListResponse = await response.json()
      
      // PASO 2: Para cada Pokémon de la lista, hacemos una llamada individual
      // para obtener sus detalles completos (imagen, tipos, etc.)
      // Promise.all ejecuta todas las llamadas en paralelo para mayor eficiencia
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          // Llamada individual para obtener detalles de cada Pokémon
          const detailResponse = await fetch(pokemon.url)
          const detail = await detailResponse.json()
          return detail // Retornamos el objeto completo con todos los detalles
        })
      )
      
      // PASO 3: Guardamos todos los detalles en nuestro estado
      setPokemonList(pokemonDetails)
      setError(null) // Limpiamos cualquier error previo si todo sale bien
    } catch (err) {
      // Si algo falla, mostramos un mensaje de error amigable
      setError('Error al cargar los Pokémon')
      console.error('Error:', err) // Log técnico para debugging
    } finally {
      // Siempre desactivamos el loading, haya error o no
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
        <div className="text-white text-2xl font-display">
          Cargando Pokémon...
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
        </header>

        {/* === GRID PRINCIPAL DE POKÉMON === */}
        {/* Grid responsivo que se adapta al tamaño de pantalla:
            - móvil: 1 columna
            - sm: 2 columnas  
            - md: 3 columnas
            - lg: 4 columnas
            - xl: 5 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {/* Iteramos sobre cada Pokémon y creamos una tarjeta */}
          {pokemonList.map((pokemon) => (
            <div
              key={pokemon.id} // Key único para React
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              
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
                  <span className="text-sm text-gray-500 font-mono">
                    #{pokemon.id.toString().padStart(3, '0')}
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === FOOTER === */}
        <footer className="text-center py-8 text-blue-100">
          <p>Mostrando {pokemonList.length} Pokémon</p>
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
