/* ============================================================================
   model.js  —  Configuración de escena Three.js con manejo de múltiples modelos GLB
   Descripción: Este archivo gestiona la creación de una escena 3D en Three.js con la capacidad de cargar y mostrar modelos GLB. Además, maneja la interacción con el scroll y las animaciones a través de GSAP y ScrollTrigger.

   Fix: El canvas (.model) ya no se queda en mitad de la pantalla tras un resize. 
   Solo se han añadido unas 15 líneas marcadas con “// ★ NUEVO” para solucionar esto.
   ========================================================================== */

// Importación de dependencias necesarias
import { gsap } from "gsap"; // Librería para animaciones
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Plugin de GSAP para gestionar animaciones basadas en scroll
import * as THREE from "three"; // Biblioteca Three.js para gráficos 3D
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; // Cargador de modelos GLB
import lenis from "./initLenis.js"; // Inicialización de Lenis para scroll suave

// Registro del plugin ScrollTrigger en GSAP
gsap.registerPlugin(ScrollTrigger);

// Variables globales para gestionar la escena y los modelos
let modelCanvas, scene, camera, renderer;
let currentModel3D;
let currentScroll = 0;
let basicAnimationFrameId;
let activeModel = null;
let mainLoopStarted = false;
const loadedModels = []; // Array que almacenará los modelos cargados
const modelPaths = [
  // Array con las rutas a los modelos GLB a cargar
  "/wp-content/themes/checkcreative/assets/dist/models/ipa.glb",
  "/wp-content/themes/checkcreative/assets/dist/models/lager.glb",
  "/wp-content/themes/checkcreative/assets/dist/models/negra.glb",
  "/wp-content/themes/checkcreative/assets/dist/models/rubia.glb",
  "/wp-content/themes/checkcreative/assets/dist/models/tostada-fuerte.glb",
];

