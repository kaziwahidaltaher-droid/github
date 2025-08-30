/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const galaxyVertexShader = `
  attribute float aScale;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uAudio;

  varying vec3 vColor;

  void main() {
    vColor = aColor;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Add a circular rotation over time
    float angle = uTime * 0.1;
    modelPosition.x = modelPosition.x * cos(angle) - modelPosition.z * sin(angle);
    modelPosition.z = modelPosition.x * sin(angle) + modelPosition.z * cos(angle);

    // Make particles "pulse" with the audio
    float audioScale = 1.0 + uAudio * 0.5;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Set particle size based on distance and audio
    gl_PointSize = aScale * 2.0 * audioScale * (300.0 / -viewPosition.z);
  }
`;

export const galaxyFragmentShader = `
  varying vec3 vColor;

  void main() {
    // Create a soft, circular point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - step(0.5, strength);

    // Fade out at the edges
    float alpha = 1.0 - smoothstep(0.4, 0.5, distance(gl_PointCoord, vec2(0.5)));

    gl_FragColor = vec4(vColor, alpha * strength);
  }
`;
