/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Analyser } from './analyser';
import { LensConfig } from './ArtisticLensPanel';

// Props interface for the component
export interface BasicFaceRenderProps {
  analyser?: Analyser;
  lensConfig: LensConfig;
}

// Simple shaders for a futuristic fresnel/glow effect
const faceVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const faceFragmentShader = `
  varying vec3 vNormal;
  uniform vec3 glowColor;
  uniform float power;
  uniform float intensity;

  void main() {
    // Calculate a fresnel effect: more glow at the edges
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), power) * intensity;
    gl_FragColor = vec4(glowColor * fresnel, fresnel);
  }
`;


/**
 * A React component that renders a 3D audio-reactive face using Three.js.
 */
export const BasicFaceRender: React.FC<BasicFaceRenderProps> = ({ analyser, lensConfig }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<{ wireframe: THREE.MeshBasicMaterial; glow: THREE.ShaderMaterial } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // --- Basic Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // --- 3D Objects ---
    const geometry = new THREE.IcosahedronGeometry(2, 6);
    
    // 1. Main wireframe mesh
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
    });
    const faceMesh = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(faceMesh);

    // 2. Glow mesh using a custom fresnel shader
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: faceVertexShader,
      fragmentShader: faceFragmentShader,
      uniforms: {
        glowColor: { value: new THREE.Color(0x00e5ff) },
        power: { value: 2.5 },
        intensity: { value: 1.0 },
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      side: THREE.BackSide, // Render the inside of the mesh
    });

    const glowMesh = new THREE.Mesh(geometry, glowMaterial);
    glowMesh.scale.setScalar(1.05); // Make it slightly larger than the wireframe
    scene.add(glowMesh);

    materialsRef.current = { wireframe: wireframeMaterial, glow: glowMaterial };

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Audio reactivity logic
      if (analyser) {
        const averageFrequency = analyser.getAverageFrequency() / 128.0; // Normalize to ~0-2 range
        const scale = 1 + averageFrequency * 0.05;
        faceMesh.scale.setScalar(scale);
        
        const glowScale = 1.05 + averageFrequency * 0.05;
        glowMesh.scale.setScalar(glowScale);
        
        // Make glow pulse with audio
        glowMaterial.uniforms.intensity.value = 1.0 + averageFrequency * 0.75;
      }

      // Add subtle rotation
      faceMesh.rotation.y = elapsedTime * 0.1;
      glowMesh.rotation.y = elapsedTime * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize Handling ---
    const handleResize = () => {
      if (!currentMount) return;
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentMount);

    // --- Cleanup ---
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
          currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      wireframeMaterial.dispose();
      glowMaterial.dispose();
    };
  }, [analyser]);

  // Effect to update materials based on lensConfig
  useEffect(() => {
    if (!materialsRef.current) return;
    const { wireframe, glow } = materialsRef.current;
    
    // Example: change color based on grading
    const newColor = lensConfig.colorGrading === 'Vintage' ? 0xffa500 : 0x00e5ff;
    wireframe.color.setHex(newColor);
    glow.uniforms.glowColor.value.setHex(newColor);
    
    // Example: change bloom
    // Note: True bloom is a post-processing effect, this is a simple intensity adjustment
    glow.uniforms.intensity.value = 0.5 + lensConfig.bloom * 1.5;

  }, [lensConfig]);


  // The div that Three.js will render into
  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />;
};