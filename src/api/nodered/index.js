import { remote } from "~/composables";
export function getNodeRedJsonByFlowId(flowId) {
  return remote.postForm({
    url: "/java/nodeRed/getTabJsonById",
    data: {
      id: flowId
    }
  })
}

function getMinProperty(array, getPropertyFn, zeroBase) {
  const minPropertyValue = array
    .map(getPropertyFn)
    .reduce((minValue, current) => {
      return Math.min(minValue, current || Number.POSITIVE_INFINITY);
    }, 0);
  return minPropertyValue === 0 ? - zeroBase : minPropertyValue;
}

export function postNodeRedJsonByFlowId(flowId, nodes, configs, label) {
  const minX = getMinProperty(nodes, (it) => it.x, 150)
  const minY = getMinProperty(nodes, (it) => it.y, 30)
  console.log(minX, minY);
  return remote.postForm({
    url: "/java/nodeRed/webToMysql",
    data: {
      param: JSON.stringify({
        id: flowId,
        type: "tab",
        label: label,
        disabled: false,
        info: "",
        env: [],
        nodes: [
          ...(nodes || []).map((it) => ({
            ...it,
            z: flowId,
            x: it.x - minX,
            y: it.y - minY,
          })),
          ...(configs || []).map((it) => ({
            ...it,
            z: flowId,
          })),
        ],
        configs: (configs || []).map((it) => ({
          ...it,
          z: flowId,
        })),
      }),
    },
    showSuccessMessage: true
  })
}
