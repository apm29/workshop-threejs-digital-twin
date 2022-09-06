import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL(0.6, 0, 1);
  scene.fog = new THREE.Fog(scene.background, 1, 5000);
  return scene;
}

export function createCamera(height, width) {
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);

  camera.position.z = 50;
  camera.position.x = 30;
  camera.position.y = 30;

  return camera;
}

export function createRenderer(height, width) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.outputEncoding = THREE.sRGBEncoding;
  return renderer;
}

export function createAxesHelper(scene) {
  const axesHelper = new THREE.AxesHelper(20);
  axesHelper.position.y = 0.1;
  scene.add(axesHelper);

  const materials = [
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
  ];

  const fontLoader = new FontLoader();
  fontLoader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
    const textXGeo = new TextGeometry("χ", {
      font: font,
      size: 1,
      height: 0.1,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelEnabled: true,
    });
    const textYGeo = new TextGeometry("γ", {
      font: font,
      size: 1,
      height: 0.1,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelEnabled: true,
    });
    const textZGeo = new TextGeometry("Ζ", {
      font: font,
      size: 1,
      height: 0.1,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelEnabled: true,
    });
    textXGeo.computeBoundingBox();
    textYGeo.computeBoundingBox();
    textZGeo.computeBoundingBox();

    const textMeshX = new THREE.Mesh(textXGeo, materials);
    const textMeshY = new THREE.Mesh(textYGeo, materials);
    const textMeshZ = new THREE.Mesh(textZGeo, materials);

    textMeshX.position.x = 20;
    textMeshX.position.y = 0.5;
    textMeshX.position.z = 0;

    textMeshX.rotation.x = 0;
    textMeshX.rotation.y = Math.PI * 2;

    textMeshY.position.x = 0;
    textMeshY.position.y = 20;
    textMeshY.position.z = 0;

    textMeshY.rotation.x = 0;
    textMeshY.rotation.y = Math.PI * 2;

    textMeshZ.position.x = 0;
    textMeshZ.position.y = 0;
    textMeshZ.position.z = 20;

    textMeshZ.rotation.x = 0;
    textMeshZ.rotation.y = Math.PI * 2;

    scene.add(textMeshX);
    scene.add(textMeshY);
    scene.add(textMeshZ);
  });
}

export function createLight(scene) {
  //LIGHTS
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 50, 0);
  hemiLight.visible = true;
  scene.add(hemiLight);

  // const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  // scene.add(hemiLightHelper);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(30);
  dirLight.visible = true;
  scene.add(dirLight);

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  const d2 = 50;

  dirLight.shadow.camera.left = -d2;
  dirLight.shadow.camera.right = d2;
  dirLight.shadow.camera.top = d2;
  dirLight.shadow.camera.bottom = -d2;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = 0;

  // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
  // scene.add(dirLightHelper);

  return {
    hemiLight,
    dirLight,
  };
}

export function createGround(scene) {
  //GROUND
  const groundGeo = new THREE.PlaneGeometry(5000, 5000);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  groundMat.color.setHSL(0.095, 1, 0.75);

  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -0;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const helper = new THREE.GridHelper(10000, 200);
  helper.position.y = -0;
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  // scene.add(helper);
  return {
    ground,
  };
}

export function createSky(scene) {
  const uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 33 },
    exponent: { value: 0.6 },
  };
  uniforms["topColor"].value.copy(new THREE.Color().setHSL(0.6, 1, 0.6));

  scene.fog.color.copy(uniforms["bottomColor"].value);

  const skyGeo = new THREE.SphereGeometry(4000, 32, 16);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(
      position, 1.0 ); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix
      * modelViewMatrix * vec4( position, 1.0 ); }`,
    fragmentShader: ` uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float
      exponent; varying vec3 vWorldPosition; void main() { float h = normalize(
      vWorldPosition + offset ).y; gl_FragColor = vec4( mix( bottomColor, topColor, max(
      pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 ); }`,
    side: THREE.BackSide,
  });

  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);
}

export function createControl(camera, element) {
  const controls = new OrbitControls(camera, element);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 0.1;
  controls.maxDistance = 1000;

  controls.maxPolarAngle = (2 * Math.PI) / 5;

  return {
    controls,
  };
}

export function createPostProcess(scene, camera, renderer, height, width) {
  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
  composer.addPass(effectFXAA);

  return {
    composer,
    effectFXAA
  };
}

export function mountSelectListener(scene, camera, renderer, composer, height, width, emit) {
  const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
  outlinePass.visibleEdgeColor.set("#ff5500");
  outlinePass.hiddenEdgeColor.set("#303030");
  outlinePass.edgeStrength = 10;
  outlinePass.edgeGlow = 0;
  outlinePass.edgeThickness = 1;
  composer.addPass(outlinePass);

  const moveOutlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
  moveOutlinePass.visibleEdgeColor.set("#4f4ab1");
  moveOutlinePass.hiddenEdgeColor.set("#303030");
  moveOutlinePass.edgeStrength = 3;
  moveOutlinePass.edgeGlow = 0;
  moveOutlinePass.edgeThickness = 1;
  composer.addPass(moveOutlinePass);

  //选择材质
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/textures/tri_pattern.jpg", function (texture) {
    outlinePass.patternTexture = texture;
    outlinePass.usePatternTexture = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  renderer.domElement.style.touchAction = "none";
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onPointerMove(event) {
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -(event.clientY / height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(selectableGroup, true);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      moveOutlinePass.selectedObjects = [selectedObject];
    } else {
      moveOutlinePass.selectedObjects = [];
    }
  }

  renderer.domElement.addEventListener("click", onObjectSelect);

  const selectableGroup = new THREE.Group();

  function onObjectSelect(event) {
    // if (event.isPrimary === false) return;
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -(event.clientY / height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(selectableGroup, true);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      outlinePass.selectedObjects = [selectedObject];
      emit("object:selected", selectedObject)
    } else {
      outlinePass.selectedObjects = [];
      emit("object:unselected")
    }
  }

  scene.add(selectableGroup);

  return {
    selectableGroup,
  };
}

const loader = new GLTFLoader();

export function loadGTLFModel(path) {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      function (gltf) {
        resolve(gltf);
      },
      function (propgress) {
        //TODO 加载进度
      },
      function (error) {
        console.error(error);
        reject(error);
      }
    );
  });
}
