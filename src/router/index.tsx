// === ROUTER CONFIGURATION ===
// Configuración de rutas con React Router DOM

import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components'
import { HomePage, PokemonDetailPage } from '../pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'pokemon/:id',
        element: <PokemonDetailPage />
      }
    ]
  }
])