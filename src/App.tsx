import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Terminal from './components/Terminal';
import FileProcessor from './components/FileProcessor';
import SteganoProcessor from './components/SteganoProcessor';
import About from './components/About';

function App() {
  const [activeTab, setActiveTab] = useState('terminal');
  
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'terminal' && (
            <Terminal className="h-[calc(100vh-10rem)]" />
          )}
          
          {activeTab === 'fileprocessor' && (
            <FileProcessor className="min-h-[calc(100vh-10rem)]" />
          )}
          
          {activeTab === 'steganography' && (
            <SteganoProcessor className="min-h-[calc(100vh-10rem)]" />
          )}
          
          {activeTab === 'about' && (
            <About className="min-h-[calc(100vh-10rem)]" />
          )}
        </div>
      </main>
      
      <footer className="bg-gray-900 border-t border-green-500/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm font-mono">
            SecureComm Platform • Cybersecurity & Blockchain Technology • {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;