const transformSensitive = true;

export function sensitive(str, keepIndex = [], relpaceSympol = "*") {
  if (transformSensitive) {
    return str?.split("")?.map((i, index) => {
      return keepIndex.includes(index) ? i : relpaceSympol
    }).join("")
  } else {
    return str
  }
}
