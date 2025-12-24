/**
 * Utilidades para WebXR y Realidad Aumentada
 */

/**
 * Verifica si el navegador soporta WebXR
 */
export const isWebXRAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'xr' in navigator;
};

/**
 * Verifica si WebXR está disponible y si el dispositivo soporta AR
 */
export const checkARSupport = async (): Promise<boolean> => {
  if (!isWebXRAvailable()) return false;

  try {
    const session = await (navigator as any).xr?.isSessionSupported?.('immersive-ar');
    return session === true;
  } catch (error) {
    console.error('Error checking AR support:', error);
    return false;
  }
};

/**
 * Solicita permisos de cámara
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Detener el stream inmediatamente, solo necesitábamos el permiso
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

/**
 * Convierte metros a unidades de Three.js (1 metro = 1 unidad)
 */
export const metersToThreeUnits = (meters: number): number => {
  return meters;
};

/**
 * Genera mensaje de WhatsApp predefinido
 */
export const generateWhatsAppMessage = (inflable: { nombre: string; precio: number }): string => {
  const message = `Hola! Me interesa arrendar el ${inflable.nombre} por $${inflable.precio.toLocaleString('es-CL')}. ¿Está disponible?`;
  return encodeURIComponent(message);
};


