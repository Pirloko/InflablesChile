import { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Model3D from './Model3D'
import Controls from './Controls'
import './CameraView.css'

interface CameraViewProps {
  onClose: () => void
}

const CameraView = ({ onClose }: CameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estado para los controles del modelo
  const [modelPosition, setModelPosition] = useState({ x: 0, y: 0, z: 0 })
  const [modelScale, setModelScale] = useState(1)
  const [modelRotation, setModelRotation] = useState(0)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Cámara trasera en móviles
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play()
              setIsCameraReady(true)
            }
          }
        }
      } catch (err) {
        console.error('Error al acceder a la cámara:', err)
        setError('No se pudo acceder a la cámara. Por favor, permite el acceso en la configuración del navegador.')
      }
    }

    startCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    onClose()
  }

  return (
    <div className="camera-view">
      <div className="camera-container">
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          playsInline
          muted
        />
        
        {isCameraReady && (
          <div className="canvas-overlay">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              gl={{ alpha: true, antialias: true }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} />
              
              <Model3D
                position={[modelPosition.x, modelPosition.y, modelPosition.z]}
                scale={modelScale}
                rotation={[0, modelRotation, 0]}
              />
            </Canvas>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button className="btn-secondary" onClick={handleClose}>
              Volver
            </button>
          </div>
        )}
      </div>

      {isCameraReady && (
        <Controls
          position={modelPosition}
          scale={modelScale}
          rotation={modelRotation}
          onPositionChange={setModelPosition}
          onScaleChange={setModelScale}
          onRotationChange={setModelRotation}
          onClose={handleClose}
        />
      )}

      <div className="disclaimer-overlay">
        <p>⚠️ Visualización referencial. Las proporciones pueden no ser exactas.</p>
      </div>
    </div>
  )
}

export default CameraView

