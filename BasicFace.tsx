/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Analyser } from './analyser';
import { BasicFaceRender } from './basic-face-render';
import { LensConfig } from './ArtisticLensPanel';

// Define the props for the visualizer component
export interface BasicFaceProps {
  analyser?: Analyser;
  lensConfig: LensConfig;
}

/**
 * A higher-level component that represents the "Basic Face" audio visualizer scene.
 * It encapsulates the core rendering component and includes a UI overlay.
 */
export const BasicFace: React.FC<BasicFaceProps> = ({ analyser, lensConfig }) => {
  return (
    <div className="visualizer-scene">
      {/* The core Three.js renderer for the face */}
      <BasicFaceRender analyser={analyser} lensConfig={lensConfig} />
      
      {/* UI Overlay */}
      <div className="visualizer-overlay">
        <h2 className="visualizer-title">AURELION CORE</h2>
        <p className="visualizer-subtitle">VISUALIZING AUDIO STREAM</p>
      </div>
    </div>
  );
};