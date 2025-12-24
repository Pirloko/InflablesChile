/**
 * Declaraciones de tipos para A-Frame
 * Permite que TypeScript reconozca los elementos HTML personalizados de A-Frame
 */

import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'vr-mode-ui'?: string;
        renderer?: string;
        arjs?: string;
        embedded?: boolean;
      };
      'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        camera?: boolean | string;
        'gps-camera'?: boolean | string;
        'rotation-reader'?: boolean | string;
        'gltf-model'?: string;
        scale?: string;
        position?: string;
        rotation?: string;
        'gps-entity-place'?: string;
        animation?: string;
        text?: string;
      };
      'a-light': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: string;
        color?: string;
        intensity?: string | number;
        position?: string;
      };
      'a-marker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: string;
        url?: string;
        raycaster?: string;
        emitevents?: string;
        cursor?: string;
      };
    }
  }
}

export {};

