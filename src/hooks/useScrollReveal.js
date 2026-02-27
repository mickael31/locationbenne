import { useEffect } from "react";

export default function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".fade-in, .fade-in-left, .fade-in-right, .scale-in"
    );

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });
}
