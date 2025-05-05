export const truncateMiddle = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str;
  if (maxLength <= 3) return "...";
  const half = Math.floor((maxLength - 3) / 2);
  return str.slice(0, half) + "..." + str.slice(-half);
};
