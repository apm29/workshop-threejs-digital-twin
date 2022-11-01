const three = {};
export function useThree(namespace = "app") {
  if (!three[namespace]) {
    three[namespace] = {
      renderer: ref(),
      scene: ref(),
      camera: ref(),
      control: ref(),
      loading: ref(true),
    }
  }
  const selected = three[namespace];

  function setScene(value) {
    selected.scene.value = value;
  }
  function setRenderer(value) {
    selected.renderer.value = value;
  }
  function setCamera(value) {
    selected.camera.value = value;
  }
  function setControl(value) {
    selected.control.value = value;
  }

  return {
    ...selected,
    setRenderer,
    setScene,
    setCamera,
    setControl,
  };
}
