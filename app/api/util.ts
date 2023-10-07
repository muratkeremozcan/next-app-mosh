export const getRandomId = (min = 1, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min
