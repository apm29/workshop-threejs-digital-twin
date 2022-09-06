<template>
  <div ref="sceneWrapper" class="3d-scene" h="full" w="full">
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { Sky } from "three/addons/objects/Sky.js";
//容器
const sceneWrapper = ref();
//获取容器宽高
const { width, height } = useElementSize(sceneWrapper);

let generated = false;
//等元素挂载后,获取宽高完成时,生成scene,camera
function generateSceneAndCamera(height, width) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL(0.6, 0, 1);
  scene.fog = new THREE.Fog(scene.background, 1, 5000);

  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 5000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.outputEncoding = THREE.sRGBEncoding;
  sceneWrapper.value.appendChild(renderer.domElement);

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

  //SKY;
  const uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 33 },
    exponent: { value: 0.6 },
  };
  uniforms["topColor"].value.copy(hemiLight.color);

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

  //CONTROL
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 0.1;
  controls.maxDistance = 1000;

  controls.maxPolarAngle = Math.PI / 2;

  const loader = new GLTFLoader();

  camera.position.z = 50;
  camera.position.x = 30;
  camera.position.y = 30;
  //stats
  const stats = new Stats();
  sceneWrapper.value.appendChild(stats.dom);
  //pp
  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera);
  outlinePass.visibleEdgeColor.set("#ff5500");
  outlinePass.hiddenEdgeColor.set("#303030");
  outlinePass.edgeStrength = 10;
  outlinePass.edgeGlow = 0;
  outlinePass.edgeThickness = 1;
  composer.addPass(outlinePass);

  const effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
  composer.addPass(effectFXAA);

  const phongMaterial = new THREE.MeshPhongMaterial({
    color: 0x3355dd,
    specular: 0x111111,
    shininess: 5,
  });

  const obj3d = new THREE.Object3D();
  const group = new THREE.Group();

  loader.load(
    "/model/回转窑-20220904.glb",
    function (gltf) {
      obj3d.add(gltf.scene);

      gltf.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.name = "回转窑";
        }
      });
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
  loader.load(
    "/model/窑尾箱-20220904.glb",
    function (gltf) {
      obj3d.add(gltf.scene);
      gltf.scene.position.z = 10;
      gltf.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.name = "窑尾箱";
        }
      });
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/textures/tri_pattern.jpg", function (texture) {
    outlinePass.patternTexture = texture;
    outlinePass.usePatternTexture = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const torusMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, torusMaterial);
  cube.castShadow = true;
  cube.position.y = 0.5;
  obj3d.add(cube);

  scene.add(group);

  group.add(obj3d);

  generated = true;

  renderer.domElement.style.touchAction = "none";
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  function onPointerMove(event) {}

  renderer.domElement.addEventListener("click", onObjectSelect);

  function onObjectSelect(event) {
    // if (event.isPrimary === false) return;

    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -(event.clientY / height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(obj3d, true);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      console.log("选择:", selectedObject);
      outlinePass.selectedObjects = [selectedObject];
    } else {
      // outlinePass.selectedObjects = [];
    }
  }
  renderer.domElement.addEventListener("resize", handleResizeWrapper);
  //宽高变化
  function handleResizeWrapper() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);

    effectFXAA.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
  }

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();
    // renderer.render(scene, camera);
    controls.update();
    composer.render();
    stats.end();
  }
  animate();
}

//监听宽高
watch([height, width], ([height, width]) => {
  if (height && width) {
    if (!generated) {
      generateSceneAndCamera(height, width);
    }
  }
});
</script>

<style lang="scss" scoped></style>
