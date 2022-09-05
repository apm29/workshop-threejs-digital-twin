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
//容器
const sceneWrapper = ref();
//获取容器宽高
const { width, height } = useElementSize(sceneWrapper);

let generated = false;
//等元素挂载后,获取宽高完成时,生成scene,camera
function generateSceneAndCamera(height, width) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(width, height);
  sceneWrapper.value.appendChild(renderer.domElement);

  scene.add(new THREE.AxesHelper(20));

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
    textMeshX.position.y = 0;
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

  scene.add(new THREE.AmbientLight(0xaaaaaa, 0.2));
  const light = new THREE.DirectionalLight(0xddffdd, 0.6);
  light.position.set(1, 1, 1);
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;

  const d = 10;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 1000;

  scene.add(light);

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
  composer.addPass(outlinePass);
  outlinePass.visibleEdgeColor.set("#ffffff");
  outlinePass.hiddenEdgeColor.set("#190a05");
  outlinePass.edgeStrength = 2;
  outlinePass.edgeGlow = 1;
  outlinePass.edgeThickness = 2;

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
          child.receiveShadow = true;
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
          child.receiveShadow = true;
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
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/textures/tri_pattern.jpg", function (texture) {
    outlinePass.patternTexture = texture;
    outlinePass.usePatternTexture = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

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

    const intersects = raycaster.intersectObject(scene, true);

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
