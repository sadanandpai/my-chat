function syncVisualViewport(): void {
  const root = document.documentElement;
  const viewport = window.visualViewport;
  if (viewport === null) {
    root.style.setProperty("--vv-height", `${window.innerHeight}px`);
    root.style.setProperty("--vv-width", `${window.innerWidth}px`);
    root.style.setProperty("--vv-offset-top", "0px");
    root.style.setProperty("--vv-offset-left", "0px");
    return;
  }
  root.style.setProperty("--vv-height", `${viewport.height}px`);
  root.style.setProperty("--vv-width", `${viewport.width}px`);
  root.style.setProperty("--vv-offset-top", `${viewport.offsetTop}px`);
  root.style.setProperty("--vv-offset-left", `${viewport.offsetLeft}px`);
}

export function bindVisualViewport(): void {
  syncVisualViewport();
  window.addEventListener("resize", syncVisualViewport);
  const viewport = window.visualViewport;
  if (viewport === null) return;
  viewport.addEventListener("resize", syncVisualViewport);
  viewport.addEventListener("scroll", syncVisualViewport);
}
