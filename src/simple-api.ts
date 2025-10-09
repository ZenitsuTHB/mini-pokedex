// === VERSIÓN SIMPLIFICADA PARA DIAGNÓSTICO ===
// Vamos a crear una versión super simple para probar

export async function getSimplePokemonList() {
  console.log('🚀 Llamada simple a la API...')
  
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=5')
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ Lista obtenida:', data)
    
    return data.results
    
  } catch (error) {
    console.error('❌ Error simple:', error)
    throw error
  }
}