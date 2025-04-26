import React from 'react';
import { Shield, Lock, Fingerprint, Cpu, KeyRound, Cog } from 'lucide-react';

const About: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gray-900 rounded-lg border border-blue-500/30 p-6 ${className}`}>
      <div className="flex items-center justify-center mb-6">
        <Shield className="h-12 w-12 text-blue-400 mr-3" />
        <h1 className="text-2xl font-bold text-blue-400 font-mono">SecureComm Platform</h1>
      </div>
      
      <div className="space-y-6">
        <p className="text-gray-300">
          SecureComm is a cutting-edge cybersecurity and blockchain-based secure communication platform, 
          providing end-to-end encryption for all your sensitive data needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <FeatureCard 
            icon={<Lock />}
            title="End-to-End Encryption"
            description="All communications are encrypted on your device and can only be decrypted by the intended recipient."
          />
          
          <FeatureCard 
            icon={<Fingerprint />}
            title="Steganography"
            description="Hide sensitive data within innocent-looking image files for added security."
          />
          
          <FeatureCard 
            icon={<Cpu />}
            title="Terminal Interface"
            description="Secure command-line style interface for advanced users and security professionals."
          />
          
          <FeatureCard 
            icon={<KeyRound />}
            title="File Encryption"
            description="Encrypt any file with a secure passcode, making it unreadable without the correct key."
          />
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-medium text-blue-400 mb-2 flex items-center">
            <Cog className="w-5 h-5 mr-2" />
            Technical Specifications
          </h2>
          
          <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
            <li>
              <span className="text-blue-400 font-mono">Encryption:</span> XOR-based encryption with unique keying for demonstration
            </li>
            <li>
              <span className="text-blue-400 font-mono">Steganography:</span> LSB (Least Significant Bit) technique
            </li>
            <li>
              <span className="text-blue-400 font-mono">File Format:</span> Encrypted files are stored with .enc extension
            </li>
            <li>
              <span className="text-blue-400 font-mono">Default Passcode:</span> 1234 (can be customized)
            </li>
          </ul>
          
          <div className="mt-4 text-yellow-400 text-sm">
            <p className="flex items-start">
              <span className="font-bold mr-2">⚠️</span>
              <span>
                Note: This is a demonstration platform. For production use, implement stronger encryption algorithms and proper key management.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex">
      <div className="text-blue-400 mr-3 mt-1">
        {icon}
      </div>
      <div>
        <h3 className="text-blue-400 font-medium mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default About;