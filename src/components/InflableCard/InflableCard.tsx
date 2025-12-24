'use client';

import { useState } from 'react';
import type { Inflable } from '@/types/inflable';
import { generateWhatsAppMessage } from '@/utils/arUtils';

interface InflableCardProps {
  inflable: Inflable;
  onViewInAR: () => void;
}

export default function InflableCard({ inflable, onViewInAR }: InflableCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handleWhatsApp = () => {
    const message = generateWhatsAppMessage(inflable);
    const phoneNumber = '+56912345678'; // Reemplazar con número real
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % inflable.fotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + inflable.fotos.length) % inflable.fotos.length);
  };

  return (
    <div className="inflable-card">
      <div className="inflable-header">
        <h1 className="inflable-title">{inflable.nombre}</h1>
        <p className="inflable-description">{inflable.descripcion}</p>
      </div>

      <div className="inflable-photos">
        <div className="photo-container">
          {inflable.fotos.length > 1 && (
            <>
              <button className="photo-nav prev" onClick={prevPhoto} aria-label="Foto anterior">
                ‹
              </button>
              <button className="photo-nav next" onClick={nextPhoto} aria-label="Foto siguiente">
                ›
              </button>
            </>
          )}
          <div className="photo-placeholder">
            {/* Placeholder para imágenes - en producción usar Next Image */}
            <span>📷 {inflable.fotos[currentPhotoIndex]}</span>
          </div>
          {inflable.fotos.length > 1 && (
            <div className="photo-indicators">
              {inflable.fotos.map((_, index) => (
                <span
                  key={index}
                  className={`indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                  onClick={() => setCurrentPhotoIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="inflable-specs">
        <div className="spec-group">
          <h3>Medidas</h3>
          <div className="spec-grid">
            <div className="spec-item">
              <span className="spec-label">Ancho</span>
              <span className="spec-value">{inflable.medidas.ancho}m</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Largo</span>
              <span className="spec-value">{inflable.medidas.largo}m</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Alto</span>
              <span className="spec-value">{inflable.medidas.alto}m</span>
            </div>
          </div>
        </div>

        <div className="spec-group">
          <h3>Capacidad</h3>
          <p className="spec-text">
            Hasta {inflable.capacidad.ninos} niños (máximo {inflable.capacidad.maximo} personas)
          </p>
        </div>

        <div className="spec-group">
          <h3>Edad Recomendada</h3>
          <p className="spec-text">
            De {inflable.edadRecomendada.minima} a {inflable.edadRecomendada.maxima} años
          </p>
        </div>

        <div className="spec-group">
          <h3>Precio</h3>
          <p className="spec-price">${inflable.precio.toLocaleString('es-CL')}</p>
        </div>
      </div>

      <div className="inflable-actions">
        <button className="btn-primary btn-ar" onClick={onViewInAR}>
          Ver en mi espacio
        </button>
        <button className="btn-secondary btn-whatsapp" onClick={handleWhatsApp}>
          Arrendar ahora
        </button>
      </div>
    </div>
  );
}

