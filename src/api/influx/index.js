import { remote } from "~/composables";
export function queryInfluxDb({ org, bucket, measurement, range }) {
  return remote.postForm({
    url: "/java/influxdb/query",
    data: {
      org,
      bucket,
      measurement,
      range,
    },
  });
}
