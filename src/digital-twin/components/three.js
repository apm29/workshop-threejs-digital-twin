const renderer = ref()
const scene = ref()
const camera = ref()
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

  return {
    renderer,
    setRenderer,
    scene,
    setScene,
    camera,
    setCamera
  }
}
