import { remote } from "~/composables";
//获取分页数据
export function getPaged485Hub({ pageNo, pageSize }) {
  return remote.postForm({
    url: "/java/485hub/findListByPage",
    data: {
      pageNo,
      pageSize,
    },
  });
}
export function getPaged485Net({ pageNo, pageSize }) {
  return remote.postForm({
    url: "/java/485net/findListByPage",
    data: {
      pageNo,
      pageSize,
    },
  });
}

export function getPagedCollector({ pageNo, pageSize }) {
  return remote.postForm({
    url: "/java/collector/findListByPage",
    data: {
      pageNo,
      pageSize,
    },
  });
}

export function getPagedElectricityBox({ pageNo, pageSize }) {
  return remote.postForm({
    url: "/java/electricBox/findListByPage",
    data: {
      pageNo,
      pageSize,
    },
  });
}

export function getPagedSensor({ pageNo, pageSize }) {
  return remote.postForm({
    url: "/java/sensor/findListByPage",
    data: {
      pageNo,
      pageSize,
    },
  });
}

export function getPagedSwitch({ pageNo, pageSize }) {
  return remote.postForm({
    url: "/java/switch/findListByPage",
    data: {
      pageNo,
      pageSize,
    },
  });
}

export function getPagedRFIDScanner({ pageNo, pageSize }) {
  return remote.postForm({
    url: "/java/rfid/findIndexOneListByPage",
    data: {
      pageNo,
      pageSize,
    },
  });
}
export function getPagedRFIDReader({ pageNo, pageSize }) {
  return remote.postForm({
    url: "/java/rfid/findIndexListByPage",
    data: {
      pageNo,
      pageSize,
    },
  });
}
