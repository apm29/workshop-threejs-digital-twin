import { remote } from "~/composables";
export function queryCurrentUsedFormula() {
  return remote.postForm({
    url: "/java/formula/getAbleFormula",
  });
}
