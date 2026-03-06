export default function SiteImage({
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
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

  return (
    <img
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      style={imageStyle}
      {...props}
    />
  );
}
