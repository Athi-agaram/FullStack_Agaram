import CryptoJS from "crypto-js";

const secretKey = "valid";

export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

export function decrypt(ciphertext) {
  return CryptoJS.AES.decrypt(ciphertext, secretKey).toString(CryptoJS.enc.Utf8);
}
