'use client';

import { useEffect, useRef, useState } from 'react';
import type { Inflable } from '@/types/inflable';

// Extender la interfaz Window para incluir AFRAME
declare global {
  interface Window {
    AFRAME?: any;
  }
}

/**
 * Componente WebAR usando A-Frame + AR.js
 * Funciona con cámara del celular, sin lentes VR, sin marcadores físicos
 * Usa markerless AR basado en location-based tracking
 */
export default function ARView({ inflable, onClose }: { inflable: Inflable; onClose: () => void }) {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const sceneRef = useRef<HTMLDivElement>(null);
  const aframeLoaded = useRef(false);

  // Solicitar permiso de cámara
  useEffect(() => {
    const requestCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment' // Cámara trasera en móviles
          } 
        });
        // Detener el stream, solo necesitábamos el permiso
        stream.getTracks().forEach(track => track.stop());
        setCameraPermission(true);
        setLoading(false);
      } catch (err) {
        console.error('Error solicitando cámara:', err);
        setError('Se necesita permiso de cámara para usar AR. Por favor, permite el acceso a la cámara en la configuración de tu navegador.');
        setLoading(false);
      }
    };

    requestCamera();
  }, []);

  // Cargar A-Frame y AR.js dinámicamente
  useEffect(() => {
    if (!cameraPermission) return;

    // Verificar si A-Frame ya está cargado
    if (typeof window !== 'undefined' && window.AFRAME) {
      console.log('A-Frame ya está cargado');
      aframeLoaded.current = true;
      setLoading(false);
      // Intentar cargar AR.js si no está presente
      if (!document.querySelector('script[src*="ar.js"]')) {
        console.log('Intentando cargar AR.js...');
        const arjsScript = document.createElement('script');
        arjsScript.src = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.2/aframe/build/aframe-ar.js';
        arjsScript.async = true;
        document.head.appendChild(arjsScript);
      }
      return;
    }

    console.log('Cargando A-Frame...');
    // Cargar A-Frame
    const aframeScript = document.createElement('script');
    aframeScript.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
    aframeScript.async = true;
    
    aframeScript.onload = () => {
      console.log('A-Frame cargado, cargando AR.js...');
      // Cargar AR.js después de A-Frame
      // Intentar múltiples URLs como fallback
      const arjsUrls = [
        'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.2/aframe/build/aframe-ar.js',
        'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js',
        'https://unpkg.com/ar.js@3.4.2/aframe/build/aframe-ar.js'
      ];
      
      let currentUrlIndex = 0;
      
      const tryLoadARJS = () => {
        if (currentUrlIndex >= arjsUrls.length) {
          console.warn('No se pudo cargar AR.js desde ningún CDN, continuando con A-Frame');
          aframeLoaded.current = true;
          setLoading(false);
          return;
        }
        
        const arjsScript = document.createElement('script');
        arjsScript.src = arjsUrls[currentUrlIndex];
        arjsScript.async = true;
        
        arjsScript.onload = () => {
          console.log('AR.js cargado correctamente desde:', arjsUrls[currentUrlIndex]);
          aframeLoaded.current = true;
          setLoading(false);
        };
        
        arjsScript.onerror = () => {
          console.warn('Error cargando AR.js desde:', arjsUrls[currentUrlIndex]);
          currentUrlIndex++;
          tryLoadARJS(); // Intentar siguiente URL
        };
        
        document.head.appendChild(arjsScript);
      };
      
      tryLoadARJS();
      
      // Timeout de seguridad: si AR.js no carga en 8 segundos, continuar de todos modos
      setTimeout(() => {
        if (!aframeLoaded.current) {
          console.warn('Timeout esperando AR.js, continuando con A-Frame');
          aframeLoaded.current = true;
          setLoading(false);
        }
      }, 8000);
    };
    
    aframeScript.onerror = (err) => {
      console.error('Error cargando A-Frame:', err);
      setError('Error cargando A-Frame. Por favor, verifica tu conexión a internet.');
    };
    
    document.head.appendChild(aframeScript);

    return () => {
      // Limpiar si es necesario
    };
  }, [cameraPermission]);

  if (loading) {
    return (
      <div className="ar-view-loading">
        <div className="ar-loading-content">
          <p>Verificando permisos de cámara...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ar-view-error">
        <div className="ar-error-content">
          <p>{error}</p>
          <button className="btn-close-ar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  // Renderizar la escena tan pronto como A-Frame esté disponible
  // AR.js se cargará automáticamente cuando detecte los atributos arjs en a-scene
  const isAFrameReady = aframeLoaded.current || (typeof window !== 'undefined' && window.AFRAME);
  
  if (!isAFrameReady && cameraPermission) {
    return (
      <div className="ar-view-loading">
        <div className="ar-loading-content">
          <p>Cargando AR...</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>
            Esto puede tardar unos segundos
          </p>
        </div>
      </div>
    );
  }
  
  // Si A-Frame está listo pero aún no hemos marcado como cargado, hacerlo ahora
  if (isAFrameReady && !aframeLoaded.current) {
    aframeLoaded.current = true;
  }

  // Ruta del modelo 3D
  // El modelo debe estar en /public/models/
  // Puedes reemplazar fácilmente el modelo cambiando esta ruta
  const modelPath = inflable.modelo3D || '/models/InflableOficialglb.glb';
  
  // Calcular escala basada en las medidas reales (1 unidad = 1 metro)
  const scale = `${inflable.medidas.ancho} ${inflable.medidas.alto} ${inflable.medidas.largo}`;

  return (
    <div className="ar-view-container">
      <button className="btn-close-ar" onClick={onClose}>
        ✕ Cerrar AR
      </button>
      
      {/* Escena A-Frame con AR.js - Markerless AR */}
      {/* Usa location-based AR que funciona sin marcadores físicos */}
      <a-scene
        ref={sceneRef}
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; colorManagement: true; sortObjects: true"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3; cameraParametersUrl: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/camera_para.dat; maxDetectionRate: 60; canvasWidth: 1280; canvasHeight: 720;"
        embedded
        style={{ width: '100%', height: '100%' }}
      >
        {/* Cámara AR con tracking markerless usando location-based */}
        <a-entity
          camera
          gps-camera
          rotation-reader
        ></a-entity>

        {/* Iluminación */}
        <a-light type="ambient" color="#ffffff" intensity="0.7"></a-light>
        <a-light type="directional" position="1 1 1" intensity="0.9"></a-light>

        {/* Modelo 3D del inflable - Markerless AR */}
        {/* gps-entity-place permite ubicar el modelo sin marcadores físicos */}
        <a-entity
          gltf-model={`url(${modelPath})`}
          scale={scale}
          position="0 0 -1"
          rotation="0 0 0"
          gps-entity-place="latitude: 0; longitude: 0;"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 20000; easing: linear"
        ></a-entity>

        {/* Indicador de ayuda */}
        <a-entity
          text="value: Mueve tu dispositivo para ver el modelo; align: center; width: 5; color: white; background: rgba(0,0,0,0.6)"
          position="0 1.8 -0.5"
          scale="1.5 1.5 1.5"
        ></a-entity>
      </a-scene>

      {/* Overlay de instrucciones */}
      <div className="ar-instructions">
        <p>Mueve tu dispositivo para ver el modelo en tu espacio</p>
        <p className="ar-hint">Apunta la cámara hacia una superficie plana</p>
      </div>
    </div>
  );
}

