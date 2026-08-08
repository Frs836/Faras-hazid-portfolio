import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface Hero3DProps {
  theme: 'light' | 'dark';
  className?: string;
}

export const Hero3D: React.FC<Hero3DProps> = ({ theme, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Studio reflections (RoomEnvironment = neutral HDR room)
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const mat = new THREE.MeshPhysicalMaterial({
      color: theme === 'dark' ? 0x2c2c34 : 0x17171c,
      metalness: 0.9,
      roughness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      envMapIntensity: 1.3,
    });
    matRef.current = mat;

    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.15, 0.36, 220, 32), mat);
    scene.add(knot);

    // Signature accent rim light
    const rim = new THREE.PointLight(new THREE.Color('#f5a93a'), 40, 20, 1.6);
    rim.position.set(3.5, 2, 3);
    scene.add(rim);

    // Parallax state
    let mx = 0;
    let my = 0;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      my = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const clock = new THREE.Clock();
    const baseRotY = theme === 'dark' ? 0.16 : 0.12;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (prefersReduced) {
        knot.rotation.y = baseRotY * t;
        knot.rotation.x = 0.3;
      } else {
        knot.rotation.x += (0.3 + my * 0.28 - knot.rotation.x) * 0.05;
        knot.rotation.y += (baseRotY * t + mx * 0.4 - knot.rotation.y) * 0.05;
      }
      knot.position.y = prefersReduced ? 0 : Math.sin(t * 0.7) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      knot.geometry.dispose();
      mat.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
      matRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Theme-aware material tint (canvas is transparent; CSS handles page bg)
  useEffect(() => {
    if (matRef.current) {
      matRef.current.color.set(theme === 'dark' ? 0x2c2c34 : 0x17171c);
    }
  }, [theme]);

  return <div ref={mountRef} className={`w-full h-full ${className}`} aria-hidden="true" />;
};
