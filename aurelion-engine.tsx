/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

// Define the props for the engine component
export interface AurelionEngineProps {
  children: React.ReactNode;
}

/**
 * The main container for the AURELION visualizer scenes.
 * This component provides a consistent wrapper for different visualizations.
 */
export const AurelionEngine: React.FC<AurelionEngineProps> = ({ children }) => {
  return (
    <div className="aurelion-engine">
      {children}
    </div>
  );
};