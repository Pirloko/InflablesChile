import { useState } from 'react'
import CameraView from './components/CameraView'
import './App.css'

function App() {
  const [isCameraActive, setIsCameraActive] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Inflables AR</h1>
        <p className="subtitle">Visualización 3D de Juegos Inflables</p>
      </header>

      <main className="app-main">
        {!isCameraActive ? (
          <div className="landing-view">
            <div className="landing-content">
              <div className="landing-icon">🎈</div>
              <h2>Visualiza tu juego inflable</h2>
              <p className="landing-description">
                Activa tu cámara para ver cómo se vería el juego inflable en tu espacio.
                Esta es una visualización referencial.
              </p>
              <button
                className="btn-primary"
                onClick={() => setIsCameraActive(true)}
              >
                Activar Cámara
              </button>
              <p className="disclaimer">
                ⚠️ Visualización referencial. Las proporciones pueden no ser exactas.
              </p>
            </div>
          </div>
        ) : (
          <CameraView onClose={() => setIsCameraActive(false)} />
        )}
      </main>
    </div>
  )
}

export default App

