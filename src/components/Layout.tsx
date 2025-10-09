import { Outlet, useLocation } from 'react-router-dom'

export function Layout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen">
      {!isHomePage && (
        <nav className="bg-cc42-blue shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-white text-xl font-display font-bold">
                Mini Pokédex
              </h1>
              
              <div className="text-blue-100 text-sm">
                <span>Inicio</span>
                {location.pathname.includes('/pokemon/') && (
                  <>
                    <span className="mx-2">›</span>
                    <span>Detalles del Pokémon</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>
        <Outlet />
      </main>
    </div>
  )
}