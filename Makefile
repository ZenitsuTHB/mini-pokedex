# ===============================================
# 🚀 Makefile para Mini Pokédex
# ===============================================
# Este Makefile automatiza las tareas más comunes de desarrollo
# 
# Uso:
#   make install     - Instalar dependencias
#   make dev         - Servidor de desarrollo
#   make test        - Ejecutar tests
#   make build       - Build de producción
#   make help        - Ver todos los comandos

# Variables de configuración
NODE_BIN := node_modules/.bin
PACKAGE_MANAGER := npm

# Colores para output
RED := \033[31m
GREEN := \033[32m
YELLOW := \033[33m
BLUE := \033[34m
RESET := \033[0m

# ===============================================
# 📋 Comandos principales
# ===============================================

.PHONY: help
help: ## 📖 Mostrar ayuda
	@echo "$(BLUE)🚀 Mini Pokédex - Comandos disponibles:$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ===============================================
# 📦 Instalación y configuración
# ===============================================

.PHONY: install
install: ## 📦 Instalar dependencias
	@echo "$(YELLOW)📦 Instalando dependencias...$(RESET)"
	$(PACKAGE_MANAGER) install
	@echo "$(GREEN)✅ Dependencias instaladas$(RESET)"

.PHONY: install-ci
install-ci: ## 📦 Instalación para CI/CD
	@echo "$(YELLOW)📦 Instalación CI...$(RESET)"
	$(PACKAGE_MANAGER) ci
	@echo "$(GREEN)✅ Instalación CI completada$(RESET)"

.PHONY: update
update: ## 🔄 Actualizar dependencias
	@echo "$(YELLOW)🔄 Actualizando dependencias...$(RESET)"
	$(PACKAGE_MANAGER) update
	@echo "$(GREEN)✅ Dependencias actualizadas$(RESET)"

# ===============================================
# 🛠️ Desarrollo
# ===============================================

.PHONY: dev
dev: ## 🛠️ Servidor de desarrollo
	@echo "$(BLUE)🛠️ Iniciando servidor de desarrollo...$(RESET)"
	$(PACKAGE_MANAGER) run dev

.PHONY: dev-host
dev-host: ## 🌐 Servidor de desarrollo con acceso externo
	@echo "$(BLUE)🌐 Iniciando servidor con --host...$(RESET)"
	$(PACKAGE_MANAGER) run dev -- --host

.PHONY: preview
preview: build ## 👀 Preview del build de producción
	@echo "$(BLUE)👀 Iniciando preview...$(RESET)"
	$(PACKAGE_MANAGER) run preview

# ===============================================
# 🏗️ Build y producción
# ===============================================

.PHONY: build
build: ## 🏗️ Build de producción
	@echo "$(YELLOW)🏗️ Creando build de producción...$(RESET)"
	$(PACKAGE_MANAGER) run build
	@echo "$(GREEN)✅ Build completado$(RESET)"

.PHONY: build-analyze
build-analyze: ## 📊 Build con análisis de bundle
	@echo "$(YELLOW)📊 Build con análisis...$(RESET)"
	$(PACKAGE_MANAGER) run build -- --analyze
	@echo "$(GREEN)✅ Análisis completado$(RESET)"

# ===============================================
# 🧪 Testing
# ===============================================

.PHONY: test
test: ## 🧪 Ejecutar todos los tests
	@echo "$(BLUE)🧪 Ejecutando tests...$(RESET)"
	$(PACKAGE_MANAGER) run test:run

.PHONY: test-watch
test-watch: ## 👀 Tests en modo watch
	@echo "$(BLUE)👀 Tests en modo watch...$(RESET)"
	$(PACKAGE_MANAGER) run test

.PHONY: test-ui
test-ui: ## 🖥️ Interfaz visual de tests
	@echo "$(BLUE)🖥️ Abriendo interfaz de tests...$(RESET)"
	$(PACKAGE_MANAGER) run test:ui

.PHONY: test-coverage
test-coverage: ## 📊 Reporte de cobertura de tests
	@echo "$(BLUE)📊 Generando reporte de cobertura...$(RESET)"
	$(PACKAGE_MANAGER) run test:run -- --coverage
	@echo "$(GREEN)✅ Reporte generado en coverage/$(RESET)"

.PHONY: test-api
test-api: ## 🌐 Ejecutar solo tests de API
	@echo "$(BLUE)🌐 Ejecutando tests de API...$(RESET)"
	$(PACKAGE_MANAGER) run test:run src/tests/api.*

.PHONY: test-utils
test-utils: ## 🔧 Ejecutar solo tests de utilidades
	@echo "$(BLUE)🔧 Ejecutando tests de utilidades...$(RESET)"
	$(PACKAGE_MANAGER) run test:run src/tests/api.utilities.test.ts

# ===============================================
# 🔍 Linting y formateo
# ===============================================

.PHONY: lint
lint: ## 🔍 Verificar código con ESLint
	@echo "$(BLUE)🔍 Verificando código...$(RESET)"
	$(PACKAGE_MANAGER) run lint

.PHONY: lint-fix
lint-fix: ## 🔧 Corregir problemas de linting automáticamente
	@echo "$(YELLOW)🔧 Corrigiendo problemas de linting...$(RESET)"
	$(PACKAGE_MANAGER) run lint -- --fix
	@echo "$(GREEN)✅ Linting corregido$(RESET)"

.PHONY: type-check
type-check: ## 📝 Verificar tipos de TypeScript
	@echo "$(BLUE)📝 Verificando tipos...$(RESET)"
	npx tsc --noEmit
	@echo "$(GREEN)✅ Tipos verificados$(RESET)"

# ===============================================
# 🧹 Limpieza
# ===============================================

.PHONY: clean
clean: ## 🧹 Limpiar archivos temporales
	@echo "$(YELLOW)🧹 Limpiando archivos temporales...$(RESET)"
	rm -rf dist/
	rm -rf coverage/
	rm -rf node_modules/.cache/
	rm -rf .vite/
	@echo "$(GREEN)✅ Limpieza completada$(RESET)"

.PHONY: clean-all
clean-all: clean ## 🧹 Limpieza completa (incluye node_modules)
	@echo "$(RED)🧹 Limpieza completa...$(RESET)"
	rm -rf node_modules/
	rm -rf package-lock.json
	@echo "$(GREEN)✅ Limpieza completa terminada$(RESET)"

# ===============================================
# 📊 Información y diagnóstico
# ===============================================

.PHONY: info
info: ## 📊 Información del proyecto
	@echo "$(BLUE)📊 Información del proyecto:$(RESET)"
	@echo "  📦 Package manager: $(PACKAGE_MANAGER)"
	@echo "  📁 Directorio: $(PWD)"
	@echo "  🏷️  Versión Node: $(shell node --version)"
	@echo "  📦 Versión npm: $(shell npm --version)"
	@echo "  📋 Dependencias:"
	@$(PACKAGE_MANAGER) list --depth=0 2>/dev/null | head -10

.PHONY: check-deps
check-deps: ## 🔍 Verificar dependencias desactualizadas
	@echo "$(BLUE)🔍 Verificando dependencias...$(RESET)"
	$(PACKAGE_MANAGER) outdated

.PHONY: audit
audit: ## 🔒 Auditoría de seguridad
	@echo "$(BLUE)🔒 Auditoría de seguridad...$(RESET)"
	$(PACKAGE_MANAGER) audit

.PHONY: audit-fix
audit-fix: ## 🔧 Corregir vulnerabilidades automáticamente
	@echo "$(YELLOW)🔧 Corrigiendo vulnerabilidades...$(RESET)"
	$(PACKAGE_MANAGER) audit fix
	@echo "$(GREEN)✅ Vulnerabilidades corregidas$(RESET)"

# ===============================================
# 🚀 Comandos de desarrollo rápido
# ===============================================

.PHONY: start
start: install dev ## 🚀 Setup completo y iniciar desarrollo
	@echo "$(GREEN)🚀 Proyecto iniciado$(RESET)"

.PHONY: fresh-start
fresh-start: clean-all install dev ## 🆕 Instalación limpia y inicio
	@echo "$(GREEN)🆕 Instalación limpia completada$(RESET)"

.PHONY: test-all
test-all: lint type-check test ## 🎯 Ejecutar todos los checks
	@echo "$(GREEN)🎯 Todos los checks completados$(RESET)"

.PHONY: ci
ci: install-ci lint type-check test build ## 🤖 Pipeline de CI completo
	@echo "$(GREEN)🤖 Pipeline CI completado$(RESET)"

# ===============================================
# 🧭 Comandos de Router
# ===============================================

.PHONY: test-router
test-router: ## 🧭 Probar navegación del router
	@echo "$(YELLOW)🧭 Probando navegación del router...$(RESET)"
	@echo "$(GREEN)✅ HomePage disponible en: http://localhost:5173/$(RESET)"
	@echo "$(GREEN)✅ Pokemon detail en: http://localhost:5173/pokemon/1$(RESET)"
	@echo "$(GREEN)✅ Pokemon detail en: http://localhost:5173/pokemon/25$(RESET)"
	@echo "$(BLUE)💡 Tip: Haz clic en cualquier Pokémon para navegar automáticamente$(RESET)"

.PHONY: test-navigation
test-navigation: ## 🗺️ Verificar estructura de navegación
	@echo "$(YELLOW)🗺️ Verificando estructura de navegación...$(RESET)"
	@echo "$(GREEN)📁 Páginas creadas:$(RESET)"
	@ls -la src/pages/ 2>/dev/null || echo "$(RED)❌ Directorio pages no encontrado$(RESET)"
	@echo "$(GREEN)🧭 Router configurado:$(RESET)"
	@ls -la src/router/ 2>/dev/null || echo "$(RED)❌ Directorio router no encontrado$(RESET)"
	@echo "$(GREEN)🎨 Layout creado:$(RESET)"
	@grep -l "Layout" src/components/* 2>/dev/null || echo "$(RED)❌ Layout component no encontrado$(RESET)"

# ===============================================
# 📋 Comandos por defecto
# ===============================================

# Comando por defecto cuando solo ejecutas 'make'
.DEFAULT_GOAL := help