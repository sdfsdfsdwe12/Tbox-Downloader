import { Scene, PerspectiveCamera, WebGLRenderer, SphereGeometry, MeshBasicMaterial, Mesh } from "https://unpkg.com/three@0.132.2/build/three.module.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("hero-canvas");

  if (!canvas) return;

  // Set up Three.js scene
  const scene = new Scene();
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create moving objects
  const objects = [];
  const colors = [0xff5500, 0x9900ff, 0x00ffcc];

  for (let i = 0; i < 30; i++) {
    const geometry = new SphereGeometry(Math.random() * 0.5 + 0.1, 16, 16);
    const material = new MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      transparent: true,
      opacity: 0.7,
    });

    const mesh = new Mesh(geometry, material);

    // Position randomly in 3D space
    mesh.position.x = (Math.random() - 0.5) * 20;
    mesh.position.y = (Math.random() - 0.5) * 20;
    mesh.position.z = (Math.random() - 0.5) * 20 - 5;

    // Store random movement values
    mesh.velocity = {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01,
    };

    scene.add(mesh);
    objects.push(mesh);
  }

  camera.position.z = 5;

  // Handle window resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handleResize);

  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);

    // Move objects
    objects.forEach((obj) => {
      obj.position.x += obj.velocity.x;
      obj.position.y += obj.velocity.y;
      obj.position.z += obj.velocity.z;

      // Rotate objects
      obj.rotation.x += 0.005;
      obj.rotation.y += 0.005;

      // Bounce at boundaries
      if (Math.abs(obj.position.x) > 10) obj.velocity.x *= -1;
      if (Math.abs(obj.position.y) > 10) obj.velocity.y *= -1;
      if (Math.abs(obj.position.z) > 10) obj.velocity.z *= -1;
    });

    // Rotate camera slightly for dynamic effect
    camera.position.x = Math.sin(Date.now() * 0.0001) * 0.5;
    camera.position.y = Math.cos(Date.now() * 0.0001) * 0.5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };

  animate();
});
