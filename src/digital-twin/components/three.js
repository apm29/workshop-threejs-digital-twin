const renderer = ref()
const scene = ref()
const camera = ref()
const control = ref()
export function useThree() {
  function setScene(value) {
    scene.value = value
  }
  function setRenderer(value) {
    renderer.value = value
  }
  function setCamera(value) {
    camera.value = value
  }
  function setControl(value) {
    control.value = value
  }

  return {
    renderer,
    setRenderer,
    scene,
    setScene,
    camera,
    setCamera,
    control,
    setControl
  }
}
