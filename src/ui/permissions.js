// VANTAR Dynamics — Sensor permission UX
// Centralizes the friendly "why we need this" overlay plus the actual
// platform permission requests (iOS DeviceMotion gesture, getUserMedia, etc).

const el = (id) => document.getElementById(id);

const ICONS = {
  motion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 6v4l2 2"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>`,
  light: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>`,
};

/** Generic intent dialog. Resolves true (grant clicked) / false (cancel). */
export function askIntent({ kind = "motion", title, message }) {
  return new Promise((resolve) => {
    const perm = el("perm");
    el("perm-ic").innerHTML = ICONS[kind] || ICONS.motion;
    el("perm-title").textContent = title;
    el("perm-msg").textContent = message;
    perm.classList.add("is-open");

    const cleanup = (val) => {
      perm.classList.remove("is-open");
      el("perm-grant").removeEventListener("click", onGrant);
      el("perm-cancel").removeEventListener("click", onCancel);
      resolve(val);
    };
    const onGrant = () => cleanup(true);
    const onCancel = () => cleanup(false);
    el("perm-grant").addEventListener("click", onGrant);
    el("perm-cancel").addEventListener("click", onCancel);
  });
}

/** True if we appear to be on a secure context (sensors require HTTPS). */
export function isSecure() {
  return window.isSecureContext || location.hostname === "localhost";
}

/**
 * Request motion/orientation access.
 * @returns {Promise<'granted'|'denied'|'unsupported'|'insecure'>}
 */
export async function requestMotion(intentCopy) {
  if (!isSecure()) return "insecure";
  const hasMotion = typeof DeviceMotionEvent !== "undefined";
  const hasOrient = typeof DeviceOrientationEvent !== "undefined";
  if (!hasMotion && !hasOrient) return "unsupported";

  const needsGesture =
    (hasMotion && typeof DeviceMotionEvent.requestPermission === "function") ||
    (hasOrient && typeof DeviceOrientationEvent.requestPermission === "function");

  if (needsGesture) {
    // iOS: must call requestPermission() within the user gesture. We host that
    // call right after the intent dialog's "grant" click (same activation task).
    const ok = await askIntent(intentCopy);
    if (!ok) return "denied";
    try {
      let res = "granted";
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        res = await DeviceMotionEvent.requestPermission();
      }
      if (res === "granted" && typeof DeviceOrientationEvent.requestPermission === "function") {
        await DeviceOrientationEvent.requestPermission();
      }
      return res === "granted" ? "granted" : "denied";
    } catch {
      return "denied";
    }
  }
  // Android/desktop: no system prompt exists for motion. Don't gate behind an
  // extra dialog (one more thing that can fail) — the user's tap is the gesture.
  return "granted";
}

/**
 * Request microphone and return a live MediaStream (or null).
 * @returns {Promise<MediaStream|null|'insecure'>}
 */
export async function requestMic(intentCopy) {
  if (!isSecure()) return "insecure";
  if (!navigator.mediaDevices?.getUserMedia) return null;
  const ok = await askIntent(intentCopy);
  if (!ok) return null;
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
  } catch {
    return null;
  }
}
