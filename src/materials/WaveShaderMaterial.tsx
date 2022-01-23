import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import glsl from 'babel-plugin-glsl/macro';

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  // provide a way to pass data from JS to shader, can be props eg. uHovered
  { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0), uTexture: new THREE.Texture(), uHovered: 0.0 },

  // Vertex shader
  // runs first, receives attributes and positions each vertex in a geometry
  glsl`
    // determines how much precision the GPU uses to calculate floats - also lowp and highp
    precision mediump float;
    uniform float uTime;
    uniform float uHovered;
    // varying allows you to send data from vertex shader to fragment shader
    varying vec2 vUv;
    varying float vWave;

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

    void main() {
      vUv = uv;

      vec3 pos = position;
      float noiseFreq = 1.5;
      float noiseAmp = uHovered;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  // Fragment shader
  // runs after vertex shader, sets colour of each fragment (pixel) of the geometry
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform float uHovered;
    uniform float uTime;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vWave;

    void main() {
      float blueWave = vWave * 0.1;
      float redWave = vWave * 0.2;
      float greenWave = vWave * 0.3;
      float r = texture2D(uTexture, vUv + redWave).r;
      float g = texture2D(uTexture, vUv + greenWave).g;
      float b = texture2D(uTexture, vUv + blueWave).b;
      vec3 texture = vec3(r, g, b);
      gl_FragColor = vec4(texture, 1.0);
    }
  `
);

export default WaveShaderMaterial;
