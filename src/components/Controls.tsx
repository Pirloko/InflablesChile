import { useState, useRef } from 'react'
import './Controls.css'

interface ControlsProps {
  position: { x: number; y: number; z: number }
  scale: number
  rotation: number
  onPositionChange: (position: { x: number; y: number; z: number }) => void
  onScaleChange: (scale: number) => void
  onRotationChange: (rotation: number) => void
  onClose: () => void
}

const Controls = ({
  position,
  scale,
  rotation,
  onPositionChange,
  onScaleChange,
  onRotationChange,
  onClose
}: ControlsProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const positionStartRef = useRef({ x: 0, y: 0 })

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    dragStartRef.current = { x: touch.clientX, y: touch.clientY }
    positionStartRef.current = { ...position }
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const touch = e.touches[0]
    const deltaX = (touch.clientX - dragStartRef.current.x) * 0.01
    const deltaY = -(touch.clientY - dragStartRef.current.y) * 0.01

    onPositionChange({
      x: positionStartRef.current.x + deltaX,
      y: positionStartRef.current.y + deltaY,
      z: position.z
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    positionStartRef.current = { ...position }
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = (e.clientX - dragStartRef.current.x) * 0.01
    const deltaY = -(e.clientY - dragStartRef.current.y) * 0.01

    onPositionChange({
      x: positionStartRef.current.x + deltaX,
      y: positionStartRef.current.y + deltaY,
      z: position.z
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleScaleChange = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(3, scale + delta))
    onScaleChange(newScale)
  }

  const handleRotationChange = (delta: number) => {
    onRotationChange(rotation + delta)
  }

  const resetModel = () => {
    onPositionChange({ x: 0, y: 0, z: 0 })
    onScaleChange(1)
    onRotationChange(0)
  }

  return (
    <div className="controls-container">
      <div
        className="drag-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />

      <div className="controls-panel">
        <button className="btn-close" onClick={onClose} aria-label="Cerrar cámara">
          ✕
        </button>

        <div className="controls-group">
          <div className="control-section">
            <label>Escala</label>
            <div className="button-group">
              <button
                className="btn-control"
                onClick={() => handleScaleChange(-0.1)}
                aria-label="Reducir escala"
              >
                −
              </button>
              <span className="control-value">{scale.toFixed(1)}x</span>
              <button
                className="btn-control"
                onClick={() => handleScaleChange(0.1)}
                aria-label="Aumentar escala"
              >
                +
              </button>
            </div>
          </div>

          <div className="control-section">
            <label>Rotación</label>
            <div className="button-group">
              <button
                className="btn-control"
                onClick={() => handleRotationChange(-0.2)}
                aria-label="Rotar izquierda"
              >
                ↶
              </button>
              <span className="control-value">{Math.round((rotation * 180) / Math.PI)}°</span>
              <button
                className="btn-control"
                onClick={() => handleRotationChange(0.2)}
                aria-label="Rotar derecha"
              >
                ↷
              </button>
            </div>
          </div>

          <button className="btn-reset" onClick={resetModel}>
            Resetear
          </button>
        </div>

        <p className="controls-hint">
          💡 Arrastra el modelo para moverlo
        </p>
      </div>
    </div>
  )
}

export default Controls

