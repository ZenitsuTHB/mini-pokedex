// === CONFIGURACIÓN GLOBAL PARA TESTS ===
// Este archivo se ejecuta antes de cada test

import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Mock para fetch global (lo necesitaremos para testear la API)
Object.defineProperty(globalThis, 'fetch', {
  writable: true,
  value: vi.fn(),
})

// Configuración de timeouts para tests
vi.setConfig({
  testTimeout: 10000, // 10 segundos para tests que hacen peticiones HTTP
})

// Limpiar mocks después de cada test
beforeEach(() => {
  vi.clearAllMocks()
})