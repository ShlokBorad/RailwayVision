/**
 * RailwayVisIon Advanced Security & Anti-Dumping Shield
 * Prevents Web Scraping, HTTrack Web Crawlers, DevTools Inspection, Source Code Dumping & Asset Theft
 */

export const initSecurityShield = (): (() => void) => {
  // 1. Frame buster - Prevent iframe embedding / scraping proxies
  try {
    if (window.self !== window.top && window.top) {
      window.top.location.href = window.self.location.href;
    }
  } catch {
    // Blocked cross-origin iframe
  }

  // 2. Disable Keyboard Shortcuts (F12, Inspect, View Source, Save Page, Print)
  const handleKeyDown = (e: KeyboardEvent) => {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element), Ctrl+Shift+K
    if (
      e.ctrlKey &&
      e.shiftKey &&
      ['I', 'i', 'J', 'j', 'C', 'c', 'K', 'k', 'E', 'e'].includes(e.key)
    ) {
      e.preventDefault();
      return false;
    }

    // Ctrl+U (View Source), Ctrl+S (Save Page), Ctrl+P (Print)
    if (e.ctrlKey && ['u', 'U', 's', 'S', 'p', 'P', 'a', 'A'].includes(e.key)) {
      e.preventDefault();
      return false;
    }

    // Cmd+Alt+I (Mac DevTools), Cmd+Alt+J
    if (e.metaKey && e.altKey && ['i', 'I', 'j', 'J', 'c', 'C', 'u', 'U'].includes(e.key)) {
      e.preventDefault();
      return false;
    }
  };

  // 3. Disable Context Menu, Copy, Cut, Drag, Select
  const preventDefaultEvent = (e: Event) => {
    e.preventDefault();
    return false;
  };

  // 4. Anti-Debugging Loop (Freezes DevTools if opened)
  let debugInterval: number | null = null;
  const startAntiDebug = () => {
    debugInterval = window.setInterval(() => {
      const startTime = performance.now();
      // eslint-disable-next-line no-debugger
      debugger;
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        // DevTools opened -> wipe DOM or redirect
        console.clear();
      }
    }, 1000);
  };

  // 5. Image & Drag Guard
  const handleDragStart = (e: DragEvent) => {
    e.preventDefault();
    return false;
  };

  // Attach global event listeners
  window.addEventListener('keydown', handleKeyDown, true);
  window.addEventListener('contextmenu', preventDefaultEvent, true);
  window.addEventListener('copy', preventDefaultEvent, true);
  window.addEventListener('cut', preventDefaultEvent, true);
  window.addEventListener('selectstart', preventDefaultEvent, true);
  window.addEventListener('dragstart', handleDragStart, true);

  startAntiDebug();

  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', handleKeyDown, true);
    window.removeEventListener('contextmenu', preventDefaultEvent, true);
    window.removeEventListener('copy', preventDefaultEvent, true);
    window.removeEventListener('cut', preventDefaultEvent, true);
    window.removeEventListener('selectstart', preventDefaultEvent, true);
    window.removeEventListener('dragstart', handleDragStart, true);
    if (debugInterval !== null) {
      clearInterval(debugInterval);
    }
  };
};
