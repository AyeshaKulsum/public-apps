const generateRandomId = () => {
  const length = 15;
  const allowedChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    randomString += allowedChars.charAt(randomIndex);
  }

  return randomString;
};

export { generateRandomId };
