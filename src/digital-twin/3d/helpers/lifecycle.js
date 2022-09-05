export function useCreateObject(onCreate) {
  const getScene = inject("getScene");
  const getCamera = inject("getCamera");
  const getRenderer = inject("getRenderer");

  const sceneRef = computed(getScene);
  const cameraRef = computed(getCamera);
  const rendererRef = computed(getRenderer);

  watch([sceneRef, cameraRef, rendererRef], ([scene, camera, renderer]) => {
    if (scene && camera && renderer) {
      if (onCreate && onCreate instanceof Function) {
        onCreate(scene, camera, renderer);
      }
    }
  });

}
