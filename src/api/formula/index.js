import { remote } from "~/composables";
export function queryCurrentUsedFormula() {
  return remote.postForm({
    url: "/java/formula/getAbleFormula",
  });
}

export function getFactory3CoarsePowderLineFormula() {
  return remote.postForm({
    url: "/java/operating-instruction/findById",
    data: {
      id: 4,
      pageNo: 1,
      pageSize: 1000
    }
  }).then(res => {
    return res.data.formulaPage.records.find(it => it.isAble)
  });
}
