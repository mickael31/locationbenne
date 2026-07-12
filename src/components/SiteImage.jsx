function getFormatSource(src, format) {
  if (typeof src !== "string" || !/\.png(?:[?#]|$)/i.test(src)) {
    return null;
  }

  return src.replace(/\.png(?=[?#]|$)/i, `.${format}`);
}

function getResponsiveSource(src, format, candidateWidth) {
  return src.replace(
    /\.png(?=[?#]|$)/i,
    `-${candidateWidth}w.${format}`,
  );
}

function getFormatSourceSet(src, format, width) {
  const originalSource = getFormatSource(src, format);
  const originalWidth = Number(width);

  if (!originalSource || !Number.isFinite(originalWidth) || originalWidth <= 0) {
    return originalSource;
  }

  const candidates = [480, 768]
    .filter((candidateWidth) => candidateWidth < originalWidth)
    .map(
      (candidateWidth) =>
        `${getResponsiveSource(src, format, candidateWidth)} ${candidateWidth}w`,
    );

  return [...candidates, `${originalSource} ${Math.round(originalWidth)}w`].join(
    ", ",
  );
}

export default function SiteImage({
  src,
  width,
  height,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  sizes,
  className,
  responsive = true,
  style,
  ...props
}) {
  const imageStyle = responsive
    ? {
        width: "100%",
        height: "auto",
        maxWidth: "100%",
        maxHeight: "none",
        ...style,
      }
    : style;

  const image = (
    <img
      {...props}
      src={src}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      fetchpriority={fetchPriority}
      sizes={sizes}
      className={className}
      style={imageStyle}
    />
  );

  const avifSource = getFormatSourceSet(src, "avif", width);
  const webpSource = getFormatSourceSet(src, "webp", width);

  if (!responsive || !avifSource || !webpSource) {
    return image;
  }

  return (
    <picture style={{ display: "contents" }}>
      <source srcSet={avifSource} sizes={sizes} type="image/avif" />
      <source srcSet={webpSource} sizes={sizes} type="image/webp" />
      {image}
    </picture>
  );
}
