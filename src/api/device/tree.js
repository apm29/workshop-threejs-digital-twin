import { remote } from "~/composables";
export function getDeviceTopoTree(silent = true) {
  return remote.postForm({
    url: "/java/topoTree/getTree",
    silent: silent,
  });
}

export function getDeviceTopoTreeChild(id, silent = true) {
  return remote.postForm({
    url: "/java/topoTree/getChildNode",
    data: {
      id,
    },
    silent: silent,
  });
}

export function deleteDeviceTopoTreeNode(id) {
  return remote.postForm({
    url: "/java/topoTree/delete",
    data: {
      id,
    },
  });
}

export function getDeviceTopoTreeNodeMounted(id) {
  return remote.postForm({
    url: "/java/topoTree/getBusinessData",
    data: {
      id,
    },
  });
}
export function getDeviceTopoTreeNode(id) {
  return remote.postForm({
    url: "/java/topoTree/getById",
    data: {
      id,
    },
  });
}
export function updateDeviceTopoTreeNode({
  id,
  parentId,
  businessTableName,
  businessName,
  businessId,
}) {
  return remote.postForm({
    url: "/java/topoTree/update",
    data: {
      id,
      parentId,
      businessTableName,
      businessName,
      businessId,
    },
  });
}

export function addDeviceTopoTreeNode({
  businessId,
  businessName,
  businessTableName,
  parentId,
}) {
  return remote.postForm({
    url: "/java/topoTree/add",
    data: {
      businessId,
      businessName,
      businessTableName,
      parentId,
    },
  });
}
