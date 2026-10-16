import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface GlassSculptureProps {
  useLive3D?: boolean;
}

export const GlassSculpture: React.FC<GlassSculptureProps> = ({ useLive3D = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse tilt effect for static high-res mode
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Live Three.js Scene implementation
  useEffect(() => {
    if (!useLive3D || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Central pearlescent sphere
    const sphereGeo = new THREE.SphereGeometry(0.7, 64, 64);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0x9370DB,
      emissive: 0x483D8B,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Iridescent outer torus knot / ribbon
    const knotGeo = new THREE.TorusKnotGeometry(1.3, 0.28, 200, 32, 2, 3);
    const knotMat = new THREE.MeshPhysicalMaterial({
      color: 0x88bbff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 1.5,
      dispersion: 0.08,
      iridescence: 1.0,
      iridescenceIOR: 1.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      attenuationColor: new THREE.Color(0x3B82F6),
      attenuationDistance: 0.8,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    scene.add(knot);

    // Studio Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0xff69b4, 2.5);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00bfff, 3.0);
    dirLight2.position.set(-3, -2, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 2, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      knot.rotation.x = elapsed * 0.35;
      knot.rotation.y = elapsed * 0.45;
      sphere.position.y = Math.sin(elapsed * 1.5) * 0.08;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
      if (container) container.innerHTML = '';
    };
  }, [useLive3D]);

  if (useLive3D) {
    return (
      <div 
        ref={mountRef} 
        className="w-full h-[320px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
      />
    );
  }

  return (
    <div 
      className="relative w-full h-[330px] flex items-center justify-center overflow-hidden select-none cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Soft Ambient Radial Behind the Glass */}
      <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-blue-300/30 via-purple-300/25 to-pink-200/30 blur-2xl pointer-events-none transform -translate-y-4" />

      {/* Floating 3D Artwork */}
      <div 
        className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(800px) rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)`
        }}
      >
        <img 
          src="/assets/glass-sculpture-transparent.png" 
          alt="Iridescent 3D Glass Ribbon"
          className="w-[92%] h-[92%] object-contain filter drop-shadow-[0_16px_22px_rgba(79,70,229,0.12)] transition-transform duration-500 group-hover:scale-105"
          draggable={false}
        />
      </div>

      {/* Soft floor shadow */}
      <div className="absolute bottom-4 w-44 h-4 bg-black/5 rounded-full blur-md transform scale-x-125 pointer-events-none" />
    </div>
  );
};
