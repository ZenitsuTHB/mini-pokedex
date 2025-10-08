# Mini Pokédex

## 🌀 Configuración de TailwindCSS — Step by step

Este apartado explica, paso a paso, cómo instalar y configurar **TailwindCSS** en el proyecto `mini-pokedex` (Vite + React + TypeScript). Sigue cada paso y marca lo completado.

### 1. Instalar dependencias (dev)
```bash
cd mini-pokedex
npm install -D tailwindcss postcss autoprefixer
```

### 2. Inicializar la configuración
```bash
npx tailwindcss init -p
or ./node_modules/.bin/tailwindcss init -p
```

### 3. Configurar `tailwind.config.cjs`
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cc42-blue': '#00d4ff',
        'pokedex-red': '#ff3b3b',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

### 4. Configurar `postcss.config.cjs`
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 5. Crear `src/index.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --cc42-blue: #00d4ff;
}

.btn {
  @apply inline-block px-4 py-2 rounded-lg font-medium;
}
```

### 6. Importar en `src/main.tsx`
```ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // <-- IMPORTANTE

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 7. Verificar
```bash
npm run dev
```

Ejemplo rápido (`App.tsx`):
```tsx
export default function App() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <h1 className="text-3xl font-display">Mini Pokédex</h1>
      <p className="mt-4">Tailwind funcionando ✅</p>
    </main>
  );
}
```

---

## ⚙️ Opcionales recomendados
- Plugins: `@tailwindcss/forms` y `@tailwindcss/typography`
- ESLint plugin: `eslint-plugin-tailwindcss`
- VSCode extension: **Tailwind CSS IntelliSense**
- Librería para clases condicionales: `clsx` o `classnames`

---

## ✅ Checklist rápido
- [ ] `npm install -D tailwindcss postcss autoprefixer`
- [ ] `npx tailwindcss init -p`
- [ ] `tailwind.config.cjs` actualizado
- [ ] `postcss.config.cjs` correcto
- [ ] `src/index.css` con @tailwind
- [ ] `import './index.css'` en `main.tsx`
- [ ] Dev server funcionando
