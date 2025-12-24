/**
 * Tipos TypeScript para los datos de inflables
 */

export interface Medidas {
  ancho: number; // en metros
  largo: number; // en metros
  alto: number; // en metros
}

export interface Capacidad {
  ninos: number;
  maximo: number;
}

export interface EdadRecomendada {
  minima: number;
  maxima: number;
}

export interface Inflable {
  id: string;
  nombre: string;
  descripcion: string;
  fotos: string[];
  medidas: Medidas;
  capacidad: Capacidad;
  edadRecomendada: EdadRecomendada;
  modelo3D: string;
  precio: number;
}


