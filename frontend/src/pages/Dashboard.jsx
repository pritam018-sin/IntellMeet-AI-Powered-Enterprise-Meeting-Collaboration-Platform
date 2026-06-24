import React, { useState } from 'react';
import { useGetMyMeetingsQuery } from '../redux/api/meetingApi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: response, isLoading } = useGetMyMeetingsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) return <div className="p-8 text-center">Loading Dashboard...</div>;

  const meetings = response?.data || [];

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Post-Meeting Dashboard</h1>
      
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search meetings by title or summary..." 
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => (
            <div key={meeting._id} className="bg-white dark:bg-neutral-900 rounded-xl shadow p-6 border border-gray-100 dark:border-neutral-800 flex flex-col">
              <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">{meeting.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(meeting.createdAt).toLocaleDateString()}
              </p>
              <div className="mb-4 flex-grow">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Summary:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {meeting.summary || "No summary available."}
                </p>
              </div>
              <div className="flex gap-2">
                <Link 
                  to={`/meeting/${meeting._id}`}
                  className="px-4 py-2 bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-white text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-neutral-700 transition"
                >
                  Details
                </Link>
                {meeting.recordingUrl && (
                  <a 
                    href={meeting.recordingUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                  >
                    View Recording
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No meetings found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
