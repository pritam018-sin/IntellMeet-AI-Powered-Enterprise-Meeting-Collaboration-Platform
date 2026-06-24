import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatPanel = ({ messages = [], onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40 text-slate-300">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-slate-500 mb-1">{msg.isMe ? 'You' : msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className={`px-4 py-2 rounded-2xl max-w-[85%] break-words shadow-lg
              ${msg.isMe 
                ? 'bg-red-900/80 text-white rounded-tr-sm border border-red-800/50' 
                : 'bg-white/5 text-slate-200 rounded-tl-sm border border-white/10'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-red-950/50 bg-black/60 backdrop-blur">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message to everyone..." 
            className="flex-1 bg-white/5 border border-red-950/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white/10 transition-all text-white placeholder-slate-500"
          />
          <button 
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-red-700 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg shadow-red-900/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
