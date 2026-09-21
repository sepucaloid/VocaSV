export const DateFormat = (time) => {
  const date = new Date(time);
  const longDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return longDate;
};
