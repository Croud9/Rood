
export function svgScale(svgEl, fixedPoint, scale, nextScale) {
  const position = svgPositionGet(svgEl);

  svgPositionSet(svgEl, {
      x: nextScale / scale * (position.x - fixedPoint.x) + fixedPoint.x,
      y: nextScale / scale * (position.y - fixedPoint.y) + fixedPoint.y
  });

  ensureTransform(svgEl, SVGTransform.SVG_TRANSFORM_SCALE)
      .setScale(nextScale, nextScale);
}