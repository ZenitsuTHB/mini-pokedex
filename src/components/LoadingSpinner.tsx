interface LoadingSpinnerProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  message = "Cargando...", 
  size = 'medium',
  fullScreen = false 
}: LoadingSpinnerProps) {
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24'
  }

  const textSizes = {
    small: 'text-sm',
    medium: 'text-xl',
    large: 'text-2xl'
  }

  const containerClasses = fullScreen 
    ? "min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
    : "flex items-center justify-center py-8"

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        
        <div className={`text-white ${textSizes[size]} font-display`}>
          {message}
        </div>

        {fullScreen && (
          <div className="mt-4 text-blue-100 text-lg">
            Preparando tu Pokédex...
          </div>
        )}
      </div>
    </div>
  )
}