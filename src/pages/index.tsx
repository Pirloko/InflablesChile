'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import inflablesData from '@/data/inflables.json';
import type { Inflable } from '@/types/inflable';
import InflableCard from '@/components/InflableCard';

// Cargar ARView dinámicamente para evitar problemas de SSR
// ARView usa A-Frame + AR.js que requiere el navegador
const ARView = dynamic(() => import('@/components/ARView').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <div className="ar-loading">Cargando AR...</div>,
});

export default function Home() {
  const [selectedInflable, setSelectedInflable] = useState<Inflable | null>(null);
  const [showAR, setShowAR] = useState(false);

  // Por ahora, usar el primer inflable como ejemplo
  // En el futuro, esto podría venir de una URL o selección
  const inflable = inflablesData[0] as Inflable;

  const handleViewInAR = () => {
    setSelectedInflable(inflable);
    setShowAR(true);
  };

  const handleCloseAR = () => {
    setShowAR(false);
    setSelectedInflable(null);
  };

  if (showAR && selectedInflable) {
    return (
      <ARView inflable={selectedInflable} onClose={handleCloseAR} />
    );
  }

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>Inflables AR</h1>
        <p>Visualiza nuestros juegos inflables en tu espacio</p>
      </header>

      <main className="main-content">
        <InflableCard inflable={inflable} onViewInAR={handleViewInAR} />
      </main>

      <footer className="app-footer">
        <p>© 2024 Inflables AR - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}


