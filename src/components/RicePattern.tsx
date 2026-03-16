import { type CSSProperties, type PropsWithChildren, useMemo } from "react";

type RicePatternProps = PropsWithChildren<{
  width?: number;
  spacing?: number;
  scale?: number;
  strokeWidth?: number;
  "stroke-width"?: number;
  className?: string;
  style?: CSSProperties;
  color?: string;
}>;

const RicePattern = ({
  width = 12,
  spacing = 18,
  scale = 1,
  strokeWidth,
  "stroke-width": strokeWidthDashed,
  className,
  style,
  color = "#e6dfda",
  children,
}: RicePatternProps) => {
  const resolvedStrokeWidth = strokeWidth ?? strokeWidthDashed ?? 3;

  const pattern = useMemo(() => {
    const tile = (width + spacing) * scale;
    const lineLength = width * scale;
    const stroke = resolvedStrokeWidth * scale;
    const half = tile / 2;
    const x1 = half - lineLength / 2;
    const x2 = half + lineLength / 2;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" viewBox="0 0 ${tile} ${tile}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round"><line x1="${x1}" y1="${half}" x2="${x2}" y2="${half}" transform="rotate(-45 ${half} ${half})" /></svg>`;

    const encoded = encodeURIComponent(svg)
      .replace(/%0A/g, "")
      .replace(/%20/g, " ")
      .replace(/%3D/g, "=")
      .replace(/%3A/g, ":")
      .replace(/%2F/g, "/");

    return {
      image: `url("data:image/svg+xml,${encoded}")`,
      size: `${tile}px ${tile}px`,
    };
  }, [width, spacing, scale, resolvedStrokeWidth, color]);

  const mergedStyle: CSSProperties = {
    backgroundImage: pattern.image,
    backgroundRepeat: "repeat",
    backgroundSize: pattern.size,
    ...style,
  };

  return (
    <section className={className} style={mergedStyle}>
      {children}
    </section>
  );
};

export default RicePattern;
