import React, { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Send, Loader, ArrowDownCircle } from 'lucide-react';
import { Message } from '../types';

interface TerminalProps {
  className?: string;
}

const Terminal: React.FC<TerminalProps> = ({ className = '' }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'system',
      content: 'Welcome to SecureComm Terminal v1.0.0',
      timestamp: Date.now(),
      encrypted: false
    },
    {
      id: '2',
      sender: 'system',
      content: 'Type /help for available commands',
      timestamp: Date.now() + 100,
      encrypted: false
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: Date.now(),
      encrypted: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Process commands
    if (input.startsWith('/')) {
      handleCommand(input);
    } else {
      // Simulate message encryption and processing
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'system',
          content: `Your message has been securely transmitted: "${input}"`,
          timestamp: Date.now(),
          encrypted: false
        };
        
        setMessages(prev => [...prev, response]);
        setLoading(false);
      }, 1000);
    }
  };
  
  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    
    let response: Message;
    
    // Process different commands
    switch (command) {
      case '/help':
        response = {
          id: Date.now().toString(),
          sender: 'system',
          content: `
Available commands:
/help - Show this help message
/clear - Clear terminal
/encrypt [message] - Encrypt a message
/status - Check system status
          `,
          timestamp: Date.now(),
          encrypted: false
        };
        break;
        
      case '/clear':
        setMessages([{
          id: Date.now().toString(),
          sender: 'system',
          content: 'Terminal cleared',
          timestamp: Date.now(),
          encrypted: false
        }]);
        setLoading(false);
        return;
        
      case '/status':
        response = {
          id: Date.now().toString(),
          sender: 'system',
          content: `
System Status: ONLINE
Encryption: ACTIVE
Connection: SECURE
Latency: 42ms
          `,
          timestamp: Date.now(),
          encrypted: false
        };
        break;
        
      default:
        if (command.startsWith('/encrypt ')) {
          const message = cmd.slice(9);
          response = {
            id: Date.now().toString(),
            sender: 'system',
            content: `Encrypted message: ${btoa(message)}`,
            timestamp: Date.now(),
            encrypted: true
          };
        } else {
          response = {
            id: Date.now().toString(),
            sender: 'system',
            content: `Unknown command: ${command}. Type /help for available commands.`,
            timestamp: Date.now(),
            encrypted: false
          };
        }
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, response]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className={`flex flex-col h-full bg-black text-green-400 rounded-md border border-green-500/30 ${className}`}>
      <div className="flex items-center p-2 border-b border-green-500/30 bg-black/60">
        <TerminalIcon className="w-5 h-5 mr-2" />
        <div className="text-sm font-mono">SecureComm Terminal</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 font-mono text-sm">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`mb-2 ${message.sender === 'user' ? 'text-blue-400' : 'text-green-400'}`}
          >
            <span className="opacity-70">[{new Date(message.timestamp).toLocaleTimeString()}]</span>{' '}
            <span className="font-bold">
              {message.sender === 'user' ? '>' : '$'}
            </span>{' '}
            <span className={message.encrypted ? 'text-purple-400' : ''}>
              {message.content}
            </span>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-center text-yellow-400">
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            <span>Processing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-2 border-t border-green-500/30">
        <div className="flex items-center">
          <span className="text-yellow-400 mr-2">$</span>
          <input
            type="text"
            ref={inputRef}
            className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command or message..."
            disabled={loading}
          />
          <button 
            type="submit" 
            className="text-green-400 px-2 hover:text-green-300 disabled:opacity-50"
            disabled={loading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Terminal;