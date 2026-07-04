/* eslint-disable react/no-unknown-property */
import { useRef, useEffect, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, wrapEffect } from '@react-three/postprocessing';
import { Effect } from 'postprocessing';
import * as THREE from 'three';

import './Dither.css';

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2)); 
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(vec3(0.0), waveColor, f);
  gl_FragColor = vec4(col, 1.0);
}
`;

const ditherFragmentShader = `
precision highp float;
uniform float colorNum;
uniform float pixelSize;
uniform vec2 resolution;

float getBayer8x8(int x, int y) {
  int index = y * 8 + x;
  if (index == 0) return 0.0/64.0;
  if (index == 1) return 48.0/64.0;
  if (index == 2) return 12.0/64.0;
  if (index == 3) return 60.0/64.0;
  if (index == 4) return 3.0/64.0;
  if (index == 5) return 51.0/64.0;
  if (index == 6) return 15.0/64.0;
  if (index == 7) return 63.0/64.0;
  if (index == 8) return 32.0/64.0;
  if (index == 9) return 16.0/64.0;
  if (index == 10) return 44.0/64.0;
  if (index == 11) return 28.0/64.0;
  if (index == 12) return 35.0/64.0;
  if (index == 13) return 19.0/64.0;
  if (index == 14) return 47.0/64.0;
  if (index == 15) return 31.0/64.0;
  if (index == 16) return 8.0/64.0;
  if (index == 17) return 56.0/64.0;
  if (index == 18) return 4.0/64.0;
  if (index == 19) return 52.0/64.0;
  if (index == 20) return 11.0/64.0;
  if (index == 21) return 59.0/64.0;
  if (index == 22) return 7.0/64.0;
  if (index == 23) return 55.0/64.0;
  if (index == 24) return 40.0/64.0;
  if (index == 25) return 24.0/64.0;
  if (index == 26) return 36.0/64.0;
  if (index == 27) return 20.0/64.0;
  if (index == 28) return 43.0/64.0;
  if (index == 29) return 27.0/64.0;
  if (index == 30) return 39.0/64.0;
  if (index == 31) return 23.0/64.0;
  if (index == 32) return 2.0/64.0;
  if (index == 33) return 50.0/64.0;
  if (index == 34) return 14.0/64.0;
  if (index == 35) return 62.0/64.0;
  if (index == 36) return 1.0/64.0;
  if (index == 37) return 49.0/64.0;
  if (index == 38) return 13.0/64.0;
  if (index == 39) return 61.0/64.0;
  if (index == 40) return 34.0/64.0;
  if (index == 41) return 18.0/64.0;
  if (index == 42) return 46.0/64.0;
  if (index == 43) return 30.0/64.0;
  if (index == 44) return 33.0/64.0;
  if (index == 45) return 17.0/64.0;
  if (index == 46) return 45.0/64.0;
  if (index == 47) return 29.0/64.0;
  if (index == 48) return 10.0/64.0;
  if (index == 49) return 58.0/64.0;
  if (index == 50) return 6.0/64.0;
  if (index == 51) return 54.0/64.0;
  if (index == 52) return 9.0/64.0;
  if (index == 53) return 57.0/64.0;
  if (index == 54) return 5.0/64.0;
  if (index == 55) return 53.0/64.0;
  if (index == 56) return 42.0/64.0;
  if (index == 57) return 26.0/64.0;
  if (index == 58) return 38.0/64.0;
  if (index == 59) return 22.0/64.0;
  if (index == 60) return 41.0/64.0;
  if (index == 61) return 25.0/64.0;
  if (index == 62) return 37.0/64.0;
  if (index == 63) return 21.0/64.0;
  return 0.0;
}

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = getBayer8x8(x, y) - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`;

class RetroEffectImpl extends Effect {
  constructor() {
    const uniforms = new Map([
      ['colorNum', new THREE.Uniform(4.0)],
      ['pixelSize', new THREE.Uniform(2.0)],
      ['resolution', new THREE.Uniform(new THREE.Vector2(window.innerWidth || 1920, window.innerHeight || 1080))]
    ]);
    super('RetroEffect', ditherFragmentShader, { uniforms });
    this.uniforms = uniforms;
  }
  setSize(width, height) {
    if (this.uniforms) this.uniforms.get('resolution').value.set(width, height);
  }
  set colorNum(v) {
    if (this.uniforms) this.uniforms.get('colorNum').value = v;
  }
  get colorNum() {
    return this.uniforms?.get('colorNum')?.value ?? 4.0;
  }
  set pixelSize(v) {
    if (this.uniforms) this.uniforms.get('pixelSize').value = v;
  }
  get pixelSize() {
    return this.uniforms?.get('pixelSize')?.value ?? 2.0;
  }
}

const WrappedRetro = wrapEffect(RetroEffectImpl);

const RetroEffect = forwardRef((props, ref) => {
  const { colorNum, pixelSize } = props;
  return <WrappedRetro ref={ref} colorNum={colorNum} pixelSize={pixelSize} />;
});
RetroEffect.displayName = 'RetroEffect';

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius
}) {
  const mesh = useRef(null);
  const mouseRef = useRef(new THREE.Vector2());
  const { viewport, size, gl } = useThree();

  const waveUniformsRef = useRef({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(waveColor[0], waveColor[1], waveColor[2])),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius)
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const w = Math.floor(size.width * dpr),
      h = Math.floor(size.height * dpr);
    const res = waveUniformsRef.current.resolution.value;
    if (res.x !== w || res.y !== h) {
      res.set(w, h);
    }
  }, [size, gl]);

  const prevColor = useRef([...waveColor]);
  useFrame(({ clock }) => {
    const u = waveUniformsRef.current;

    if (!disableAnimation) {
      u.time.value = clock.getElapsedTime();
    }

    if (u.waveSpeed.value !== waveSpeed) u.waveSpeed.value = waveSpeed;
    if (u.waveFrequency.value !== waveFrequency) u.waveFrequency.value = waveFrequency;
    if (u.waveAmplitude.value !== waveAmplitude) u.waveAmplitude.value = waveAmplitude;

    if (!prevColor.current.every((v, i) => v === waveColor[i])) {
      u.waveColor.value.setRGB(waveColor[0], waveColor[1], waveColor[2]);
      prevColor.current = [...waveColor];
    }

    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    u.mouseRadius.value = mouseRadius;

    if (enableMouseInteraction) {
      u.mousePos.value.copy(mouseRef.current);
    }
  });

  const handlePointerMove = e => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    mouseRef.current.set((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
  };

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniformsRef.current}
        />
      </mesh>

      <EffectComposer>
        <RetroEffect colorNum={colorNum} pixelSize={pixelSize} />
      </EffectComposer>

      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1
}) {
  return (
    <Canvas
      className="dither-container"
      camera={{ position: [0, 0, 6] }}
      dpr={1}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <DitheredWaves
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        waveColor={waveColor}
        colorNum={colorNum}
        pixelSize={pixelSize}
        disableAnimation={disableAnimation}
        enableMouseInteraction={enableMouseInteraction}
        mouseRadius={mouseRadius}
      />
    </Canvas>
  );
}
