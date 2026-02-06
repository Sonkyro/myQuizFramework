const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // ohne I, O
const CODE_LENGTH = 6;

export function generateJoinCode() {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}
