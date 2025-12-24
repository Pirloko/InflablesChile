# Inflables AR - Aplicación WebAR para Arriendo de Juegos Inflables

Aplicación web de Realidad Aumentada (WebAR) desarrollada con React/Next.js, Three.js y WebXR para visualizar juegos inflables en el espacio real del usuario mediante la cámara del dispositivo móvil.

## 🎯 Características

- **Visualización AR en tiempo real**: Visualiza inflables en escala real en tu espacio
- **Interacción táctil**: Mueve y rota el modelo con gestos táctiles
- **Datos locales**: Toda la información se carga desde archivos JSON (sin backend)
- **Responsive**: Diseño mobile-first optimizado para dispositivos móviles
- **Integración WhatsApp**: Botón directo para contactar y arrendar

## 🛠️ Tecnologías

- **Next.js 14**: Framework React con SSR/SSG
- **React 18**: Biblioteca UI
- **Three.js**: Motor de renderizado 3D
- **@react-three/fiber**: Renderer React para Three.js
- **@react-three/drei**: Utilidades y helpers para Three.js
- **WebXR API**: API nativa del navegador para Realidad Aumentada
- **TypeScript**: Tipado estático

## 📁 Estructura del Proyecto

```
InflablesAR/
├── src/
│   ├── components/
│   │   ├── ARViewer/          # Componente principal de AR
│   │   │   ├── ARViewer.tsx
│   │   │   └── index.ts
│   │   └── InflableCard/      # Tarjeta de información del inflable
│   │       ├── InflableCard.tsx
│   │       └── index.ts
│   ├── pages/
│   │   ├── _app.tsx           # Configuración de Next.js
│   │   └── index.tsx          # Página principal
│   ├── data/
│   │   └── inflables.json     # Datos de los inflables
│   ├── types/
│   │   └── inflable.ts        # Tipos TypeScript
│   ├── utils/
│   │   └── arUtils.ts         # Utilidades para WebXR
│   └── styles/
│       └── globals.css         # Estilos globales
├── public/
│   ├── models/                # Modelos 3D (.glb/.gltf)
│   └── images/                # Imágenes de los inflables
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+ y npm/yarn
- Dispositivo móvil compatible con WebXR (Android 8+ con Chrome, iOS 15+ con Safari)

### Pasos

1. **Instalar dependencias**:
```bash
npm install
```

2. **Agregar modelos 3D**:
   - Coloca tus modelos `.glb` o `.gltf` en `public/models/`
   - Actualiza las rutas en `src/data/inflables.json`

3. **Agregar imágenes**:
   - Coloca las fotos de los inflables en `public/images/`
   - Actualiza las rutas en `src/data/inflables.json`

4. **Ejecutar en desarrollo**:
```bash
npm run dev
```

5. **Abrir en el navegador**:
   - En desarrollo: `http://localhost:3000`
   - **Importante**: Para probar AR, accede desde un dispositivo móvil real o usa herramientas de desarrollo del navegador con emulación móvil

6. **Compilar para producción**:
```bash
npm run build
npm start
```

## 📱 Uso de AR

1. Abre la aplicación en un dispositivo móvil compatible
2. Haz clic en "Ver en mi espacio"
3. Permite el acceso a la cámara cuando se solicite
4. Apunta la cámara hacia el suelo para detectar el plano
5. El inflable aparecerá en escala real
6. Usa gestos táctiles para:
   - **Un dedo**: Rotar el modelo
   - **Dos dedos**: Mover el modelo en el plano

## 🏗️ Arquitectura

### Componentes Principales

1. **ARViewer**: Componente principal que maneja:
   - Inicialización de WebXR
   - Detección de planos horizontales
   - Renderizado del modelo 3D
   - Interacción táctil

2. **InflableCard**: Muestra:
   - Información del inflable
   - Galería de fotos
   - Especificaciones (medidas, capacidad, edad)
   - Botones de acción

3. **Sistema de Datos**:
   - `inflables.json`: Fuente única de verdad
   - Fácilmente escalable para agregar más inflables
   - Tipado con TypeScript para seguridad

### Flujo de AR

```
Usuario → Click "Ver en mi espacio"
  ↓
Verificar soporte WebXR
  ↓
Solicitar permiso de cámara
  ↓
Crear sesión AR
  ↓
Detectar plano horizontal
  ↓
Renderizar modelo 3D en escala real
  ↓
Habilitar interacción táctil
```

## 🔧 Configuración

### Agregar un nuevo inflable

Edita `src/data/inflables.json`:

```json
{
  "id": "nuevo-inflable",
  "nombre": "Nombre del Inflable",
  "descripcion": "Descripción...",
  "fotos": ["/images/nuevo-1.jpg"],
  "medidas": {
    "ancho": 3.0,
    "largo": 4.0,
    "alto": 2.5
  },
  "capacidad": {
    "ninos": 6,
    "maximo": 8
  },
  "edadRecomendada": {
    "minima": 3,
    "maxima": 12
  },
  "modelo3D": "/models/nuevo-inflable.glb",
  "precio": 50000
}
```

### Configurar WhatsApp

Edita `src/components/InflableCard/InflableCard.tsx`:

```typescript
const phoneNumber = '+56912345678'; // Tu número de WhatsApp
```

### Modelos 3D

- Formato recomendado: `.glb` (binario, más eficiente)
- Alternativa: `.gltf` (texto + binarios)
- Herramientas para crear/editar: Blender, Sketchfab
- Optimización: Reduce polígonos y texturas para mejor rendimiento móvil

## 🐛 Troubleshooting

### AR no funciona

1. **Verifica compatibilidad**: Solo funciona en dispositivos móviles con WebXR
2. **HTTPS requerido**: WebXR requiere conexión segura (HTTPS o localhost)
3. **Permisos de cámara**: Asegúrate de permitir el acceso a la cámara
4. **Navegador compatible**: Chrome (Android) o Safari (iOS 15+)

### Modelo no aparece

1. Verifica que la ruta del modelo en `inflables.json` sea correcta
2. Asegúrate de que el archivo `.glb` existe en `public/models/`
3. Revisa la consola del navegador para errores de carga

### Rendimiento lento

1. Optimiza los modelos 3D (menos polígonos)
2. Reduce el tamaño de las texturas
3. Usa formatos comprimidos (`.glb`)

## 🔮 Futuras Mejoras

- [ ] Sistema de reservas con backend
- [ ] Integración de pagos
- [ ] Múltiples inflables en la misma vista
- [ ] Comparación lado a lado
- [ ] Guardar capturas de pantalla
- [ ] Compartir vista AR
- [ ] Análisis de espacio disponible
- [ ] Modo oscuro

## 📄 Licencia

Este proyecto es privado y está destinado para uso comercial de la PYME.

## 👨‍💻 Desarrollo

Desarrollado con ❤️ usando tecnologías web modernas para crear experiencias AR accesibles sin necesidad de apps nativas.

---

**Nota**: Esta es una versión MVP. Para producción, considera agregar:
- Manejo de errores más robusto
- Analytics
- Optimización de imágenes (Next.js Image)
- PWA (Progressive Web App)
- Testing automatizado


