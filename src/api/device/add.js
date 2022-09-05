import { remote, DeviceTopographyTables } from "~/composables";
//业务设备添加
export function addDevice({
  id,
  tableName,
  name,
  place,
  indexCode,
  ip,
  remark,
  level,
  isMyown,
}) {
  switch (tableName) {
    case DeviceTopographyTables.HUB:
      return remote.postForm({
        url: "/java/485hub/add",
        data: {
          id,
          ip,
          name,
          remark,
          level,
          isMyown,
        },
      });
    case DeviceTopographyTables.NET:
      return remote.postForm({
        url: "/java/485net/add",
        data: {
          id,
          ip,
          name,
          remark,
          level,
          isMyown,
        },
      });
    case DeviceTopographyTables.COLLECTOR:
      return remote.postForm({
        url: "/java/collector/add",
        data: {
          id,
          ip,
          name,
          remark,
          level,
          isMyown,
        },
      });
    case DeviceTopographyTables.EBOX:
      return remote.postForm({
        url: "/java/electricBox/add",
        data: {
          id,
          name,
          ip,
          place,
          remark,
          level,
          isMyown,
        },
      });
    case DeviceTopographyTables.SENSOR:
      return remote.postForm({
        url: "/java/sensor/add",
        data: {
          id,
          ip,
          name,
          remark,
          level,
          isMyown,
        },
      });
    case DeviceTopographyTables.SWITCH:
      return remote.postForm({
        url: "/java/switch/add",
        data: {
          id,
          ip,
          name,
          remark,
          level,
          isMyown,
        },
      });
    case DeviceTopographyTables.SCANNER:
      return remote.postForm({
        url: "/java/rfid/addIndexOne",
        data: {
          id,
          indexCode,
          ip,
          remark,
          level,
          isMyown,
        },
      });
    case DeviceTopographyTables.READER:
      return remote.postForm({
        url: "/java/rfid/addIndex",
        data: {
          id,
          indexCode,
          ip,
          remark,
          level,
          isMyown,
        },
      });
    default:
      throw Error("未知的类型");
  }
}

//业务设备删除
export function deleteDevice(id, tableName) {
  switch (tableName) {
    case DeviceTopographyTables.HUB:
      return remote.postForm({
        url: "/java/485hub/delete",
        data: {
          id,
        },
      });
    case DeviceTopographyTables.NET:
      return remote.postForm({
        url: "/java/485net/delete",
        data: {
          id,
        },
      });
    case DeviceTopographyTables.COLLECTOR:
      return remote.postForm({
        url: "/java/collector/delete",
        data: {
          id,
        },
      });
    case DeviceTopographyTables.EBOX:
      return remote.postForm({
        url: "/java/electricBox/delete",
        data: {
          id,
        },
      });
    case DeviceTopographyTables.SENSOR:
      return remote.postForm({
        url: "/java/sensor/delete",
        data: {
          id,
        },
      });
    case DeviceTopographyTables.SWITCH:
      return remote.postForm({
        url: "/java/switch/delete",
        data: {
          id,
        },
      });
    case DeviceTopographyTables.READER:
      return remote.postForm({
        url: "/java/rfid/deleteIndex",
        data: {
          id,
        },
      });
    case DeviceTopographyTables.SCANNER:
      return remote.postForm({
        url: "/java/rfid/deleteIndexOne",
        data: {
          id,
        },
      });
    default:
      throw Error("未知的类型");
  }
}
