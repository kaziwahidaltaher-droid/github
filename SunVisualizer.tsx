/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Analyser } from './analyser';
import { LensConfig } from './ArtisticLensPanel';
import {
  sunVertexShader,
  sunFragmentShader,
  atmosphereVertexShader,
  atmosphereFragmentShader
} from './sun-shader';

// Define the props for the visualizer component
export interface SunVisualizerProps {
  analyser?: Analyser;
  lensConfig: LensConfig;
}

/**
 * A React component that renders a stylized, audio-reactive sun.
 */
export const SunVisualizer: React.FC<SunVisualizerProps> = ({ analyser, lensConfig }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<{ sun: THREE.ShaderMaterial; atmosphere: THREE.ShaderMaterial } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // --- Sun Object ---
    const sunGeometry = new THREE.SphereGeometry(4, 64, 64);
    
    // Sun surface material
    const sunMaterial = new THREE.ShaderMaterial({
      vertexShader: sunVertexShader,
      fragmentShader: sunFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAudio: { value: 0 },
        uColor1: { value: new THREE.Color('#ff8c00') }, // Dark orange
        uColor2: { value: new THREE.Color('#ffd700') }, // Gold
      },
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sunMesh);

    // --- Atmosphere Object ---
    const atmosphereGeometry = new THREE.SphereGeometry(4, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uGlowColor: { value: new THREE.Color('#ff4500') }, // Orange-Red
        uPower: { value: 3.0 },
        uIntensity: { value: 1.0 },
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphereMesh.scale.setScalar(1.2);
    scene.add(atmosphereMesh);

    materialsRef.current = { sun: sunMaterial, atmosphere: atmosphereMaterial };
    
    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      sunMaterial.uniforms.uTime.value = elapsedTime;
      sunMesh.rotation.y = elapsedTime * 0.05;

      if (analyser) {
        const avgFreq = analyser.getAverageFrequency() / 255.0; // Normalize 0-1
        sunMaterial.uniforms.uAudio.value = avgFreq;
        
        // Pulse the atmosphere's intensity and scale with the audio
        const intensity = 1.0 + avgFreq * 2.0;
        const scale = 1.2 + avgFreq * 0.1;
        atmosphereMaterial.uniforms.uIntensity.value = intensity;
        atmosphereMesh.scale.setScalar(scale);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handling ---
    const handleResize = () => {
      if (!currentMount) return;
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentMount);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sunGeometry.dispose();
      atmosphereGeometry.dispose();
      sunMaterial.dispose();
      atmosphereMaterial.dispose();
    };
  }, [analyser]);

  // Effect to update materials based on lensConfig changes
  useEffect(() => {
    if (!materialsRef.current) return;
    const { sun, atmosphere } = materialsRef.current;

    // Example: Change sun color based on color grading preset
    let color1 = '#ff8c00';
    let color2 = '#ffd700';
    let glowColor = '#ff4500';

    if (lensConfig.colorGrading === 'Cyberpunk') {
        color1 = '#005f73'; // Dark cyan
        color2 = '#0a9396'; // Lighter cyan
        glowColor = '#94d2bd'; // Teal
    } else if (lensConfig.colorGrading === 'Vintage') {
        color1 = '#ae2012'; // Dark red
        color2 = '#bb3e03'; // Orange
        glowColor = '#ee9b00'; // Gold
    }
    
    sun.uniforms.uColor1.value.set(color1);
    sun.uniforms.uColor2.value.set(color2);
    atmosphere.uniforms.uGlowColor.value.set(glowColor);

  }, [lensConfig]);


  return (
    <div className="visualizer-scene">
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div className="visualizer-overlay">
        <h2 className="visualizer-title">STELLAR FORGE</h2>
        <p className="visualizer-subtitle">LIVE AUDIO-REACTIVE STAR SIMULATION</p>
      </div>
    </div>
  );
};