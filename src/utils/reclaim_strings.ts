export const installReclaimStrings = () => {
  if ("__reclaim_mango" in window) return true;

  const script = document.createElement("script");
  script.src = "mango/wasm_exec.js";
  script.onload = () => {
    // @ts-ignore
    const __reclaim_mango = new Go();
    // @ts-ignore
    window.__reclaim_mango = __reclaim_mango; // Assign to window to satisfy the check for next time
    WebAssembly.instantiateStreaming(
      fetch("mango/mango.wasm"),
      __reclaim_mango.importObject,
    )
      .then((result) => {
        __reclaim_mango.run(result.instance);
      })
      .catch((err) => {
        console.error("Failed to load or run mango.wasm:", err);
      });
  };
  script.onerror = () => {
    console.error("Failed to load wasm_exec.js");
  };
  document.head.appendChild(script);
};
