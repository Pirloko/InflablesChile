# Inflables AR - Visualización 3D

Aplicación web moderna para visualizar juegos inflables en 3D usando la cámara del dispositivo.

## 🎯 Características

- ✅ Acceso a cámara del dispositivo (Web Camera API)
- ✅ Renderizado de modelos 3D (.glb) con Three.js y React Three Fiber
- ✅ Controles interactivos:
  - Mover el modelo (arrastrar)
  - Escalar el modelo (+ / -)
  - Rotar el modelo
- ✅ Diseño moderno y responsive (mobile-first)
- ✅ Interfaz intuitiva y fácil de usar

## 🚀 Tecnologías

- **React 18** + **TypeScript**
- **Three.js** - Renderizado 3D
- **React Three Fiber** - Integración React con Three.js
- **@react-three/drei** - Utilidades para React Three Fiber
- **Vite** - Build tool y dev server

## 📦 Instalación

```bash
npm install
```

## 🛠️ Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`

## 🏗️ Build para Producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

## 📱 Uso

1. Abre la aplicación en tu navegador (preferiblemente en un dispositivo móvil)
2. Haz clic en "Activar Cámara"
3. Permite el acceso a la cámara cuando se solicite
4. El modelo 3D aparecerá superpuesto sobre la vista de la cámara
5. Usa los controles para:
   - **Arrastrar** el modelo para moverlo
   - **+ / -** para escalar
   - **↶ / ↷** para rotar
   - **Resetear** para volver a la posición inicial

## 📂 Estructura del Proyecto

```
InflablesAR/
├── public/
│   └── models/
│       └── InflableOficialglb.glb  # Modelo 3D
├── src/
│   ├── components/
│   │   ├── CameraView.tsx          # Vista principal con cámara
│   │   ├── CameraView.css
│   │   ├── Model3D.tsx             # Componente del modelo 3D
│   │   ├── Controls.tsx            # Controles de interacción
│   │   └── Controls.css
│   ├── App.tsx                      # Componente principal
│   ├── App.css
│   ├── main.tsx                     # Punto de entrada
│   └── index.css                   # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── netlify.toml                     # Configuración para Netlify
```

## 🌐 Despliegue en Netlify

1. Conecta tu repositorio a Netlify
2. Configuración de build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Netlify detectará automáticamente el archivo `netlify.toml`

O simplemente arrastra la carpeta `dist` a Netlify Drop.

## ⚠️ Notas Importantes

- Esta es una **visualización referencial**, no una aplicación de realidad aumentada real
- Las proporciones pueden no ser exactas
- Requiere acceso a la cámara del dispositivo
- Funciona mejor en dispositivos móviles con cámara trasera
- El modelo 3D debe estar en formato `.glb` y ubicado en `public/models/`

## 🔧 Agregar Nuevos Modelos

Para agregar un nuevo modelo 3D:

1. Coloca el archivo `.glb` en `public/models/`
2. Actualiza la ruta en `src/components/Model3D.tsx`:

```typescript
const { scene } = useGLTF('/models/tu-modelo.glb')
useGLTF.preload('/models/tu-modelo.glb')
```

## 📄 Licencia

Este proyecto es de uso libre para fines comerciales y personales.
