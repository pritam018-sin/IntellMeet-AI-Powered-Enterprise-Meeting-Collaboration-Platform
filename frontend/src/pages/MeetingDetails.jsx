import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetMeetingByIdQuery, useDeleteMeetingMutation } from '../redux/api/meetingApi';
import ReactMarkdown from 'react-markdown';
import { Calendar, Users, FileText, Bot, Trash2, ArrowLeft, Clock, Copy, ChevronDown, ChevronUp, CheckCircle2, Video, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import toast from 'react-hot-toast';

const MeetingDetails = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  const { data: response, isLoading, isError } = useGetMeetingByIdQuery(meetingId);
  const [deleteMeeting, { isLoading: isDeleting }] = useDeleteMeetingMutation();
  
  const [showTranscript, setShowTranscript] = useState(false);
  const [copied, setCopied] = useState(false);

  const meeting = response?.data;
  const isHost = meeting?.host?._id === user?._id;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this meeting and its summary permanently?")) {
      try {
        await deleteMeeting(meetingId).unwrap();
        toast.success("Meeting deleted successfully");
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete meeting.");
      }
    }
  };

  const copySummary = () => {
    if (meeting?.summary) {
      navigator.clipboard.writeText(meeting.summary);
      setCopied(true);
      toast.success("Summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportToPDF = async () => {
    const input = document.getElementById('meeting-content');
    if (!input) return;
    
    const toastId = toast.loading('Generating PDF...');
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`IntellMeet_${meeting.meetingCode}.pdf`);
      toast.success('PDF downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error("PDF generation failed", err);
      toast.error('Failed to generate PDF', { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] w-full flex items-center justify-center bg-transparent text-slate-900 dark:text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className="min-h-[calc(100vh-73px)] w-full flex flex-col items-center justify-center bg-transparent text-slate-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Meeting not found</h2>
        <p className="text-slate-500 mb-6">You might not have permission to view this meeting.</p>
        <Link to="/" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const meetingDate = new Date(meeting.createdAt).toLocaleDateString(undefined, { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  const meetingTime = new Date(meeting.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-[calc(100vh-73px)] w-full bg-transparent text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 pt-12">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          
          <div className="flex gap-3">
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-neutral-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-neutral-700 rounded-lg transition-colors border border-slate-200 dark:border-neutral-700 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export to PDF</span>
            </button>

            {isHost && (
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 border border-red-200 dark:border-transparent"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete Meeting'}
              </button>
            )}
          </div>
        </div>

        {/* Meeting Content for PDF */}
        <div id="meeting-content" className="p-4 bg-transparent dark:bg-black">
          {/* Header Content */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider">
                {meeting.status}
              </span>
              <span className="font-mono text-sm text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-white/5 px-2 py-1 rounded border border-slate-200 dark:border-white/10">
                Code: {meeting.meetingCode}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{meeting.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {meetingDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {meetingTime}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {meeting.participants.length} Participants
              </div>
            </div>
          </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Summary & Transcript (Takes 2/3 space) */}
          <div className="md:col-span-2 space-y-8">
            
            {/* AI Summary Card */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-red-500/30 dark:border-white/10 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-white/10">
                <h2 className="text-xl font-bold flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Bot className="w-6 h-6" />
                  AI Meeting Summary
                </h2>
                <button 
                  onClick={copySummary}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              
              {meeting.summary ? (
                <div className="prose prose-slate dark:prose-invert prose-red max-w-none prose-p:leading-relaxed prose-headings:font-bold">
                  <ReactMarkdown>{meeting.summary}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>No summary was generated for this meeting.</p>
                </div>
              )}
            </div>

            {/* Transcript Accordion */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
              <button 
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Raw Transcript</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">View the exact speech-to-text log</p>
                  </div>
                </div>
                {showTranscript ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              
              {showTranscript && (
                <div className="p-6 pt-0 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-black/20">
                  {meeting.transcript ? (
                    <div className="font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap mt-4 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                      {meeting.transcript}
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-4 mt-4">No speech was recorded during this meeting.</p>
                  )}
                </div>
              )}
            </div>

            {/* Shared Notes Card */}
            {meeting.sharedNotes && (
              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/10">
                  <FileText className="w-6 h-6 text-slate-500" />
                  Meeting Notes
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                  {meeting.sharedNotes}
                </div>
              </div>
            )}

            {/* Recording Card */}
            {meeting.recordingUrl && (
              <div className="bg-white dark:bg-white/5 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/10 text-red-600 dark:text-red-400">
                  <Video className="w-6 h-6" />
                  Recording
                </h2>
                <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                  <video 
                    src={meeting.recordingUrl} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Participants */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/10">
                <Users className="w-5 h-5 text-slate-500" />
                Attendees ({meeting.participants.length})
              </h3>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {meeting.participants.map((p, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative">
                      {p.user?.avatar ? (
                        <img src={p.user.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" alt="" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400 shadow-sm">
                          {(p.user?.name || p.user?.email || '?')[0].toUpperCase()}
                        </div>
                      )}
                      {p.role === 'host' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full" title="Host"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.user?.name || 'Unknown User'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{p.user?.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
