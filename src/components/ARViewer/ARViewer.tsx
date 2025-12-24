'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { checkARSupport, requestCameraPermission } from '@/utils/arUtils';
import type { Inflable } from '@/types/inflable';

/**
 * Componente que renderiza el modelo 3D del inflable
 */
function InflableModel({ 
  modelo3D, 
  medidas, 
  position, 
  rotation 
}: { 
  modelo3D: string;
  medidas: Inflable['medidas'];
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const { scene } = useGLTF(modelo3D);
  const meshRef = useRef<THREE.Group>(null);

  // Escalar el modelo según las medidas reales
  useEffect(() => {
    if (meshRef.current && scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      
      // Calcular escala basada en las medidas reales
      const scaleX = medidas.ancho / size.x;
      const scaleY = medidas.alto / size.y;
      const scaleZ = medidas.largo / size.z;
      
      // Usar el promedio para mantener proporciones
      const scale = Math.min(scaleX, scaleY, scaleZ);
      meshRef.current.scale.set(scale, scale, scale);
    }
  }, [scene, medidas]);

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      <primitive object={scene.clone()} />
    </group>
  );
}

/**
 * Componente para mostrar referencia de tamaño (grid en el suelo)
 */
function FloorGrid({ size = 10, divisions = 10 }: { size?: number; divisions?: number }) {
  return (
    <gridHelper args={[size, divisions, '#888888', '#cccccc']} position={[0, 0, 0]} />
  );
}

/**
 * Componente principal de la escena AR
 */
function ARScene({ 
  inflable, 
  onARReady 
}: { 
  inflable: Inflable;
  onARReady: (ready: boolean) => void;
}) {
  const { gl, camera } = useThree();
  const [arSession, setARSession] = useState<XRSession | null>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const rotationRef = useRef(0);

  // Inicializar WebXR
  useEffect(() => {
    const initAR = async () => {
      try {
        // Verificar soporte AR
        const supported = await checkARSupport();
        if (!supported) {
          console.warn('AR no está disponible, usando modo fallback');
          onARReady(false);
          return;
        }

        // Solicitar permiso de cámara
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
          alert('Se necesita permiso de cámara para usar AR');
          onARReady(false);
          return;
        }

        // Crear sesión AR
        const xr = (navigator as any).xr;
        const session = await xr.requestSession('immersive-ar', {
          requiredFeatures: ['local-floor'],
          optionalFeatures: ['bounded-floor', 'hand-tracking'],
        });

        setARSession(session);
        await gl.xr.setSession(session);
        
        // Configurar cámara para AR
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.near = 0.1;
          camera.far = 1000;
        }
        
        // La referencia espacial se maneja automáticamente por WebXR
        // con 'local-floor' especificado en requestSession

        onARReady(true);

        // Manejar cierre de sesión
        session.addEventListener('end', () => {
          setARSession(null);
          onARReady(false);
        });
      } catch (error) {
        console.error('Error inicializando AR:', error);
        onARReady(false);
      }
    };

    initAR();

    return () => {
      if (arSession) {
        arSession.end();
      }
    };
  }, [gl, camera, onARReady, arSession]);

  // Manejar interacción táctil para mover y rotar
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsDragging(true);
        lastTouchRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !lastTouchRef.current || e.touches.length === 0) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchRef.current.x;
      const deltaY = touch.clientY - lastTouchRef.current.y;

      // Rotación horizontal
      rotationRef.current += deltaX * 0.01;
      setRotation([0, rotationRef.current, 0]);

      // Movimiento en el plano (si hay dos toques)
      if (e.touches.length === 2) {
        const touch2 = e.touches[1];
        const midX = (touch.clientX + touch2.clientX) / 2;
        const midY = (touch.clientY + touch2.clientY) / 2;
        
        // Calcular movimiento basado en la posición media
        const moveX = (midX - lastTouchRef.current.x) * 0.001;
        const moveZ = (midY - lastTouchRef.current.y) * 0.001;
        
        setPosition(prev => [
          prev[0] + moveX,
          prev[1],
          prev[2] + moveZ,
        ]);
      }

      lastTouchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      lastTouchRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <FloorGrid size={10} divisions={10} />
      <InflableModel
        modelo3D={inflable.modelo3D}
        medidas={inflable.medidas}
        position={position}
        rotation={rotation}
      />
    </>
  );
}

/**
 * Componente principal ARViewer
 */
export default function ARViewer({ inflable }: { inflable: Inflable }) {
  const [arReady, setARReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await checkARSupport();
      if (!supported) {
        setError('Tu dispositivo no soporta Realidad Aumentada. Por favor, usa un dispositivo móvil compatible con WebXR.');
      }
      setLoading(false);
    };
    checkSupport();
  }, []);

  if (loading) {
    return (
      <div className="ar-viewer-loading">
        <p>Verificando compatibilidad...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ar-viewer-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="ar-viewer-container">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true,
        }}
        camera={{ position: [0, 1.6, 0], fov: 75 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ARScene inflable={inflable} onARReady={setARReady} />
        </Suspense>
      </Canvas>
      {!arReady && (
        <div className="ar-viewer-overlay">
          <p>Inicializando Realidad Aumentada...</p>
          <p className="ar-hint">Apunta la cámara hacia el suelo para detectar el plano</p>
        </div>
      )}
    </div>
  );
}

