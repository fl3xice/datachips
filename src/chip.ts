import { DataChipsCipher } from "./cipher";

export interface Chip {
  name: string;
  encrypted: DataChipsCipher.EncryptedData;
}

/**
 * Create a chip
 */
export function createChip(
  encrypted: DataChipsCipher.EncryptedData,
  title: string
): Chip {
  return {
    name: title,
    encrypted,
  };
}
