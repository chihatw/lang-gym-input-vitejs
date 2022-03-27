export const getUniqueStr = (): string => {
  return (
    Math.floor(1000 * Math.random()).toString(16) +
    (new Date().getTime() - new Date(2021, 0, 1).getTime()).toString(16)
  );
};
