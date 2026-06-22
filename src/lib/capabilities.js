// VANTAR Dynamics — Hardware capability detection
// Feature-detection over user-agent sniffing. Note: DeviceMotionEvent exists in
// desktop Chrome even with no accelerometer, so motion availability is inferred
// from the pointer/touch profile (coarse pointer / touch points), which reliably
// separates phones/tablets from desktops.

export function detectCapabilities() {
  const mm = (q) => (window.matchMedia ? window.matchMedia(q).matches : false);
  const coarse = mm("(pointer: coarse)") || mm("(any-pointer: coarse)");
  const touch = (navigator.maxTouchPoints || 0) > 0 || "ontouchstart" in window;
  const likelyMobile = coarse || (touch && !mm("(pointer: fine)"));

  return {
    secure: window.isSecureContext || location.hostname === "localhost",
    likelyMobile,                                  // best proxy for "has motion sensors"
    motionApi: typeof DeviceMotionEvent !== "undefined" || typeof DeviceOrientationEvent !== "undefined",
    motion: likelyMobile,                          // usable accelerometer/gyro in practice
    magnetometer: "Magnetometer" in window,
    light: "AmbientLightSensor" in window,
    mic: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (window.AudioContext || window.webkitAudioContext)),
    touch,
  };
}

// Which capability each tool depends on, for availability badges in the grid.
export const TOOL_NEEDS = {
  accelerometer: "motion",
  vibration: "motion",
  inclinometer: "motion",
  magnetometer: "magnetometer",
  luxmeter: "light",
  soundmeter: "mic",
};

export function toolAvailable(toolId, caps) {
  const need = TOOL_NEEDS[toolId];
  if (!need) return true;
  return !!caps[need];
}
