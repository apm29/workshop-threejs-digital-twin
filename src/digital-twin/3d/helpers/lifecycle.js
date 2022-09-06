import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import * as THREE from "three";


//拖动控制
export function useDragControl(camera, renderer) {
  // controls

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.screenSpacePanning = false;

  controls.minDistance = 30;
  controls.maxDistance = 1500;

  controls.maxPolarAngle = Math.PI / 2;

  return {
    controls,
  };
}

//鼠标交互
export function useMouseInteract(elRef, camera, scene, renderer) {
  const { x, y } = useMouseInElement(ref(elRef));
  const { width, height } = useElementSize(elRef);
  const selectedObject = ref(null);
  //可交互的组
  const group = new THREE.Group();
  const obj3d = new THREE.Object3D();
  group.add(obj3d)
  //用于计算交汇
  const raycaster = new THREE.Raycaster();
  const mouseVector = new THREE.Vector2();
  watch([x, y, width, height], ([x, y, width, height]) => {
    //将鼠标位置转换成设备坐标。x和y方向的取值范围是(-1 to 1)
    x = (x / width) * 2 - 1;
    y = -(y / height) * 2 + 1;
    mouseVector.set(x, y);
    //通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(mouseVector, camera);

    // 返回物体和射线的焦点
    const objects = raycaster.intersectObject(group, true);

    if (objects && objects.length) {
      const first = objects.filter((it) => it && it.object)[0];
      selectedObject.value = first?.object;
    } else {
      selectedObject.value = null;
    }
  });

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );
  composer.addPass(outlinePass);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('/textures/tri_pattern.jpg', function (texture) {

    outlinePass.patternTexture = texture;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

  });
  outlinePass.visibleEdgeColor.set("orange"); //包围线颜色

  const effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
  composer.addPass(effectFXAA);

  unref(elRef).addEventListener("click", function () {
    if (selectedObject.value) {
      //TODO 选择object
      console.log(selectedObject.value);
      // 选中特效
      outlinePass.selectedObjects = [selectedObject.value];
    } else {
      outlinePass.selectedObjects = []
    }
  });

  return {
    group,
    obj3d,
    composer,
    selectedObject,
  };
}

//光源 半球光源 + 方向光源
export function useLight() {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 50, 0);

  // const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  // scene.add(hemiLightHelper);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-100, 100, 1000);
  dirLight.position.multiplyScalar(30);

  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  const d = 50;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;

  // const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
  // scene.add(dirLightHelper);

  return {
    hemiLight,
    dirLight,
  };
}

export function useGround() {
  const groundGeo = new THREE.PlaneGeometry(10000, 10000);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  groundMat.color.setHSL(0.095, 1, 0.75);

  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -33;
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  return {
    ground,
  };
}
