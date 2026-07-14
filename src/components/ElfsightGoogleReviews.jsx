import { useEffect } from "react";

const ELFSIGHT_SCRIPT_ID = "elfsight-platform-script";
const ELFSIGHT_SCRIPT_SRC = "https://elfsightcdn.com/platform.js";
const ELFSIGHT_WIDGET_CLASS =
  "elfsight-app-2ce195e1-bf9e-4554-8064-458cdf627318";

export default function ElfsightGoogleReviews() {
  useEffect(() => {
    if (document.getElementById(ELFSIGHT_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = ELFSIGHT_SCRIPT_ID;
    script.src = ELFSIGHT_SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div
      className={ELFSIGHT_WIDGET_CLASS}
      data-elfsight-app-lazy=""
      style={{ minHeight: "280px" }}
    />
  );
}
