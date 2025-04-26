/**
 * Simple steganography implementation to hide data within images
 * This is a simplified version for demonstration purposes
 */

// Hide data within an image
export const hideDataInImage = async (
  image: File, 
  data: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = () => {
      img.src = reader.result as string;
      
      img.onload = () => {
        // Create canvas and context
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not create canvas context'));
          return;
        }
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        
        // Get the image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Convert the secret data to binary
        const binaryData = Array.from(data)
          .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
          .join('');
        
        // Add the data length as a prefix (32 bits = 4 bytes integer)
        const binaryLength = binaryData.length.toString(2).padStart(32, '0');
        const fullBinaryData = binaryLength + binaryData;
        
        // Hide the data in the least significant bits of pixel values
        // Only modify if we have data to hide
        const dataLength = fullBinaryData.length;
        if (dataLength > pixels.length) {
          reject(new Error('Image too small to hide all data'));
          return;
        }
        
        // Embed data in the least significant bit of each pixel component
        for (let i = 0; i < dataLength; i++) {
          // Only change the last bit of the pixel data
          // Clear the last bit and then set it if necessary
          pixels[i] = (pixels[i] & 0xFE) | parseInt(fullBinaryData[i]);
        }
        
        // Put the modified data back on the canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Convert to data URL
        const resultDataUrl = canvas.toDataURL(image.type);
        resolve(resultDataUrl);
      };
    };
    
    reader.onerror = reject;
    reader.readAsDataURL(image);
  });
};

// Extract hidden data from an image
export const extractDataFromImage = (imageData: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      // Create canvas and context
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // Get the image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Extract the binary data from the least significant bits
      let extractedBinary = '';
      for (let i = 0; i < pixels.length; i++) {
        extractedBinary += (pixels[i] & 0x01).toString();
        if (extractedBinary.length >= 32 && extractedBinary.length === 32 + parseInt(extractedBinary.slice(0, 32), 2)) {
          break;
        }
      }
      
      // Get the length from the first 32 bits
      const dataLength = parseInt(extractedBinary.slice(0, 32), 2);
      
      // Extract the actual data (after the 32-bit length)
      const dataBinary = extractedBinary.slice(32, 32 + dataLength);
      
      // Convert binary to chars
      let result = '';
      for (let i = 0; i < dataBinary.length; i += 8) {
        const byte = dataBinary.slice(i, i + 8);
        if (byte.length === 8) {
          result += String.fromCharCode(parseInt(byte, 2));
        }
      }
      
      resolve(result);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
};