import React from 'react';
import { Terminal, Shield, Lock, FileKey, MessageSquare, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const navItems = [
    { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-5 h-5" /> },
    { id: 'fileprocessor', label: 'File Encryption', icon: <FileKey className="w-5 h-5" /> },
    { id: 'steganography', label: 'Steganography', icon: <Lock className="w-5 h-5" /> },
    { id: 'about', label: 'About', icon: <Shield className="w-5 h-5" /> },
  ];
  
  return (
    <nav className="bg-gray-900 border-b border-green-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-green-400 mr-2" />
              <span className="text-white font-bold font-mono text-xl">SecureComm</span>
            </div>
            
            {/* Desktop nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`${
                      activeTab === item.id
                        ? 'bg-gray-800 text-green-400'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-green-300'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-green-500/30">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`${
                activeTab === item.id
                  ? 'bg-gray-800 text-green-400'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-green-300'
              } block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center transition-colors`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;