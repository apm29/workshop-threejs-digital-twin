const models = ref([])

export function useModels() {
  function registerModel(viewData, position) {
    models.value.push({
      viewData, position
    })
  }

  return {
    registerModel,
    models
  }
}
