
// Simple encryption/decryption functions for local storage
export function encrypt(value: string): string {
  try {
    // In a real app, use a more secure encryption method
    // This is just a basic encoding to avoid plain text storage
    return btoa(value);
  } catch (error) {
    console.error('Encryption error:', error);
    return value;
  }
}

export function decrypt(encryptedValue: string): string {
  try {
    // In a real app, use a more secure decryption method
    return atob(encryptedValue);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}
