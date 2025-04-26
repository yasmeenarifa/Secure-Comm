// Encryption utility functions

/**
 * Simple XOR encryption/decryption with the passcode
 * In a real app, use a proper cryptography library
 */
export const encryptData = async (data: string, passcode: string = '1234'): Promise<string> => {
  // Simulate encryption processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple XOR encryption (for demonstration)
  let result = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ passcode.charCodeAt(i % passcode.length);
    result += String.fromCharCode(charCode);
  }
  
  // Convert to base64 for safe storage
  return btoa(result);
};

export const decryptData = async (encryptedData: string, passcode: string = '1234'): Promise<string> => {
  // Simulate decryption processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // Decode from base64
    const data = atob(encryptedData);
    
    // Simple XOR decryption
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ passcode.charCodeAt(i % passcode.length);
      result += String.fromCharCode(charCode);
    }
    
    return result;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Invalid encrypted data or incorrect passcode');
  }
};

/**
 * File to DataURL conversion
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * DataURL to Blob conversion
 */
export const dataURLToBlob = (dataURL: string): Blob => {
  const [meta, data] = dataURL.split(',');
  const contentType = meta.split(':')[1].split(';')[0];
  const byteString = atob(data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([arrayBuffer], { type: contentType });
};

/**
 * Trigger file download
 */
export const downloadFile = (data: string, filename: string, type: string): void => {
  const blob = dataURLToBlob(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const encryptFile = async (file: File, passcode: string = '1234'): Promise<string> => {
  const dataURL = await fileToDataURL(file);
  const encrypted = await encryptData(dataURL, passcode);
  return encrypted;
};

export const decryptFile = async (encryptedData: string, passcode: string = '1234'): Promise<string> => {
  return await decryptData(encryptedData, passcode);
};