import React, { useState, useRef } from 'react';
import { FileUp, FileDown, Lock, Unlock, AlertCircle, CheckCircle } from 'lucide-react';
import { EncryptionStatus } from '../types';
import { encryptFile, decryptFile, downloadFile } from '../utils/encryption';
import AnimatedMatrix from './AnimatedMatrix';

interface FileProcessorProps {
  className?: string;
}

const FileProcessor: React.FC<FileProcessorProps> = ({ className = '' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [passcode, setPasscode] = useState<string>('1234');
  const [status, setStatus] = useState<EncryptionStatus>('idle');
  const [processedData, setProcessedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEncryption, setIsEncryption] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setProcessedData(null);
    setProgress(0);
  };
  
  const resetForm = () => {
    setFile(null);
    setError(null);
    setProcessedData(null);
    setProgress(0);
    setStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 10);
      });
    }, 200);
    
    return () => clearInterval(interval);
  };
  
  const handleEncryption = async () => {
    if (!file) {
      setError('Please select a file to encrypt');
      return;
    }
    
    try {
      setStatus('encrypting');
      setError(null);
      
      const cleanup = simulateProgress();
      
      // Process the encryption
      const encryptedData = await encryptFile(file, passcode);
      setProcessedData(encryptedData);
      
      cleanup();
      setProgress(100);
      setStatus('success');
    } catch (err) {
      setError(`Encryption failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStatus('error');
    }
  };
  
  const handleDecryption = async () => {
    if (!file) {
      setError('Please select a file to decrypt');
      return;
    }
    
    try {
      setStatus('decrypting');
      setError(null);
      
      const cleanup = simulateProgress();
      
      // Read the encrypted file
      const reader = new FileReader();
      
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      
      // Decrypt the data
      const decryptedData = await decryptFile(fileContent, passcode);
      setProcessedData(decryptedData);
      
      cleanup();
      setProgress(100);
      setStatus('success');
    } catch (err) {
      setError(`Decryption failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStatus('error');
    }
  };
  
  const handleDownload = () => {
    if (!processedData || !file) return;
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
    let filename: string;
    
    if (isEncryption) {
      // For encrypted files, add .enc extension
      filename = `${file.name.split('.')[0]}_encrypted_${timestamp}.enc`;
      downloadFile(processedData, filename, 'application/octet-stream');
    } else {
      // For decrypted files, try to preserve original extension
      const originalName = file.name.replace('.enc', '');
      const originalExt = originalName.includes('.') ? 
        originalName.split('.').pop() : '';
        
      filename = `${originalName.split('.')[0]}_decrypted_${timestamp}${originalExt ? '.' + originalExt : ''}`;
      downloadFile(processedData, filename, 'auto');
    }
  };
  
  const toggleMode = () => {
    setIsEncryption(!isEncryption);
    resetForm();
  };
  
  // Determine if processing is active for animation
  const isProcessing = status === 'encrypting' || status === 'decrypting';
  
  return (
    <div className={`relative bg-gray-900 rounded-lg border border-indigo-500/30 p-4 ${className}`}>
      <AnimatedMatrix active={isProcessing} />
      
      <div className="relative z-10">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl text-indigo-400 font-mono">
            {isEncryption ? 'File Encryption' : 'File Decryption'}
          </h2>
          
          <button
            onClick={toggleMode}
            className="flex items-center space-x-1 bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-300 px-3 py-1 rounded text-sm font-mono transition-colors"
          >
            {isEncryption ? (
              <>
                <Unlock className="w-4 h-4 mr-1" />
                Switch to Decryption
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-1" />
                Switch to Encryption
              </>
            )}
          </button>
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="text-indigo-300 mb-1 text-sm font-mono">Select File</label>
            <div className="flex space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={isProcessing}
              />
              <label 
                htmlFor="file-upload"
                className="flex-1 cursor-pointer bg-gray-800 border border-indigo-500/30 rounded px-3 py-2 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-mono flex items-center"
              >
                <FileUp className="w-4 h-4 mr-2" />
                {file ? file.name : 'Choose a file...'}
              </label>
              
              {file && (
                <button
                  onClick={resetForm}
                  className="bg-gray-800 border border-red-500/30 rounded px-3 hover:bg-gray-700 text-red-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            {file && (
              <div className="mt-1 text-xs text-gray-400">
                {`Size: ${(file.size / 1024).toFixed(2)} KB • Type: ${file.type || 'unknown'}`}
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <label className="text-indigo-300 mb-1 text-sm font-mono">Passcode</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="bg-gray-800 border border-indigo-500/30 rounded px-3 py-2 text-gray-300 font-mono"
              disabled={isProcessing}
            />
          </div>
          
          <button
            onClick={isEncryption ? handleEncryption : handleDecryption}
            disabled={!file || isProcessing}
            className={`py-2 px-4 rounded font-mono text-white flex items-center justify-center space-x-2
              ${isProcessing ? 'bg-indigo-900/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
              transition-colors`}
          >
            {isProcessing ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>{isEncryption ? 'Encrypting...' : 'Decrypting...'}</span>
              </>
            ) : (
              <>
                {isEncryption ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Encrypt File</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Decrypt File</span>
                  </>
                )}
              </>
            )}
          </button>
          
          {isProcessing && (
            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {status === 'success' && (
            <div className="bg-green-900/20 border border-green-500/30 text-green-400 p-3 rounded flex items-start">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>
                {isEncryption 
                  ? 'File encrypted successfully! You can now download it.' 
                  : 'File decrypted successfully! You can now download it.'
                }
              </span>
            </div>
          )}
          
          {processedData && status === 'success' && (
            <button
              onClick={handleDownload}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-mono flex items-center justify-center"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Download {isEncryption ? 'Encrypted' : 'Decrypted'} File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileProcessor;