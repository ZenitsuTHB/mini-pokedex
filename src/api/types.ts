// === TIPOS Y INTERFACES PARA LA API ===
// Estas interfaces definen la estructura exacta de los datos que recibimos de la PokéAPI

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonListItem {
  name: string
  url: string
}

export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number
  order: number
  
  sprites: {
    front_default: string
    front_shiny?: string
    back_default?: string
    back_shiny?: string
  }
  
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
}

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: {
    name: string
    url: string
  }
}

export interface PokemonAbility {
  is_hidden: boolean
  slot: number
  ability: {
    name: string
    url: string
  }
}

export interface TypeResponse {
  id: number
  name: string
  pokemon: Array<{
    pokemon: {
      name: string
      url: string
    }
    slot: number
  }>
}

export interface ApiError {
  message: string
  status?: number
  details?: string
}

export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
}