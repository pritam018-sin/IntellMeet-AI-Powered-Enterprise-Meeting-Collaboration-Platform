import React, { useRef } from 'react';
import { Copy, Trash2, Download, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const NotesPanel = ({ notes, onNotesChange }) => {
  const textareaRef = useRef(null);

  const handleCopy = () => {
    if (!notes.trim()) return toast.error('No notes to copy!');
    navigator.clipboard.writeText(notes);
    toast.success('Notes copied to clipboard!');
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all shared notes?')) {
      onNotesChange('');
      toast.success('Notes cleared');
    }
  };

  const handleDownload = () => {
    if (!notes.trim()) return toast.error('No notes to download!');
    const element = document.createElement("a");
    const file = new Blob([notes], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Meeting_Notes_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Notes downloaded!');
  };

  const insertCheckbox = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const textToInsert = '- [ ] ';
    
    const newNotes = notes.substring(0, start) + textToInsert + notes.substring(end);
    onNotesChange(newNotes);
    
    // Set focus back and adjust cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  return (
    <div className="h-full flex flex-col p-4 bg-transparent">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">Shared Notes</h3>
        
        {/* Toolbar */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
          <button 
            onClick={insertCheckbox}
            title="Insert Checkbox"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <button 
            onClick={handleCopy}
            title="Copy Notes"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDownload}
            title="Download as TXT"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1"></div>
          <button 
            onClick={handleClear}
            title="Clear Notes"
            className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/80 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className="flex-1 w-full bg-black/20 text-white p-4 rounded-xl border border-white/10 outline-none focus:border-red-500/50 resize-none transition-all duration-300 font-sans shadow-inner custom-scrollbar"
        placeholder="Type shared notes here... Use the toolbar above to format or export."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
      />
    </div>
  );
};

export default NotesPanel;
