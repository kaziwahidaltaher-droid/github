/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Analyser } from './analyser';
import { LensConfig } from './ArtisticLensPanel';
import { galaxyVertexShader, galaxyFragmentShader } from './galaxy-point-shaders';

// Define the props for the visualizer component
export interface GalaxyVisualizerProps {
  analyser?: Analyser;
  lensConfig: LensConfig;
}

/**
 * A React component that renders a procedural, audio-reactive galaxy.
 */
export const GalaxyVisualizer: React.FC<GalaxyVisualizerProps> = ({ analyser, lensConfig }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    camera.lookAt(0,0,0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // --- Galaxy Generation ---
    const particleCount = 100000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorInside = new THREE.Color('#ff6030');
    const colorOutside = new THREE.Color('#00e5ff');

    const branches = 4;
    const radius = 15;
    const spin = 1;
    const randomnessPower = 3;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Position
        const r = Math.random() * radius;
        const spinAngle = r * spin;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;

        const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * 2;
        const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
        const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * 2;

        positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;
        
        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, r / radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        // Scale
        scales[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    
    // --- Material ---
    const material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uAudio: { value: 0 },
        }
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        material.uniforms.uTime.value = elapsedTime;
        
        if (analyser) {
            const averageFrequency = analyser.getAverageFrequency() / 255.0; // Normalize to 0-1
            material.uniforms.uAudio.value = averageFrequency;
        }
        
        // Animate camera
        camera.position.x = Math.sin(elapsedTime * 0.05) * 15;
        camera.position.z = Math.cos(elapsedTime * 0.05) * 15;
        camera.lookAt(0,0,0);
        
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
        geometry.dispose();
        material.dispose();
    };
  }, [analyser]);

  return (
    <div className="visualizer-scene">
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      <div className="visualizer-overlay">
        <h2 className="visualizer-title">AI GALAXY SIMULATION</h2>
        <p className="visualizer-subtitle">PROCEDURAL GALAXY REACTING TO LIVE AUDIO</p>
      </div>
    </div>
  );
};
