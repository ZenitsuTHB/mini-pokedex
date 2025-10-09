# 🚀 Guía de Despliegue - Mini Pokédex

Esta guía te explica cómo desplegar tu Mini Pokédex en diferentes plataformas.

## 📋 Requisitos Previos

1. **Build exitoso**: `npm run build` debe completarse sin errores
2. **Tests pasando**: `npm run test:run` debe pasar todos los tests
3. **Linting correcto**: `npm run lint` sin errores

## 🌐 Opciones de Despliegue

### 1. 🏆 Vercel (Recomendado)

**Método 1: CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
make deploy-vercel
# o
npm run deploy:vercel
```

**Método 2: Web UI**
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. ¡Automáticamente detecta Vite y despliega!

**Ventajas:**
- ✅ Deploy automático en cada push
- ✅ CDN global ultra rápido
- ✅ HTTPS automático
- ✅ Preview deployments en PRs

### 2. 🌐 Netlify

**Método 1: CLI**
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Desplegar
make deploy-netlify
# o
npm run deploy:netlify
```

**Método 2: Drag & Drop**
1. Ejecuta `npm run build`
2. Ve a [app.netlify.com/drop](https://app.netlify.com/drop)
3. Arrastra la carpeta `dist/`

**Método 3: Git Integration**
1. Ve a [netlify.com](https://netlify.com)
2. "New site from Git"
3. Configuración:
   - Build command: `npm run build`
   - Publish directory: `dist`

**Ventajas:**
- ✅ Fácil de usar
- ✅ Funciones serverless
- ✅ Form handling
- ✅ Split testing

### 3. 🐙 GitHub Pages

**Configuración automática:**
```bash
make deploy-github-pages
```

**Pasos manuales:**
1. Ve a tu repo en GitHub
2. Settings > Pages
3. Source: "GitHub Actions"
4. El archivo `.github/workflows/deploy.yml` ya está configurado

**Ventajas:**
- ✅ Totalmente gratis
- ✅ Integrado con GitHub
- ✅ Deploy automático en push

### 4. 📦 Deploy Manual

Para cualquier hosting (Firebase, AWS S3, etc.):

```bash
# Generar build
npm run build

# La carpeta dist/ contiene todos los archivos
# Sube esta carpeta a tu hosting
```

## 🔧 Configuración de Rutas

Tu app usa React Router, así que necesitas configurar el servidor para servir `index.html` en todas las rutas:

### Vercel
✅ Ya configurado en `vercel.json`

### Netlify
✅ Ya configurado en `public/_redirects`

### Apache
Crea `.htaccess` en la raíz:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🚀 Comandos Útiles

```bash
# Preparar para deploy (tests + build)
make deploy-ready

# Ver opciones de deploy
make deploy-info

# Build local para testing
npm run build && npm run preview
```

## 📊 URLs de Ejemplo

Una vez desplegado, tu app estará disponible en URLs como:

- **Vercel**: `https://mini-pokedex-usuario.vercel.app`
- **Netlify**: `https://mini-pokedex-abc123.netlify.app`
- **GitHub Pages**: `https://usuario.github.io/mini-pokedex`

## 🔍 Troubleshooting

### Error: "Page not found" en rutas
- ✅ Verificar configuración de redirects
- ✅ Comprobar que `vercel.json` o `_redirects` existen

### Build falla
```bash
# Limpiar y reinstalar
make clean-all
npm install
npm run build
```

### Tests fallan en CI
- ✅ Verificar que todos los tests pasan localmente
- ✅ Comprobar configuración de Node.js en CI

## 🎯 Performance

El build optimizado incluye:
- ✅ **Minificación** de JS/CSS
- ✅ **Tree shaking** (código no usado eliminado)
- ✅ **Gzip compression** (~94KB JS total)
- ✅ **Code splitting** automático
- ✅ **Asset optimization**

## 🔗 Links Útiles

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Pages](https://pages.github.com)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)

---

¡Tu Mini Pokédex está lista para el mundo! 🌍✨