/**
 * @param {number} message - The message that should be shown to the user in the snackbar
 * @param {number} duration - The duration of the display of snackbar message in seconds
 */
export function showSnackbar(message: string, duration: number = 3000) {
  // Remove any existing snackbar
  const existingSnackbar = document.getElementById("reclaim-snackbar");
  if (existingSnackbar) {
    existingSnackbar.remove();
  }

  // Create snackbar element
  const snackbar = document.createElement("div");
  snackbar.id = "reclaim-snackbar";
  snackbar.textContent = message;

  // Apply styles
  snackbar.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12);
    max-width: 90%;
    text-align: center;
  `;

  // Add to body
  document.body.appendChild(snackbar);

  // Trigger animation
  setTimeout(() => {
    snackbar.style.opacity = "1";
  }, 10);

  // Remove after duration
  setTimeout(() => {
    snackbar.style.opacity = "0";
    setTimeout(() => {
      if (snackbar.parentNode) {
        snackbar.parentNode.removeChild(snackbar);
      }
    }, 300);
  }, duration);
}
