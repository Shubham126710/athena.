import React, { useRef, Suspense, useEffect } from 'react';
import gsap from 'gsap';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial, useTexture } from '@react-three/drei';

// --- 1. Dither Shader Material ---
// This shader reads a texture and maps its luminance to a bayer dither matrix.
const DitherMaterial = shaderMaterial(
  {
    uColor: new THREE.Color('#f4f3ee'), // Ivory dots
    uBgColor: new THREE.Color('#0a0a0a'), // Black background
    uMap: null, // Texture
    uTime: 0,
    uReveal: 0.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uMap;
    uniform vec3 uColor;
    uniform vec3 uBgColor;
    uniform float uTime;
    uniform float uReveal;
    varying vec2 vUv;

    float bayer4x4(vec2 uv) {
        int x = int(mod(uv.x, 4.0));
        int y = int(mod(uv.y, 4.0));
        int index = y * 4 + x;
        if (index == 0) return 0.0/16.0;
        if (index == 1) return 8.0/16.0;
        if (index == 2) return 2.0/16.0;
        if (index == 3) return 10.0/16.0;
        if (index == 4) return 12.0/16.0;
        if (index == 5) return 4.0/16.0;
        if (index == 6) return 14.0/16.0;
        if (index == 7) return 6.0/16.0;
        if (index == 8) return 3.0/16.0;
        if (index == 9) return 11.0/16.0;
        if (index == 10) return 1.0/16.0;
        if (index == 11) return 9.0/16.0;
        if (index == 12) return 15.0/16.0;
        if (index == 13) return 7.0/16.0;
        if (index == 14) return 13.0/16.0;
        if (index == 15) return 5.0/16.0;
        return 0.0;
    }

    void main() {
      vec4 texColor = texture2D(uMap, vUv);
      
      // Calculate luminance
      float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      
      // Increase contrast so edges dissolve cleanly into black
      luminance = smoothstep(0.05, 0.8, luminance);
      
      // Reveal animation wipe from bottom to top with some noise
      // Digital matrix-style wipe with noise
      float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
      float wipe = smoothstep(uReveal - 0.3, uReveal + 0.3, vUv.y + (noise * 0.2));
      luminance *= (1.0 - wipe);
      
      // Ensure transparent areas in the texture do not produce dots
      luminance *= texColor.a;

      // Bayer dither calculation based on screen coordinates
      vec2 xy = gl_FragCoord.xy / 2.0; // scale the dots
      float threshold = bayer4x4(xy);
      
      if (luminance > threshold) {
        gl_FragColor = vec4(uColor, 1.0);
      } else {
        // Discard the background so it blends completely with the HTML element
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    }
  `
);

extend({ DitherMaterial });

function AthenaBust({ color, bgColor }) {
  // Load the generated Athena bust image
  const texture = useTexture('/athena_bust.png');
  const materialRef = useRef();

  const meshRef = useRef();


  useEffect(() => {
    if (materialRef.current) {
        materialRef.current.uReveal = -0.2;
        const proxy = { val: -0.2 };
        gsap.to(proxy, {
            val: 1.2,
            duration: 2.5,
            ease: "power2.inOut",
            delay: 2.2, // 2s loading screen + 0.2s stagger
            onUpdate: () => {
                if (materialRef.current) {
                    materialRef.current.uReveal = proxy.val;
                }
            }
        });
    }
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      // Gentle vertical floating
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      // Subtle rotation following the mouse
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (state.pointer.x * Math.PI) / 30, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -(state.pointer.y * Math.PI) / 30, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <ditherMaterial 
        ref={materialRef} 
        uMap={texture} 
        uColor={new THREE.Color(color)} 
        uBgColor={new THREE.Color(bgColor)} 
        transparent={true}
      />
    </mesh>
  );
}

export default function DitherHero({ color = '#f4f3ee', backgroundColor = '#000000', className = "absolute bottom-0 right-[-10%] w-[70%] h-[90%] md:w-[55%] md:h-[100%] md:right-[-5%] z-0" }) {
  return (
    <div className={`pointer-events-none overflow-visible flex items-end ${className}`}>
      <Canvas 
        orthographic 
        camera={{ zoom: 45, position: [0, 0, 100] }}
        gl={{ alpha: true, antialias: false }}
        className="w-full h-full"
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <AthenaBust color={color} bgColor={backgroundColor} />
        </Suspense>
      </Canvas>
    </div>
  );
}
