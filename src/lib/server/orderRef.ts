import { randomInt } from 'crypto';

// No easily-confused characters (no 0/O, 1/I/L).
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

/** A short, human-readable order reference, e.g. "RIM-7GK2Q". */
export function generateOrderRef(): string {
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `RIM-${code}`;
}
