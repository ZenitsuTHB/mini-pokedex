import { usePokemon } from '../context'

interface SearchInputProps {
  placeholder?: string
  className?: string
}

export function SearchInput({ 
  placeholder = "Buscar Pokémon...", 
  className = "" 
}: SearchInputProps) {
  const { state, actions } = usePokemon()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    actions.setSearchTerm(e.target.value)
  }

  const handleClear = () => {
    actions.setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={state.searchTerm}
        onChange={handleChange}
        className="w-full px-4 py-3 pl-12 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
      />

      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          className="w-5 h-5 text-gray-400" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>

      {state.searchTerm && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}

      {state.searchTerm && (
        <div className="absolute top-full left-0 mt-1 text-xs text-gray-500">
          {state.filteredPokemon.length} resultado(s) encontrado(s)
        </div>
      )}
    </div>
  )
}