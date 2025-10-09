// === SCRIPT DE DIAGNÓSTICO SIMPLE ===
// Vamos a probar nuestra API directamente

import { getFirstPokemonWithDetails } from './api'

console.log('🔍 Iniciando diagnóstico de API...')

// Test simple
getFirstPokemonWithDetails(3)
  .then(pokemon => {
    console.log('✅ API funciona correctamente!')
    console.log(`📊 Pokémon cargados: ${pokemon.length}`)
    console.log('🎮 Primer Pokémon:', pokemon[0])
  })
  .catch(error => {
    console.error('❌ Error en API:', error)
    console.error('📋 Detalles:', error.message)
    console.error('🔍 Stack:', error.stack)
  })