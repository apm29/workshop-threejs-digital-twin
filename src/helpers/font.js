const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
export function getTextWidth(text, font = "bold 16px Arial") {
  context.font = font;
  const { width } = context.measureText(text);
  return width;
}
