/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

// Type definitions for component props
export type MicStatus = 'idle' | 'starting' | 'active' | 'error';
type SceneType = 'basic-face' | 'game-of-life' | 'galaxy' | 'sun';

interface ControlTrayProps {
  activeScene: SceneType;
  onSceneChange: (scene: SceneType) => void;
  micStatus: MicStatus;
  onMicToggle: () => void;
}

/**
 * A UI component that provides controls for the audio visualizer.
 */
export const ControlTray: React.FC<ControlTrayProps> = ({ activeScene, onSceneChange, micStatus, onMicToggle }) => {
  const getMicButtonText = () => {
    switch (micStatus) {
      case 'active':
        return 'STOP MIC';
      case 'starting':
        return 'STARTING...';
      case 'error':
        return 'MIC ERROR';
      case 'idle':
      default:
        return 'START MIC';
    }
  };

  return (
    <div className="control-tray hud-panel">
      <div className="control-tray-item">
        <label htmlFor="scene-select">Active Visualizer</label>
        <select
          id="scene-select"
          value={activeScene}
          onChange={(e) => onSceneChange(e.target.value as SceneType)}
        >
          <option value="galaxy">AI GALAXY SIMULATION</option>
          <option value="sun">STELLAR FORGE</option>
          <option value="basic-face">AURELION CORE</option>
          <option value="game-of-life">GAME OF LIFE</option>
        </select>
      </div>

      <div className="control-tray-item">
        <label>Microphone Status</label>
        <button
          className="mic-control-button"
          onClick={onMicToggle}
          disabled={micStatus === 'starting'}
        >
          <div className={`mic-status-indicator ${micStatus === 'active' ? 'active' : ''}`}></div>
          {getMicButtonText()}
        </button>
      </div>
    </div>
  );
};