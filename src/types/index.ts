export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  encrypted: boolean;
}

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string | ArrayBuffer;
  encrypted: boolean;
  timestamp: number;
}

export type EncryptionStatus = 'idle' | 'encrypting' | 'decrypting' | 'success' | 'error';