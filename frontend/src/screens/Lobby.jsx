import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketProvider';
import { useSelector } from 'react-redux';
import { useJoinMeetingMutation } from '../redux/api/meetingApi';

const LobbyScreen = () => {
    const [room, setRoom] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [joinMeeting, { isLoading }] = useJoinMeetingMutation();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            const trimmedRoom = room.trim();

            if (!trimmedRoom) {
                setStatus({ type: 'error', text: 'Room code is required' });
                return;
            }

            setStatus({ type: 'info', text: `Joining room ${trimmedRoom}...` });

            try {
                // Call Backend CRUD
                await joinMeeting(trimmedRoom).unwrap();
                
                // Navigate to the video room for preview
                navigate(`/room/${encodeURIComponent(trimmedRoom)}`);
            } catch (err) {
                console.error("Failed to join meeting:", err);
                setStatus({ type: 'error', text: err?.data?.message || 'Failed to join the meeting. Check the code.' });
            }
        },
        [room, navigate, joinMeeting, user]
    );

    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-transparent px-4 text-slate-900 dark:text-white relative">
            <div className="w-full max-w-md rounded-2xl border border-red-500/30 dark:border-white/10 bg-white/90 dark:bg-white/5 p-6 shadow-2xl backdrop-blur">
                <h1 className="mb-6 text-3xl font-semibold text-center">Join Meeting</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meeting Code</label>
                        <input
                            type="text"
                            placeholder="Enter 8-character meeting code"
                            value={room}
                            onChange={(event) => setRoom(event.target.value)}
                            className="w-full rounded-lg border border-red-500/30 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all uppercase text-slate-900 dark:text-white"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 w-full rounded-lg bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Joining...' : 'Join Room'}
                    </button>
                </form>

                {status && (
                    <p className={`mt-4 text-sm text-center ${status.type === 'error' ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}>
                        {status.text}
                    </p>
                )}
            </div>
        </div>
    );
};

export default LobbyScreen;