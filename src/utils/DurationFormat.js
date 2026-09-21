export const DurationFormat = (seconds) => {
  if (seconds < 60) return Math.round(seconds) + "s";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const paddedSeconds = String(s).padStart(2, "0");
  return m + ":" + paddedSeconds;
};
