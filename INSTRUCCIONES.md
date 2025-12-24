# 🚀 Instrucciones Rápidas de Instalación

## Paso 1: Instalar Dependencias

```bash
npm install
```

## Paso 2: Agregar Modelos 3D

1. Obtén modelos 3D de tus inflables en formato `.glb` o `.gltf`
2. Colócalos en la carpeta `public/models/`
3. Asegúrate de que las rutas en `src/data/inflables.json` coincidan

### ¿Dónde conseguir modelos 3D?

- **Sketchfab**: https://sketchfab.com (busca modelos gratuitos o de pago)
- **Poly Haven**: https://polyhaven.com/models
- **Crear tus propios**: Usa Blender (gratis) para crear o convertir modelos
- **Contratar diseñador 3D**: Para modelos personalizados de tus inflables

### Formato recomendado:
- **GLB** (preferido): Binario, más eficiente, un solo archivo
- **GLTF**: Texto + binarios, más flexible pero más archivos

## Paso 3: Agregar Imágenes

1. Coloca las fotos de tus inflables en `public/images/`
2. Actualiza las rutas en `src/data/inflables.json`

## Paso 4: Configurar WhatsApp

Edita `src/components/InflableCard/InflableCard.tsx` línea ~15:

```typescript
const phoneNumber = '+56912345678'; // Tu número real
```

## Paso 5: Ejecutar

```bash
npm run dev
```

Abre `http://localhost:3000` en tu navegador móvil o usa las herramientas de desarrollo del navegador para emular móvil.

## ⚠️ Importante para Probar AR

- **HTTPS requerido**: WebXR solo funciona en HTTPS o localhost
- **Dispositivo móvil real**: AR funciona mejor en dispositivos físicos
- **Navegador compatible**: 
  - Chrome (Android 8+)
  - Safari (iOS 15+)
  - Edge (Android)

## 📱 Probar en Dispositivo Móvil

1. Encuentra la IP de tu computadora:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Ejecuta Next.js en modo red:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

3. En tu móvil, abre: `http://TU_IP:3000`

## 🎨 Personalización

### Cambiar colores
Edita `src/styles/globals.css` y modifica las variables CSS:

```css
:root {
  --primary-color: #4a90e2;  /* Color principal */
  --secondary-color: #25d366; /* Color WhatsApp */
}
```

### Agregar más inflables
Edita `src/data/inflables.json` y agrega nuevos objetos siguiendo el mismo formato.

## 🐛 Problemas Comunes

### "AR no está disponible"
- Verifica que estés en HTTPS o localhost
- Usa un dispositivo móvil real
- Asegúrate de usar un navegador compatible

### "Modelo no aparece"
- Verifica que el archivo `.glb` existe en `public/models/`
- Revisa la consola del navegador (F12) para errores
- Asegúrate de que la ruta en `inflables.json` sea correcta

### "Permiso de cámara denegado"
- Ve a configuración del navegador
- Permite acceso a la cámara para este sitio
- Recarga la página

## 📦 Compilar para Producción

```bash
npm run build
npm start
```

Para desplegar en Vercel, Netlify u otro servicio:

```bash
# Vercel (recomendado para Next.js)
npm i -g vercel
vercel
```


