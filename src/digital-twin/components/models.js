const models = ref([]);

export function useModels() {
  function registerModel(viewData, position) {
    if (models.value.map(it => it.viewData.key).indexOf(viewData.key) >= 0) {
      return;
    }
    models.value.push({
      viewData,
      position,
    });
  }

  return {
    registerModel,
    models,
  };
}
