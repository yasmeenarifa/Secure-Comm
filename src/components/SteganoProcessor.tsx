import React, { useState, useRef } from 'react';
import { Image, Lock, FileUp, FileDown, AlertCircle, CheckCircle } from 'lucide-react';
import { hideDataInImage, extractDataFromImage } from '../utils/steganography';
import AnimatedMatrix from './AnimatedMatrix';

interface SteganoProcessorProps {
  className?: string;
}

const SteganoProcessor: React.FC<SteganoProcessorProps> = ({ className = '' }) => {
  const [mode, setMode] = useState<'hide' | 'extract'>('hide');
  const [image, setImage] = useState<File | null>(null);
  const [secretText, setSecretText] = useState<string>('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setResultImage(null);
    setExtractedText(null);
    setError(null);
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
  
  const handleHideData = async () => {
    if (!image) {
      setError('Please select an image');
      return;
    }
    
    if (!secretText.trim()) {
      setError('Please enter text to hide');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setResultImage(null);
      
      const cleanup = simulateProgress();
      
      // Add artificial delay for effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await hideDataInImage(image, secretText);
      setResultImage(result);
      
      cleanup();
      setProgress(100);
    } catch (err) {
      setError(`Failed to hide data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleExtractData = async () => {
    if (!image) {
      setError('Please select an image');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setExtractedText(null);
      
      const cleanup = simulateProgress();
      
      // Convert File to Data URL
      const reader = new FileReader();
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
      
      // Add artificial delay for effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const extractedData = await extractDataFromImage(imageData);
      setExtractedText(extractedData);
      
      cleanup();
      setProgress(100);
    } catch (err) {
      setError(`Failed to extract data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleModeChange = (newMode: 'hide' | 'extract') => {
    setMode(newMode);
    setImage(null);
    setSecretText('');
    setResultImage(null);
    setExtractedText(null);
    setError(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };
  
  const downloadImage = () => {
    if (!resultImage) return;
    
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `stego_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className={`relative bg-gray-900 rounded-lg border border-purple-500/30 p-4 ${className}`}>
      <AnimatedMatrix active={loading} />
      
      <div className="relative z-10">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl text-purple-400 font-mono">Steganography</h2>
          
          <div className="flex space-x-2 font-mono text-sm">
            <button
              onClick={() => handleModeChange('hide')}
              className={`px-3 py-1 rounded-l border border-purple-500/30
                ${mode === 'hide' 
                  ? 'bg-purple-700/50 text-white' 
                  : 'bg-gray-800 text-purple-300 hover:bg-gray-700'
                }`}
            >
              Hide Data
            </button>
            <button
              onClick={() => handleModeChange('extract')}
              className={`px-3 py-1 rounded-r border border-purple-500/30
                ${mode === 'extract' 
                  ? 'bg-purple-700/50 text-white' 
                  : 'bg-gray-800 text-purple-300 hover:bg-gray-700'
                }`}
            >
              Extract Data
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-purple-300 mb-1 text-sm font-mono block">Select Image</label>
            <div className="flex space-x-2">
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                id="image-upload"
                disabled={loading}
              />
              <label 
                htmlFor="image-upload"
                className="flex-1 cursor-pointer bg-gray-800 border border-purple-500/30 rounded px-3 py-2 text-gray-300 hover:bg-gray-700 transition-colors text-sm font-mono flex items-center"
              >
                <Image className="w-4 h-4 mr-2" />
                {image ? image.name : 'Choose an image...'}
              </label>
              
              {image && (
                <button
                  onClick={() => {
                    setImage(null);
                    if (imageInputRef.current) {
                      imageInputRef.current.value = '';
                    }
                  }}
                  className="bg-gray-800 border border-red-500/30 rounded px-3 hover:bg-gray-700 text-red-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            
            {image && (
              <div className="mt-1 text-xs text-gray-400">
                {`Size: ${(image.size / 1024).toFixed(2)} KB • Type: ${image.type}`}
              </div>
            )}
          </div>
          
          {mode === 'hide' && (
            <div>
              <label className="text-purple-300 mb-1 text-sm font-mono block">Secret Message</label>
              <textarea
                value={secretText}
                onChange={(e) => setSecretText(e.target.value)}
                placeholder="Enter your secret message here..."
                className="w-full bg-gray-800 border border-purple-500/30 rounded px-3 py-2 text-gray-300 font-mono min-h-[100px]"
                disabled={loading}
              />
            </div>
          )}
          
          <button
            onClick={mode === 'hide' ? handleHideData : handleExtractData}
            disabled={!image || (mode === 'hide' && !secretText.trim()) || loading}
            className={`w-full py-2 px-4 rounded font-mono text-white flex items-center justify-center space-x-2
              ${loading ? 'bg-purple-900/50 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
              transition-colors`}
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>{mode === 'hide' ? 'Hiding Data...' : 'Extracting Data...'}</span>
              </>
            ) : (
              <>
                {mode === 'hide' ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Hide Data in Image</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4" />
                    <span>Extract Hidden Data</span>
                  </>
                )}
              </>
            )}
          </button>
          
          {loading && (
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
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
          
          {mode === 'hide' && resultImage && (
            <div className="space-y-3">
              <div className="bg-green-900/20 border border-green-500/30 text-green-400 p-3 rounded flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Data hidden successfully in the image!</span>
              </div>
              
              <div className="flex justify-center">
                <img 
                  src={resultImage} 
                  alt="Image with hidden data" 
                  className="max-w-full max-h-64 border border-purple-500/30 rounded"
                />
              </div>
              
              <button
                onClick={downloadImage}
                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-mono flex items-center justify-center"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download Image with Hidden Data
              </button>
            </div>
          )}
          
          {mode === 'extract' && extractedText && (
            <div className="space-y-3">
              <div className="bg-green-900/20 border border-green-500/30 text-green-400 p-3 rounded flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>Hidden data extracted successfully!</span>
              </div>
              
              <div className="bg-gray-800 border border-purple-500/30 rounded p-3 font-mono text-gray-300 whitespace-pre-wrap break-words">
                {extractedText}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SteganoProcessor;