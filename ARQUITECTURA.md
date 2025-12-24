# 🏗️ Arquitectura del Proyecto

## Visión General

La aplicación está construida con **Next.js 14** usando el App Router, **React Three Fiber** para renderizado 3D, y **WebXR API** para Realidad Aumentada. Todo funciona sin backend, usando datos locales en JSON.

## Estructura de Carpetas

```
src/
├── components/          # Componentes React reutilizables
│   ├── ARViewer/       # Componente principal de AR
│   └── InflableCard/   # Tarjeta de información
├── pages/              # Páginas de Next.js
│   ├── _app.tsx        # Configuración global
│   └── index.tsx       # Página principal
├── data/               # Datos estáticos
│   └── inflables.json  # Catálogo de inflables
├── types/              # Definiciones TypeScript
│   └── inflable.ts     # Tipos para inflables
├── utils/              # Funciones utilitarias
│   └── arUtils.ts      # Helpers para WebXR
└── styles/             # Estilos globales
    └── globals.css     # CSS principal
```

## Flujo de Datos

```
inflables.json (fuente de verdad)
    ↓
index.tsx (página principal)
    ↓
InflableCard (muestra información)
    ↓
ARViewer (visualización AR)
    ↓
WebXR API (renderizado AR)
```

## Componentes Principales

### 1. ARViewer (`src/components/ARViewer/ARViewer.tsx`)

**Responsabilidades:**
- Inicializar sesión WebXR
- Solicitar permisos de cámara
- Renderizar escena 3D con Three.js
- Manejar interacción táctil
- Escalar modelos según medidas reales

**Sub-componentes:**
- `InflableModel`: Renderiza el modelo 3D con escala correcta
- `FloorGrid`: Grid de referencia en el suelo
- `ARScene`: Escena principal con lógica AR

**Flujo:**
1. Verificar soporte WebXR
2. Solicitar permiso de cámara
3. Crear sesión AR con `local-floor`
4. Configurar Three.js para AR
5. Renderizar modelo en escala real
6. Habilitar interacción táctil

### 2. InflableCard (`src/components/InflableCard/InflableCard.tsx`)

**Responsabilidades:**
- Mostrar información del inflable
- Galería de fotos con navegación
- Especificaciones (medidas, capacidad, edad)
- Botones de acción (AR, WhatsApp)

**Estado:**
- `currentPhotoIndex`: Índice de foto actual

### 3. Página Principal (`src/pages/index.tsx`)

**Responsabilidades:**
- Cargar datos de inflables
- Manejar navegación entre vista normal y AR
- Renderizar InflableCard o ARViewer según estado

**Estado:**
- `selectedInflable`: Inflable seleccionado para AR
- `showAR`: Flag para mostrar/ocultar vista AR

## Sistema de Datos

### Estructura de Inflable

```typescript
interface Inflable {
  id: string;                    // Identificador único
  nombre: string;                 // Nombre comercial
  descripcion: string;            // Descripción breve
  fotos: string[];                // Array de URLs de imágenes
  medidas: {
    ancho: number;                // En metros
    largo: number;                // En metros
    alto: number;                 // En metros
  };
  capacidad: {
    ninos: number;                // Capacidad recomendada
    maximo: number;               // Capacidad máxima
  };
  edadRecomendada: {
    minima: number;               // Edad mínima
    maxima: number;               // Edad máxima
  };
  modelo3D: string;               // Ruta al archivo .glb/.gltf
  precio: number;                 // Precio en CLP
}
```

### Escalabilidad

Para agregar más inflables:
1. Agregar objeto a `inflables.json`
2. El sistema automáticamente lo reconoce
3. En el futuro, se puede crear página de catálogo

## WebXR y AR

### Inicialización

```typescript
// 1. Verificar soporte
const supported = await checkARSupport();

// 2. Solicitar permiso de cámara
const hasPermission = await requestCameraPermission();

// 3. Crear sesión AR
const session = await xr.requestSession('immersive-ar', {
  requiredFeatures: ['local-floor'],
});

// 4. Configurar Three.js
await gl.xr.setSession(session);
```

### Detección de Planos

- Usa `local-floor` para detectar el suelo automáticamente
- El modelo se posiciona en `[0, 0, 0]` relativo al suelo detectado
- El usuario puede mover y rotar con gestos táctiles

### Escalado Real

El modelo se escala automáticamente según las medidas reales:

```typescript
// Calcular escala basada en medidas reales
const scaleX = medidas.ancho / size.x;
const scaleY = medidas.alto / size.y;
const scaleZ = medidas.largo / size.z;
const scale = Math.min(scaleX, scaleY, scaleZ);
```

## Interacción Táctil

### Gestos Implementados

1. **Un dedo**: Rotación horizontal del modelo
2. **Dos dedos**: Movimiento en el plano horizontal

### Implementación

```typescript
// Detectar toque
handleTouchStart → isDragging = true

// Mover/Rotar
handleTouchMove → calcular delta → actualizar posición/rotación

// Finalizar
handleTouchEnd → isDragging = false
```

## Estilos y Responsive

### Enfoque Mobile-First

1. Diseño base para móviles (< 768px)
2. Breakpoints:
   - Tablet: 768px+
   - Desktop: 1024px+

### Variables CSS

Todas las variables están en `:root` para fácil personalización:
- Colores
- Espaciado
- Sombras
- Bordes

## Optimizaciones

### Rendimiento

1. **Lazy Loading**: ARViewer se carga dinámicamente
2. **Suspense**: Modelos 3D se cargan con Suspense
3. **DPR**: Canvas usa `dpr={[1, 2]}` para pantallas Retina

### Modelos 3D

- Formato GLB (binario, más eficiente)
- Optimización recomendada: < 50k polígonos
- Texturas comprimidas

## Extensibilidad Futura

### Preparado para:

1. **Backend**: Fácil migrar datos JSON a API
2. **Base de datos**: Estructura de datos lista
3. **Autenticación**: Componentes separados facilitan integración
4. **Reservas**: Lógica de negocio puede agregarse sin tocar AR
5. **Pagos**: Integración con Stripe/PayPal posible

### Puntos de Extensión

- `src/data/inflables.json` → API REST
- `InflableCard` → Agregar formulario de reserva
- `ARViewer` → Múltiples modelos simultáneos
- Nueva página → Catálogo completo

## Seguridad

- No hay datos sensibles en el cliente
- Permisos de cámara manejados correctamente
- WebXR requiere HTTPS (seguro por defecto)

## Testing (Futuro)

Estructura preparada para:
- Unit tests: `__tests__/` en cada componente
- Integration tests: Flujos completos
- E2E tests: Cypress/Playwright para AR

## Despliegue

### Requisitos

- HTTPS obligatorio (WebXR)
- Servidor Node.js o plataforma como Vercel
- CDN para assets estáticos (modelos, imágenes)

### Recomendado

- **Vercel**: Optimizado para Next.js
- **Netlify**: Buen soporte para estáticos
- **AWS Amplify**: Escalable

---

Esta arquitectura está diseñada para ser **simple ahora, escalable después**.


