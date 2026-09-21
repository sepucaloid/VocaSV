export const BpmFormat = (minMilli, maxMilli) => {
  if (!minMilli && !maxMilli) return "—";
  const min = Math.round(minMilli / 1000);
  const max = Math.round(maxMilli / 1000);
  if (min === max) return `${min}`;
  return `${min} – ${max}`;
};