/* 1 · Función de inicialización de la escena 3D en Three.js -------------------- */
export function initModelScene() {
  // Selección de elementos en el DOM
  modelCanvas = document.querySelector(".model");
  const swiperSection = document.querySelector(".section-product-swiper");
  if (!modelCanvas || !swiperSection) return; // ★ NUEVO: salimos de la función si no existen los elementos necesarios

  /* 2 · Configuración de la escena Three.js --------------------------------- */
  scene = new THREE.Scene(); // Creación de la escena
  camera = new THREE.PerspectiveCamera( // Configuración de la cámara 3D
    75,
    window.innerWidth / window.innerHeight,
    0.1, // Distancia de visión cercana
    1000 // Distancia de visión lejana
  );
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Inicialización del renderer
  renderer.setClearColor(0x000000, 0); // Establecer color de fondo transparente
  renderer.setSize(window.innerWidth, window.innerHeight); // Establecer tamaño del canvas
  renderer.setPixelRatio(window.devicePixelRatio); // Ajustar la relación de píxeles según el dispositivo
  renderer.physicallyCorrectLights = true; // Iluminación física correcta
  renderer.toneMapping = THREE.ACESFilmicToneMapping; // Mapeo de tonos
  renderer.toneMappingExposure = 0.5; // Exposición
  modelCanvas.appendChild(renderer.domElement); // Añadir el renderer al DOM

  /* 3 · Configuración de luces en la escena --------------------------------- */
  scene.add(new THREE.AmbientLight(0xffffff, 3)); // Luz ambiental
  const mainLight = new THREE.DirectionalLight(0xffffff, 1); // Luz direccional principal
  mainLight.position.set(5, 10, 7.5); // Posición de la luz principal
  scene.add(mainLight); // Añadir a la escena
  const fillLight = new THREE.DirectionalLight(0xffffff, 3); // Luz de relleno
  fillLight.position.set(-5, 0, -5); // Posición de la luz de relleno
  scene.add(fillLight); // Añadir a la escena
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2); // Luz hemisférica
  hemiLight.position.set(0, 25, 0); // Posición de la luz hemisférica
  scene.add(hemiLight); // Añadir a la escena

  // Configuración de ScrollTrigger para la sección de swiper
  ScrollTrigger.create({
    trigger: swiperSection, // Activación cuando la sección del swiper entra en la vista
    start: "top top", // Comienza cuando la parte superior del swiper está en la parte superior de la ventana
    end: "bottom bottom", // Termina cuando la parte inferior del swiper llega a la parte inferior de la ventana
    onEnter: () => {
      isFloating = false; // Detener el modelo de flotar

      if (!modelCanvas) return;

      if (currentModel3D) {
        currentModel3D.position.y = 0; // Ajustar la posición Y del modelo
        gsap.to(currentModel3D.rotation, {
          // Animar la rotación del modelo
          y: currentModel3D.rotation.y + Math.PI * 2,
          duration: 1,
          ease: "power2.inOut",
        });
      }
    },
    onLeave: () => {
      if (!modelCanvas) return;

      const rect = modelCanvas.getBoundingClientRect(); // Obtener las coordenadas del modelo
      const scrollY = window.scrollY || window.pageYOffset; // Obtener la posición del scroll
      modelCanvas.style.position = "absolute"; // Establecer posición absoluta
      modelCanvas.style.top = `${rect.top + scrollY}px`; // Posicionar el modelo en el lugar correcto
    },
    onEnterBack: () => {
      isFloating = false;
      if (!modelCanvas) return;
      modelCanvas.style.position = "fixed"; // Fijar la posición del modelo
      modelCanvas.style.top = "0"; // Alinearlo con la parte superior
    },
    onRefresh(self) {
      updateModelCanvasAbsoluteTop(); // Actualizar la posición del modelo al refrescar
    },
  });

  /* ★ NUEVO — Función de actualización de la posición del canvas del modelo */
  function updateModelCanvasAbsoluteTop() {
    if (!modelCanvas) return;
    if (modelCanvas.style.position !== "absolute") return;
    if (!swiperSection) return;

    const newTop =
      swiperSection.offsetTop + swiperSection.offsetHeight - window.innerHeight;
    modelCanvas.style.top = `${newTop}px`; // Actualiza la posición superior
  }

  ScrollTrigger.addEventListener("refresh", updateModelCanvasAbsoluteTop); // ★ NUEVO: Escuchar evento de refresh de ScrollTrigger para actualizar la posición

  /* 5 · Lenis scroll (gestión de scroll suave) --------------------------- */
  lenis.on("scroll", (e) => (currentScroll = e.scroll)); // Actualizar valor de scroll con Lenis

  /* 6 · Listener de resize para manejar cambios en el tamaño de la ventana */
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight; // Ajustar aspecto de la cámara
    camera.updateProjectionMatrix(); // Actualizar la matriz de proyección de la cámara
    renderer.setSize(window.innerWidth, window.innerHeight); // Ajustar el tamaño del renderer

    ScrollTrigger.refresh(); // Refrescar ScrollTrigger
    updateModelCanvasAbsoluteTop(); // Actualizar posición del canvas del modelo
  });
}

/* -------------------------------------------------------------------------
   Precarga de modelos GLB
------------------------------------------------------------------------- */
export function preloadModels() {
  if (!scene) return Promise.resolve(); // Si no hay escena, devolver una promesa resuelta

  const loader = new GLTFLoader(); // Cargador de modelos GLB
  const promises = modelPaths.map(
    (url, i) =>
      new Promise((res, rej) => {
        loader.load(
          url, // Cargar modelo desde la ruta
          (gltf) => {
            const model3D = gltf.scene; // Obtener el objeto 3D del modelo cargado

            const initialZ = -Math.PI / 8; // Valor inicial de la rotación Z
            model3D.rotation.z = initialZ; // Aplicar rotación inicial
            model3D.userData.initialZ = initialZ; // Guardar valor inicial de Z en userData

            model3D.traverse((node) => {
              if (node.isMesh && node.material) {
                // Si el nodo es una malla con material
                // Soporte para materiales múltiples por mesh
                const materials = Array.isArray(node.material)
                  ? node.material
                  : [node.material];

                materials.forEach((material) => {
                  material.metalness = 0.3; // Ajustar propiedades del material
                  material.roughness = 0.4;
                  material.envMapIntensity = 1.5;

                  if (material.name.toLowerCase().includes("vidrio")) {
                    material.transparent = true; // Si es vidrio, hacerlo transparente
                    material.opacity = 0.65; // Ajustar opacidad
                    material.color = new THREE.Color("#000"); // Ajustar color
                  }
                });
              }
            });

            const boundingBox = new THREE.Box3().setFromObject(model3D); // Crear caja para obtener dimensiones del modelo
            const center = boundingBox.getCenter(new THREE.Vector3()); // Obtener centro de la caja
            model3D.position.sub(center); // Centrar el modelo
            if (window.innerWidth <= 768) {
              model3D.position.z -= 5; // Puedes probar con -0.6, -0.8, etc.
            }
            console.log("Offset aplicado en mobile:", model3D.position.y);

            const size = boundingBox.getSize(new THREE.Vector3()); // Obtener tamaño de la caja
            model3D.userData.baseZ = Math.max(size.x, size.y, size.z) * 1.5; // Guardar tamaño máximo en Z

            model3D.visible = false; // Hacer el modelo invisible inicialmente
            scene.add(model3D); // Añadir el modelo a la escena
            loadedModels[i] = model3D; // Guardar el modelo en el array de modelos cargados
            res(); // Resolver la promesa
          },
          undefined, // Callback de progreso (no utilizado)
          rej // Callback de error
        );
      })
  );
  return Promise.all(promises); // Devolver promesa de todos los modelos cargados
}

