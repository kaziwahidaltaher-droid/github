/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { AudioStreamer } from './audio-streamer';
import { Analyser } from './analyser';
import { LensConfig } from './ArtisticLensPanel';
import { AurelionEngine } from './aurelion-engine';
import { ControlTray, MicStatus } from './ControlTray';
import { BasicFace } from './BasicFace';
import { GameOfLifeVisualizer } from './GameOfLifeVisualizer';
import { GalaxyVisualizer } from './GalaxyVisualizer';
import { SunVisualizer } from './SunVisualizer';

// Define the props for the main visualizer app component
export interface AurelionAppProps {
  audioStreamer: AudioStreamer;
  lensConfig: LensConfig;
}

type SceneType = 'basic-face' | 'game-of-life' | 'galaxy' | 'sun';

/**
 * The main component that orchestrates the AURELION visualizer experience.
 */
export const AurelionApp: React.FC<AurelionAppProps> = ({ audioStreamer, lensConfig }) => {
  const [analyser, setAnalyser] = useState<Analyser | undefined>(undefined);
  const [activeScene, setActiveScene] = useState<SceneType>('galaxy');
  const [micStatus, setMicStatus] = useState<MicStatus>('idle');

  useEffect(() => {
    if (!audioStreamer) return;

    const handleStatusChange = (status: MicStatus) => setMicStatus(status);
    const handleAnalyserCreated = (newAnalyser: Analyser) => setAnalyser(newAnalyser);
    
    // Subscribe to events from the audio streamer
    const unsubStatus = audioStreamer.on('status', handleStatusChange);
    const unsubAnalyser = audioStreamer.on('analyser', handleAnalyserCreated);

    // Set initial state
    setMicStatus(audioStreamer.getStatus());
    setAnalyser(audioStreamer.getAnalyser());

    // Cleanup subscriptions on component unmount
    return () => {
      unsubStatus();
      unsubAnalyser();
    };
  }, [audioStreamer]);

  const handleMicToggle = () => {
    if (audioStreamer.isRecordingActive()) {
        audioStreamer.stop();
    } else {
        audioStreamer.start();
    }
  };

  const renderScene = () => {
    switch (activeScene) {
      case 'basic-face':
        return <BasicFace analyser={analyser} lensConfig={lensConfig} />;
      case 'game-of-life':
        return <GameOfLifeVisualizer analyser={analyser} lensConfig={lensConfig} />;
      case 'galaxy':
        return <GalaxyVisualizer analyser={analyser} lensConfig={lensConfig} />;
      case 'sun':
        return <SunVisualizer analyser={analyser} lensConfig={lensConfig} />;
      default:
        return null;
    }
  };

  return (
    <div className="aurelion-app">
      <AurelionEngine>
        {renderScene()}
      </AurelionEngine>
      <ControlTray
        activeScene={activeScene}
        onSceneChange={setActiveScene}
        micStatus={micStatus}
        onMicToggle={handleMicToggle}
      />
    </div>
  );
};