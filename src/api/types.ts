// === TIPOS Y INTERFACES PARA LA API ===
// Estas interfaces definen la estructura exacta de los datos que recibimos de la PokéAPI

// Respuesta cuando pedimos la lista inicial de Pokémon
export interface PokemonListResponse {
  count: number                    // Total de Pokémon disponibles
  next: string | null             // URL para la siguiente página
  previous: string | null         // URL para la página anterior
  results: PokemonListItem[]      // Array de Pokémon básicos
}

// Información básica de un Pokémon en la lista
export interface PokemonListItem {
  name: string                    // Nombre del Pokémon
  url: string                     // URL para obtener detalles completos
}

// Información completa de un Pokémon individual
export interface Pokemon {
  id: number                      // ID único del Pokémon
  name: string                    // Nombre del Pokémon
  height: number                  // Altura en decímetros
  weight: number                  // Peso en hectogramos
  base_experience: number         // Experiencia base
  order: number                   // Orden en la Pokédex nacional
  
  // Imágenes del Pokémon
  sprites: {
    front_default: string         // Imagen frontal por defecto
    front_shiny?: string          // Imagen frontal shiny (opcional)
    back_default?: string         // Imagen trasera por defecto (opcional)
    back_shiny?: string           // Imagen trasera shiny (opcional)
  }
  
  // Tipos del Pokémon (máximo 2)
  types: PokemonType[]
  
  // Estadísticas del Pokémon
  stats: PokemonStat[]
  
  // Habilidades del Pokémon
  abilities: PokemonAbility[]
}

// Tipo individual del Pokémon
export interface PokemonType {
  slot: number                    // Posición del tipo (1 o 2)
  type: {
    name: string                  // Nombre del tipo (fire, water, grass, etc.)
    url: string                   // URL con más información del tipo
  }
}

// Estadística individual del Pokémon
export interface PokemonStat {
  base_stat: number               // Valor base de la estadística
  effort: number                  // EV (Effort Value) que da este Pokémon
  stat: {
    name: string                  // Nombre de la estadística (hp, attack, defense, etc.)
    url: string                   // URL con más información de la estadística
  }
}

// Habilidad individual del Pokémon
export interface PokemonAbility {
  is_hidden: boolean              // Si es una habilidad oculta
  slot: number                    // Posición de la habilidad
  ability: {
    name: string                  // Nombre de la habilidad
    url: string                   // URL con más información de la habilidad
  }
}

// Respuesta cuando pedimos información de un tipo específico
export interface TypeResponse {
  id: number                      // ID del tipo
  name: string                    // Nombre del tipo
  pokemon: Array<{                // Pokémon que tienen este tipo
    pokemon: {
      name: string
      url: string
    }
    slot: number                  // En qué slot está este tipo
  }>
}

// === TIPOS PARA MANEJO DE ERRORES ===
export interface ApiError {
  message: string                 // Mensaje de error
  status?: number                 // Código de estado HTTP (opcional)
  details?: string                // Detalles técnicos (opcional)
}

// === TIPOS PARA CONFIGURACIÓN ===
export interface ApiConfig {
  baseUrl: string                 // URL base de la API
  timeout: number                 // Timeout en milisegundos
  retries: number                 // Número de reintentos
}