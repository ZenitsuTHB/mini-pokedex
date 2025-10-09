// === ERROR MESSAGE COMPONENT ===
// Componente reutilizable para mostrar errores

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  fullScreen?: boolean
}

export function ErrorMessage({ 
  message, 
  onRetry, 
  fullScreen = false 
}: ErrorMessageProps) {
  
  const containerClasses = fullScreen 
    ? "min-h-screen bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center"
    : "bg-red-50 border border-red-200 rounded-lg p-6 text-center"

  const textColor = fullScreen ? "text-white" : "text-red-800"

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* === ICONO DE ERROR === */}
        <div className="mb-4">
          <div className={`w-16 h-16 mx-auto rounded-full ${fullScreen ? 'bg-white bg-opacity-20' : 'bg-red-100'} flex items-center justify-center`}>
            <svg 
              className={`w-8 h-8 ${fullScreen ? 'text-white' : 'text-red-500'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
        </div>

        {/* === TÍTULO === */}
        <h2 className={`text-2xl font-display font-bold mb-4 ${textColor}`}>
          ¡Oops!
        </h2>

        {/* === MENSAJE === */}
        <p className={`text-lg mb-6 ${textColor}`}>
          {message}
        </p>

        {/* === BOTÓN DE REINTENTAR === */}
        {onRetry && (
          <button 
            onClick={onRetry}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              fullScreen 
                ? 'bg-white text-red-600 hover:bg-gray-100 shadow-lg hover:shadow-xl'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg'
            }`}
          >
            Reintentar
          </button>
        )}

        {/* === CONSEJOS === */}
        {fullScreen && (
          <div className="mt-6 text-red-100 text-sm">
            <p>Verifica tu conexión a internet</p>
            <p>El servidor de Pokémon puede estar temporalmente no disponible</p>
          </div>
        )}
      </div>
    </div>
  )
}