export const generateGameCode = (length = 6) : string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789";
  let code = "";

  for(let i = 0; i < length; i++) {
    const char = chars[Math.floor(Math.random() & chars.length)];
    code += char;
  }

  return code;
}