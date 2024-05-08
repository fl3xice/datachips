import crypto from "crypto";

export namespace DataChipsCipher {
  export type Key = Buffer;

  export type EncryptedData = {
    iv: string;
    data: string;
  };

  export type BinaryToTextEncoding = "base64" | "base64url" | "hex" | "binary";
  export type CharacterEncoding =
    | "utf8"
    | "utf-8"
    | "utf16le"
    | "utf-16le"
    | "latin1";

  export const DEFAULT_ITERATIONS = 10_000;
  export const KEY_LEN = 32;
  export const SALT = Buffer.from("0c5ff9819ef059a1fecb3e0789eee287", "hex");
  export const DEFAULT_STANDARD_VIEW: BinaryToTextEncoding = "hex";
  export const ENCODING_USE: CharacterEncoding = "utf-8";

  /**
   * Generate key with a passphrase or no
   */
  export function createKey(passphrase?: string): Key {
    return passphrase
      ? crypto.pbkdf2Sync(
          passphrase,
          SALT,
          DEFAULT_ITERATIONS,
          KEY_LEN,
          "sha512"
        )
      : crypto.randomBytes(KEY_LEN);
  }

  /**
   * @param data target for encrypt
   * @param key key is a Buffer
   * @returns {EncryptedData}
   */
  export function encrypt(data: string, key: Key): EncryptedData {
    const iv = crypto.randomBytes(16); // 128-bit IV
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(data, ENCODING_USE, DEFAULT_STANDARD_VIEW);
    encrypted += cipher.final(DEFAULT_STANDARD_VIEW);

    return {
      iv: iv.toString(DEFAULT_STANDARD_VIEW),
      data: encrypted,
    };
  }

  /**
   *
   * @param enc Decrypt target
   * @param key Key is a Buffer
   * @returns {EncryptedData}
   */
  export function decrypt(enc: EncryptedData, key: Key): string {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      key,
      Buffer.from(enc.iv, DEFAULT_STANDARD_VIEW)
    );
    let decrypted = decipher.update(enc.data, "hex", ENCODING_USE);
    decrypted += decipher.final(ENCODING_USE);
    return decrypted;
  }
}