/* -------------------------------------------------------------------------
   Mostrar modelo por índice
------------------------------------------------------------------------- */
export async function showModel(index) {
  if (loadedModels[index] === activeModel) return; // Si el modelo ya está visible, no hacer nada

  await playExitAnimation(); // Reproducir animación de salida

  const model3D = loadedModels[index]; // Obtener el modelo según el índice
  if (!model3D) return; // Si no existe el modelo, salir

  model3D.visible = true; // Hacer el modelo visible
  model3D.scale.set(0, 0, 0); // Establecer escala inicial a 0
  camera.position.z = model3D.userData.baseZ; // Ajustar posición de la cámara según el tamaño del modelo

  activeModel = model3D; // Establecer el modelo actual
  currentModel3D = model3D; // Establecer el modelo actual en la variable global

  playInitialAnimation(); // Reproducir animación de entrada
  animate(); // Iniciar bucle de animación

  if (!mainLoopStarted) {
    cancelAnimationFrame(basicAnimationFrameId); // Cancelar animación básica
    mainLoopStarted = true; // Marcar que el bucle principal ya ha comenzado
  }
}

/* -------------------------------------------------------------------------
   Animaciones de entrada / salida
------------------------------------------------------------------------- */
function playInitialAnimation() {
  if (currentModel3D) {
    gsap.to(currentModel3D.scale, {
      // Animación para escalar el modelo al tamaño normal
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: "power2.out",
      delay: 0.9,
    });
  }
}

function playExitAnimation() {
  return new Promise((resolve) => {
    if (!activeModel) return resolve(); // Si no hay modelo, resolver inmediatamente

    gsap.to(activeModel.scale, {
      // Animación para escalar el modelo a 0 antes de ocultarlo
      x: 0,
      y: 0,
      z: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        activeModel.visible = false; // Ocultar el modelo al completar la animación
        resolve(); // Resolver la promesa
      },
    });
  });
}

/* -------------------------------------------------------------------------
   Bucle principal de animación / renderizado
------------------------------------------------------------------------- */
let isFloating = true; // Variable para gestionar si el modelo flota
function animate() {
  if (currentModel3D) {
    if (isFloating) {
      currentModel3D.position.y = Math.sin(Date.now() * 0.001 * 1.5) * 0.2; // Movimiento de flotación (sinusoidal)
    }

    const swiperSection = document.querySelector(".section-product-swiper");
    if (!swiperSection) return;

    const swiperPosition = swiperSection.offsetTop; // Obtener posición de la sección del swiper
    const scrollProgress = Math.min(currentScroll / swiperPosition, 1); // Calcular progreso del scroll

    if (scrollProgress < 1) {
      currentModel3D.rotation.x = scrollProgress * Math.PI * 2; // Rotación del modelo en función del scroll

      const initialZ = currentModel3D.userData.initialZ || 0; // Obtener la rotación inicial Z
      // currentModel3D.rotation.z = initialZ * (1 - scrollProgress); // Ajustar la rotación Z en función del scroll
    }
  }

  renderer.render(scene, camera); // Renderizar la escena
  requestAnimationFrame(animate); // Solicitar el siguiente fotograma de la animación
}
