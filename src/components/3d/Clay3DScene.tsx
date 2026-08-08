import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Clay3DScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Lights for Soft Studio Clay Effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 1.5); // Soft blue light
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xf472b6, 1.8, 10); // Soft pink accent glow
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Clay Materials (Soft gloss, low roughness, vibrant pastel colors)
    const clayBlue = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      roughness: 0.25,
      metalness: 0.05,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });

    const clayCoral = new THREE.MeshPhysicalMaterial({
      color: 0xf43f5e,
      roughness: 0.3,
      metalness: 0.05,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });

    const clayCyan = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      roughness: 0.2,
      metalness: 0.0,
      clearcoat: 0.8,
    });

    const clayWhite = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.0,
      clearcoat: 0.9,
    });

    // 3D Objects Group
    const group = new THREE.Group();

    // 1. Center Floating Donut (Torus)
    const torusGeo = new THREE.TorusGeometry(0.9, 0.45, 32, 64);
    const torusMesh = new THREE.Mesh(torusGeo, clayBlue);
    torusMesh.castShadow = true;
    torusMesh.receiveShadow = true;
    group.add(torusMesh);

    // 2. Floating Clay Sphere
    const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const sphereMesh = new THREE.Mesh(sphereGeo, clayCoral);
    sphereMesh.position.set(1.6, 0.9, 0.5);
    sphereMesh.castShadow = true;
    group.add(sphereMesh);

    // 3. Floating Rounded Clay Pill/Capsule
    const capsuleGeo = new THREE.CapsuleGeometry(0.35, 0.7, 16, 32);
    const capsuleMesh = new THREE.Mesh(capsuleGeo, clayCyan);
    capsuleMesh.position.set(-1.7, -0.8, 0.2);
    capsuleMesh.rotation.z = Math.PI / 4;
    group.add(capsuleMesh);

    // 4. Small White Shiny Clay Satellite
    const satGeo = new THREE.SphereGeometry(0.25, 32, 32);
    const satMesh = new THREE.Mesh(satGeo, clayWhite);
    satMesh.position.set(-1.2, 1.2, 0.8);
    group.add(satMesh);

    scene.add(group);

    // Mouse Interaction
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Continuous gentle floating & rotations
      torusMesh.rotation.x = elapsedTime * 0.4;
      torusMesh.rotation.y = elapsedTime * 0.6;

      sphereMesh.position.y = 0.9 + Math.sin(elapsedTime * 2) * 0.15;
      capsuleMesh.position.y = -0.8 + Math.cos(elapsedTime * 1.8) * 0.12;
      satMesh.position.x = -1.2 + Math.cos(elapsedTime * 2.5) * 0.2;
      satMesh.position.y = 1.2 + Math.sin(elapsedTime * 2.5) * 0.2;

      // Mouse Smooth Dampen
      group.rotation.y += (targetX - group.rotation.y) * 0.05;
      group.rotation.x += (-targetY - group.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full min-h-[320px] flex items-center justify-center relative ${className}`}
    />
  );
};
