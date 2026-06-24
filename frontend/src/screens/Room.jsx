import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../context/SocketProvider.jsx";
import PeerService from "../service/peer.js";
import { useParams, useNavigate } from "react-router-dom";
import { useLeaveMeetingMutation, useEndMeetingMutation, useGetMyMeetingsQuery, useJoinMeetingMutation } from "../redux/api/meetingApi";
import { useSelector } from "react-redux";
import { useGenerateSummaryMutation } from "../redux/api/aiApi";
import { useTranscription } from "../features/ai/useTranscription";
import MeetingLayout from "../components/meeting/layout/MeetingLayout";
import VideoGrid from "../components/meeting/layout/VideoGrid";
import Sidebar from "../components/meeting/layout/Sidebar";
import ControlBar from "../components/meeting/controls/ControlBar";
import VideoTile from "../components/meeting/video/VideoTile";
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

const VideoPlayer = ({ stream, muted, className }) => {
    const videoRef = useRef(null);
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            className={className}
        />
    );
};

const RoomPage = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const user = useSelector((state) => state.auth.user);

    // Media & Permission State
    const [isJoined, setIsJoined] = useState(false);
    const [myStream, setMyStream] = useState(null);
    const myStreamRef = useRef(null); // Keep a ref for access in closures
    const [cameraError, setCameraError] = useState(null);
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [canRecord, setCanRecord] = useState(true);

    // Mesh Network State
    const peersRef = useRef(new Map()); // Map of socketId -> RTCPeerConnection
    const [remoteStreams, setRemoteStreams] = useState([]); // Array of { socketId, stream, name }
    const [activeScreenShareUser, setActiveScreenShareUser] = useState(null); // socketId of who is sharing
    const [pinnedParticipant, setPinnedParticipant] = useState(null); // id of pinned participant

    // Fullscreen state
    const [isFullscreen, setIsFullscreen] = useState(false);

    // UI Layout State
    const [sidebarMode, setSidebarMode] = useState(null); // 'chat', 'participants', null
    const [messages, setMessages] = useState([]);

    // Auto-hide controls State
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef(null);

    const handleUserActivity = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleUserActivity);
        window.addEventListener('click', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);
        handleUserActivity();
        return () => {
            window.removeEventListener('mousemove', handleUserActivity);
            window.removeEventListener('click', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [handleUserActivity]);

    // Recording & Captions
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const [captionsOn, setCaptionsOn] = useState(true);
    const [transcript, setTranscript] = useState([]);
    const [latestCaption, setLatestCaption] = useState(null);
    const captionTimeoutRef = useRef(null);

    const handleNewCaption = useCallback((caption) => {
        setLatestCaption(caption);
        setTranscript(prev => [...prev, `${caption.speaker} [${caption.timestamp}]: ${caption.text}`]);

        socket.emit("room:caption", { room: roomId, caption });

        if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
        captionTimeoutRef.current = setTimeout(() => setLatestCaption(null), 3000);
    }, [roomId, socket]);

    useTranscription(isJoined && captionsOn && micOn, user?.name || user?.email || "User", handleNewCaption);

    // API Mutations
    const [leaveMeeting, { isLoading: isLeaving }] = useLeaveMeetingMutation();
    const [endMeeting, { isLoading: isEnding }] = useEndMeetingMutation();
    const [joinMeeting, { isLoading: isJoiningAPI }] = useJoinMeetingMutation();
    const [generateSummary] = useGenerateSummaryMutation();

    // Meeting Role Checks
    const { data: meetingsResponse } = useGetMyMeetingsQuery(undefined, { skip: !user });
    const currentMeeting = meetingsResponse?.data?.find(m => m.meetingCode === roomId);
    const isHost = currentMeeting?.host?._id === user?._id || currentMeeting?.host === user?._id;

    // Toast logic (simplified for the new layout)
    const showToast = useCallback((msg) => {
        // You could integrate a real toast library here like react-hot-toast. 
        // For now we'll just log or use browser alert for critical things, or rely on UI indicators.
        console.log("TOAST:", msg);
    }, []);

    // Host Controls
    const handleRemoveParticipant = useCallback((participantSocketId) => {
        if (!isHost) return;
        socket.emit("room:remove-user", { socketId: participantSocketId });
    }, [isHost, socket]);

    const handleMuteParticipant = useCallback((participantSocketId) => {
        if (!isHost) return;
        socket.emit("room:mute-user", { socketId: participantSocketId });
    }, [isHost, socket]);

    const handleMuteAll = useCallback(() => {
        if (!isHost) return;
        socket.emit("room:mute-all", { room: roomId });
    }, [isHost, socket, roomId]);

    // Fullscreen logic
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Initial Media Setup
    useEffect(() => {
        const initMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setMyStream(stream);
                myStreamRef.current = stream;
                setCameraError(null);
            } catch (err) {
                console.error("Failed to get local media", err);
                setCameraError("Camera/Microphone is blocked or in use by another tab.");
            }
        };
        initMedia();
        return () => {
            if (myStreamRef.current) {
                myStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // ---------------------------------------------------------
    // MESH NETWORK LOGIC
    // ---------------------------------------------------------

    const createPeerConnection = useCallback((socketId, email) => {
        const peer = PeerService.createPeer();

        // Add local tracks
        if (myStreamRef.current) {
            myStreamRef.current.getTracks().forEach(track => {
                peer.addTrack(track, myStreamRef.current);
            });
        }

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("peer:ice-candidate", { to: socketId, candidate: event.candidate });
            }
        };

        peer.ontrack = (event) => {
            console.log("GOT REMOTE TRACK from", socketId);
            setRemoteStreams(prev => {
                const existing = prev.find(p => p.socketId === socketId);
                if (existing) {
                    if (existing.stream.id === event.streams[0].id) return prev;
                    return prev.map(p => p.socketId === socketId ? { ...p, stream: event.streams[0] } : p);
                }
                return [...prev, {
                    socketId,
                    stream: event.streams[0],
                    name: email || `User ${socketId.substring(0, 4)}`,
                    videoEnabled: true,
                    audioEnabled: true
                }];
            });
        };

        // Removed onnegotiationneeded to prevent double offers and glare.
        // We use explicit manual negotiation in handleUserJoined.

        peersRef.current.set(socketId, peer);
        return peer;
    }, [socket]);

    const handleUserJoined = useCallback(async ({ email, id }) => {
        console.log(`User ${email} joined the room with socket ID: ${id}`);
        const peer = createPeerConnection(id, email);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("user:call", { to: id, offer, email: user?.name || user?.email || "Peer" });

        // If I am currently sharing screen, inform the new user
        if (activeScreenShareUser === 'local') {
            socket.emit("screen:state", { room: roomId, isSharing: true });
        }
    }, [createPeerConnection, socket, user, activeScreenShareUser, roomId]);

    const handleIncomingCall = useCallback(async ({ from, offer, email }) => {
        console.log(`Incoming call from ${from}`);
        const peer = createPeerConnection(from, email);
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const ans = await peer.createAnswer();
        await peer.setLocalDescription(ans);
        socket.emit("call:accepted", { to: from, ans });
    }, [createPeerConnection, socket]);

    const handleCallAccepted = useCallback(async ({ from, ans }) => {
        console.log(`Call accepted from ${from}`);
        const peer = peersRef.current.get(from);
        if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }, []);

    const handleNegoNeedIncomming = useCallback(async ({ from, offer }) => {
        const peer = peersRef.current.get(from);
        if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(offer));
            const ans = await peer.createAnswer();
            await peer.setLocalDescription(ans);
            socket.emit("peer:nego:done", { to: from, ans });
        }
    }, [socket]);

    const handleNegoNeedFinal = useCallback(async ({ from, ans }) => {
        const peer = peersRef.current.get(from);
        if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(ans));
        }
    }, []);

    const handleIncomingIceCandidate = useCallback(async ({ from, candidate }) => {
        const peer = peersRef.current.get(from);
        if (peer && candidate) {
            try {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error("Error adding ice candidate", e);
            }
        }
    }, []);

    const handleUserLeft = useCallback(({ socketId }) => {
        console.log("User left:", socketId);
        const peer = peersRef.current.get(socketId);
        if (peer) {
            peer.close();
            peersRef.current.delete(socketId);
        }
        setRemoteStreams(prev => prev.filter(p => p.socketId !== socketId));
        if (activeScreenShareUser === socketId) {
            setActiveScreenShareUser(null);
        }
    }, [activeScreenShareUser]);

    const toggleMic = useCallback(() => {
        if (myStreamRef.current) {
            myStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !micOn;
            });
            setMicOn(prev => !prev);
        }
    }, [micOn]);

    const handleLeaveMeeting = useCallback(async (forced = false) => {
        try {
            if (!forced) await leaveMeeting(roomId).unwrap();
            socket.emit("room:leave", { meetingCode: roomId });
            if (myStreamRef.current) myStreamRef.current.getTracks().forEach(t => t.stop());
            peersRef.current.forEach(p => p.close());
            navigate('/');
        } catch (err) {
            console.error("Failed to leave meeting:", err);
            navigate('/');
        }
    }, [leaveMeeting, roomId, socket, navigate]);

    useEffect(() => {
        if (!isJoined) return;

        socket.on("user:joined", handleUserJoined);
        socket.on("incoming:call", handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);
        socket.on("peer:ice-candidate", handleIncomingIceCandidate);
        socket.on("user-left", handleUserLeft);

        socket.on("meeting:ended", () => {
            alert("The host has ended the meeting.");
            handleLeaveMeeting(true);
        });

        socket.on("chat:receive", (data) => {
            setMessages(prev => [...prev, { ...data, isMe: false }]);
        });

        socket.on("screen:state", ({ isSharing, socketId }) => {
            setActiveScreenShareUser(prev => {
                if (isSharing) return socketId;
                return prev === socketId ? null : prev;
            });
        });

        socket.on("room:mute-all", () => {
            if (micOn) toggleMic();
            showToast("The host muted everyone.");
        });

        socket.on("room:kicked", () => {
            alert("You have been removed from the meeting by the host.");
            handleLeaveMeeting(true);
        });

        socket.on("room:muted", () => {
            if (micOn) toggleMic();
            showToast("The host muted you.");
        });

        socket.on("user:raise-hand", ({ name }) => {
            showToast(`${name} raised their hand ✋`);
        });

        socket.on("room:permissions:update", ({ permissions }) => {
            if (permissions.canRecord !== undefined) {
                setCanRecord(permissions.canRecord);
                showToast(permissions.canRecord ? "The host has enabled recording." : "The host disabled recording.");
            }
        });

        socket.on("room:caption", ({ caption }) => {
            setLatestCaption(caption);
            setTranscript(prev => [...prev, `${caption.speaker} [${caption.timestamp}]: ${caption.text}`]);
            if (captionTimeoutRef.current) clearTimeout(captionTimeoutRef.current);
            captionTimeoutRef.current = setTimeout(() => setLatestCaption(null), 3000);
        });

        return () => {
            socket.off("user:joined");
            socket.off("incoming:call");
            socket.off("call:accepted");
            socket.off("peer:nego:needed");
            socket.off("peer:nego:final");
            socket.off("peer:ice-candidate");
            socket.off("user-left");
            socket.off("meeting:ended");
            socket.off("chat:receive");
            socket.off("screen:state");
            socket.off("room:mute-all");
            socket.off("room:kicked");
            socket.off("room:muted");
            socket.off("user:raise-hand");
            socket.off("room:permissions:update");
            socket.off("room:caption");
        };
    }, [socket, isJoined, micOn, handleUserJoined, handleIncomingCall, handleCallAccepted, handleNegoNeedIncomming, handleNegoNeedFinal, handleIncomingIceCandidate, handleUserLeft, showToast, toggleMic, handleLeaveMeeting]);

    // ---------------------------------------------------------
    // MEDIA CONTROLS & SCREEN SHARE
    // ---------------------------------------------------------

    const handleJoinClick = useCallback(async () => {
        try {
            await joinMeeting(roomId).unwrap();
            setIsJoined(true);
            socket.emit("room:join", { email: user?.email, room: roomId });
        } catch (err) {
            console.error("Failed to join meeting:", err);
            const msg = err?.data?.message || "Failed to join meeting. It may have ended.";
            alert(msg);
            navigate('/');
        }
    }, [socket, user, roomId, joinMeeting, navigate]);

    const toggleVideo = () => {
        if (myStreamRef.current) {
            myStreamRef.current.getVideoTracks().forEach(track => {
                if (track.label.includes("screen")) return;
                track.enabled = !videoOn;
            });
            setVideoOn(!videoOn);
        }
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];

                // Replace track for all peers
                peersRef.current.forEach(peer => {
                    const videoSender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
                    if (videoSender) videoSender.replaceTrack(screenTrack);
                });

                const audioTracks = myStreamRef.current ? myStreamRef.current.getAudioTracks() : [];
                const newStream = new MediaStream([screenTrack, ...audioTracks]);
                setMyStream(newStream);
                myStreamRef.current = newStream;
                setIsScreenSharing(true);
                setActiveScreenShareUser("local"); // Flag for UI
                socket.emit("screen:state", { room: roomId, isSharing: true });

                screenTrack.onended = () => {
                    stopScreenShare();
                };
            } catch (err) {
                console.error("Failed to share screen", err);
            }
        } else {
            stopScreenShare();
        }
    };

    const stopScreenShare = async () => {
        try {
            let camTrack = null;
            try {
                const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
                camTrack = camStream.getVideoTracks()[0];
                camTrack.enabled = videoOn;
            } catch (e) {
                console.warn("Could not revert to webcam", e);
            }

            peersRef.current.forEach(peer => {
                const videoSender = peer.getSenders().find(s => s.track && s.track.kind === 'video');
                if (videoSender) videoSender.replaceTrack(camTrack);
            });

            const audioTracks = myStreamRef.current ? myStreamRef.current.getAudioTracks() : [];
            const tracksToKeep = camTrack ? [camTrack, ...audioTracks] : [...audioTracks];

            if (tracksToKeep.length > 0) {
                const newStream = new MediaStream(tracksToKeep);
                setMyStream(newStream);
                myStreamRef.current = newStream;
            }

            setIsScreenSharing(false);
            setActiveScreenShareUser(null);
            socket.emit("screen:state", { room: roomId, isSharing: false });
        } catch (err) {
            console.error("Failed to revert to camera", err);
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
            return;
        }

        if (!isHost && !canRecord) {
            alert("Recording is disabled by the host.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    recordedChunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.style.display = 'none';
                a.href = url;
                a.download = `IntellMeet_Recording_${new Date().toISOString().slice(0, 10)}.webm`;
                a.click();
                window.URL.revokeObjectURL(url);
                recordedChunksRef.current = [];
                setIsRecording(false);
                stream.getTracks().forEach(t => t.stop());
                showToast("Recording saved!");
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            showToast("Recording started...");

            stream.getVideoTracks()[0].onended = () => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                }
            };
        } catch (err) {
            console.error("Error starting recording:", err);
            showToast("Recording cancelled or failed.");
        }
    };

    const handleEndMeeting = async () => {
        if (!isHost) return;

        // 1. Instantly kill local media tracks (Camera/Mic)
        if (myStreamRef.current) myStreamRef.current.getTracks().forEach(t => t.stop());
        if (myStream) myStream.getTracks().forEach(t => t.stop());
        
        // 2. Kill Peer Connections instantly
        peersRef.current.forEach(p => p.close());
        
        // 3. Broadcast to all other participants to leave instantly
        socket.emit("room:end", { meetingCode: roomId });

        // 4. Navigate away instantly so user feels the call is completely over
        navigate('/');
        showToast("Call ended. Generating AI summary in background...");

        // 5. Fire off slow API calls in background in PARALLEL without blocking each other
        const finalTranscript = transcript && transcript.length > 0 ? transcript.join('\n') : "Meeting concluded with no spoken dialogue.";
        
        Promise.allSettled([
            generateSummary({ meetingCode: roomId, transcript: finalTranscript }).unwrap(),
            endMeeting(roomId).unwrap()
        ]).then((results) => {
            const [summaryResult, endResult] = results;
            if (summaryResult.status === 'rejected') console.error("AI Summary Error:", summaryResult.reason);
            if (endResult.status === 'rejected') console.error("End Meeting DB Error:", endResult.reason);
        });
    };

    // handleLeaveMeeting moved above useEffect

    const handleSendMessage = (text) => {
        const newMessage = {
            message: text,
            senderName: user?.name || "You",
            timestamp: new Date().toISOString(),
            isMe: true
        };
        setMessages(prev => [...prev, newMessage]);
        socket.emit("chat:send", { room: roomId, message: text, senderName: user?.name || "Anonymous" });
    };

    const handleToggleRecordingPermission = useCallback(() => {
        const newPermission = !canRecord;
        setCanRecord(newPermission);
        socket.emit("room:permissions:update", { room: roomId, permissions: { canRecord: newPermission } });
    }, [canRecord, roomId, socket]);

    // ---------------------------------------------------------
    // RENDER: LOBBY
    // ---------------------------------------------------------
    if (!isJoined) {
        return (
            <div className="flex flex-col min-h-[calc(100vh-80px)] bg-transparent text-white px-4 justify-center items-center py-6">
                <div className="w-full max-w-4xl bg-black/60 backdrop-blur-xl border border-red-950/50 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 w-full flex flex-col items-center gap-4">
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/80 border-2 border-red-950/30 shadow-inner">
                            {myStream ? (
                                <VideoPlayer stream={myStream} muted={true} className="w-full h-full object-cover" />
                            ) : cameraError ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 p-6 text-center">
                                    <p className="font-semibold">{cameraError}</p>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-500">Starting camera...</div>
                            )}
                            {/* Overlay Controls */}
                            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-4">
                                <button onClick={toggleMic} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all backdrop-blur ${micOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-700 hover:bg-red-600'}`}>{micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}</button>
                                <button onClick={toggleVideo} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all backdrop-blur ${videoOn ? 'bg-white/10 hover:bg-white/20' : 'bg-red-700 hover:bg-red-600'}`}>{videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col items-center text-center space-y-6">
                        <h2 className="text-3xl font-bold mb-2">Ready to join?</h2>
                        <p className="text-slate-400">Meeting code: <span className="font-mono text-white">{roomId}</span></p>
                        <button 
                            onClick={handleJoinClick} 
                            disabled={isJoiningAPI}
                            className="w-full max-w-xs rounded-xl bg-red-600 hover:bg-red-700 px-8 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 disabled:opacity-50"
                        >
                            {isJoiningAPI ? 'Joining...' : 'Join Meeting'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ---------------------------------------------------------
    // RENDER: IN MEETING (MESH)
    // ---------------------------------------------------------

    // Construct participant array for the layout
    const allParticipants = [
        {
            id: "local",
            socketId: socket.id,
            name: "You",
            isLocal: true,
            stream: myStream,
            audioEnabled: micOn,
            videoEnabled: videoOn,
            handRaised: false
        },
        ...remoteStreams.map(rs => ({
            id: rs.socketId,
            socketId: rs.socketId,
            name: rs.name,
            isLocal: false,
            stream: rs.stream,
            audioEnabled: rs.audioEnabled,
            videoEnabled: rs.videoEnabled,
            handRaised: false
        }))
    ];

    const presentationParticipant = pinnedParticipant
        ? allParticipants.find(p => p.id === pinnedParticipant)
        : activeScreenShareUser
            ? allParticipants.find(p => p.socketId === activeScreenShareUser || (activeScreenShareUser === 'local' && p.id === 'local'))
            : null;

    const isScreenShareLayout = !!presentationParticipant;

    const handlePinParticipant = (id) => {
        setPinnedParticipant(prev => prev === id ? null : id);
    };

    return (
        <MeetingLayout
            isSidebarOpen={sidebarMode !== null}
            sidebarContent={sidebarMode ? <Sidebar mode={sidebarMode} onClose={() => setSidebarMode(null)} messages={messages} onSendMessage={handleSendMessage} participants={allParticipants} isHost={isHost} onRemoveParticipant={handleRemoveParticipant} onMuteParticipant={handleMuteParticipant} onMuteAll={handleMuteAll} onEndMeeting={handleEndMeeting} canRecord={canRecord} onToggleRecordingPermission={handleToggleRecordingPermission} /> : null}
        >
            <div className="flex-1 flex flex-col bg-transparent relative overflow-hidden">
                {isScreenShareLayout ? (
                    <div className="absolute inset-0 z-10 bg-transparent flex items-center justify-center overflow-hidden">
                        {/* Maximum Page Screen Share / Pinned View */}
                        <div className="w-full h-full cursor-pointer" onDoubleClick={() => handlePinParticipant(presentationParticipant.id)}>
                            <VideoTile participant={presentationParticipant} isActiveSpeaker={true} />
                        </div>

                        {/* Floating PIP Filmstrip for everyone else */}
                        <div className="absolute top-4 right-4 flex flex-col gap-3 z-20 max-h-[calc(100vh-120px)] overflow-y-auto p-1 scrollbar-hide">
                            {allParticipants.filter(p => p.id !== presentationParticipant.id).map(p => (
                                <div key={p.id} className="w-32 sm:w-48 aspect-video rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/50 hover:scale-105 transition-transform shrink-0 cursor-pointer" onDoubleClick={() => handlePinParticipant(p.id)}>
                                    <VideoTile participant={p} isActiveSpeaker={false} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <VideoGrid participants={allParticipants} onPinParticipant={handlePinParticipant} />
                )}

                {/* Live Captions Overlay */}
                {captionsOn && latestCaption && (
                    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[90%] text-center pointer-events-none">
                        <div className="inline-block bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl border border-red-950/50">
                            <span className="font-bold text-red-400 text-sm block mb-1">{latestCaption.speaker}</span>
                            <p className="text-lg">{latestCaption.text}</p>
                        </div>
                    </div>
                )}

                <ControlBar
                    showControls={showControls}
                    onToggleMic={toggleMic}
                    onToggleCam={toggleVideo}
                    onToggleScreenShare={toggleScreenShare}
                    onToggleSidebar={(mode) => setSidebarMode(prev => prev === mode ? null : mode)}
                    onLeave={() => handleLeaveMeeting(false)}
                    onEndMeeting={handleEndMeeting}
                    isHost={isHost}
                    state={{
                        micEnabled: micOn,
                        camEnabled: videoOn,
                        isScreenSharing: activeScreenShareUser === 'local',
                        sidebarMode,
                        isFullscreen,
                        isRecording
                    }}
                    onToggleFullscreen={toggleFullscreen}
                    onToggleRecording={toggleRecording}
                />
            </div>
        </MeetingLayout>
    );
};

export default RoomPage;
