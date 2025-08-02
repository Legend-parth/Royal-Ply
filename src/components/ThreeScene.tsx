import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  mousePosition: { x: number; y: number };
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ mousePosition }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x6F00FF, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x5B2C6F, 0.8, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create wood textures for each face
    const createWoodTexture = (pattern: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Base wood color
        const gradient = ctx.createLinearGradient(0, 0, 512, 0);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(0.3, '#A0522D');
        gradient.addColorStop(0.6, '#CD853F');
        gradient.addColorStop(1, '#DEB887');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add wood grain based on pattern
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        
        if (pattern === 'horizontal') {
          for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 17 + Math.random() * 10);
            ctx.lineTo(512, i * 17 + Math.random() * 10);
            ctx.stroke();
          }
        } else if (pattern === 'vertical') {
          for (let i = 0; i < 30; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 17 + Math.random() * 10, 0);
            ctx.lineTo(i * 17 + Math.random() * 10, 512);
            ctx.stroke();
          }
        } else if (pattern === 'diagonal') {
          for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 13);
            ctx.lineTo(512, i * 13 + 100);
            ctx.stroke();
          }
        }
        
        // Add purple glow effect
        ctx.globalCompositeOperation = 'overlay';
        const purpleGradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        purpleGradient.addColorStop(0, 'rgba(111, 0, 255, 0.1)');
        purpleGradient.addColorStop(1, 'rgba(91, 44, 111, 0.05)');
        ctx.fillStyle = purpleGradient;
        ctx.fillRect(0, 0, 512, 512);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    // Create materials for each face
    const materials = [
      new THREE.MeshLambertMaterial({ map: createWoodTexture('horizontal') }), // Right
      new THREE.MeshLambertMaterial({ map: createWoodTexture('horizontal') }), // Left
      new THREE.MeshLambertMaterial({ map: createWoodTexture('vertical') }),   // Top
      new THREE.MeshLambertMaterial({ map: createWoodTexture('vertical') }),   // Bottom
      new THREE.MeshLambertMaterial({ map: createWoodTexture('diagonal') }),   // Front
      new THREE.MeshLambertMaterial({ map: createWoodTexture('diagonal') }),   // Back
    ];

    // Create plywood cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cubeRef.current = cube;
    scene.add(cube);

    // Add click interaction
    const handleClick = () => {
      if (cube) {
        // Spin animation on click
        const currentRotation = cube.rotation.y;
        const targetRotation = currentRotation + Math.PI / 2;
        
        const animate = () => {
          cube.rotation.y += (targetRotation - cube.rotation.y) * 0.1;
          if (Math.abs(targetRotation - cube.rotation.y) > 0.01) {
            requestAnimationFrame(animate);
          }
        };
        animate();
      }
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };

    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mouseenter', handleMouseEnter);
    renderer.domElement.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (cube) {
        // Continuous rotation (faster on hover)
        const rotationSpeed = isHoveredRef.current ? 0.02 : 0.005;
        cube.rotation.x += rotationSpeed;
        cube.rotation.y += rotationSpeed;
        
        // Floating motion
        cube.position.y = Math.sin(Date.now() * 0.001) * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mouseenter', handleMouseEnter);
      renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      materials.forEach(material => material.dispose());
    };
  }, []);

  // Mouse interaction for parallax
  useEffect(() => {
    if (!cubeRef.current) return;

    const normalizedX = (mousePosition.x / window.innerWidth) * 2 - 1;
    const normalizedY = -(mousePosition.y / window.innerHeight) * 2 + 1;

    cubeRef.current.rotation.z = normalizedX * 0.1;
    cubeRef.current.position.x = normalizedX * 0.3;
    cubeRef.current.position.y = normalizedY * 0.3 + Math.sin(Date.now() * 0.001) * 0.2;
  }, [mousePosition]);

  return (
    <div 
      ref={mountRef} 
      className="three-scene interactive"
      style={{ background: 'transparent' }}
    />
  );
};

export default ThreeScene;