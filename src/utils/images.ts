export const getQuery = (userInput: string) =>
  userInput.trim().replace(/\s+/g, '+');
