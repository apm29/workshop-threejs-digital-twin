import { remote } from "~/composables";
export function getCoarsePowderLineOutput() {
  return remote.postForm({
    url: "/java/ckCfInstock/countBycard",
  });
}
