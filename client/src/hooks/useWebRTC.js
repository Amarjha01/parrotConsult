// src/hooks/useWebRTC.js
import { useState, useEffect, useRef, useCallback } from 'react';

export default function useWebRTC(socket, roomId, navigate) {
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);

  // Step 1: Get local stream on mount
  useEffect(() => {
    (async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log('🎥 Got local stream', localStream);
        setStream(localStream);
      } catch (error) {
        console.error('❌ Failed to get local media stream', error);
        alert('Could not access camera or microphone.');
        navigate('/');
      }
    })();
  }, [navigate]);

  // Step 2: Set local video srcObject
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Step 3: Initialize WebRTC connection
  const initConnection = useCallback(() => {
    if (!stream || !socket) return;

    console.log('🔗 Initializing WebRTC connection');
    setConnectionState('connecting');

    // Example placeholder: you should implement offer/answer + ICE logic here
    // and set up your RTCPeerConnection

    // For demonstration:
    peerRef.current = new RTCPeerConnection();

    stream.getTracks().forEach(track => {
      peerRef.current.addTrack(track, stream);
    });

    // Further socket signaling setup goes here

    setConnectionState('connected');
  }, [stream, socket]);

  const toggleAudio = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  const toggleVideo = () => {
    if (!stream) return;
    stream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsVideoOff(!track.enabled);
    });
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerRef.current?.getSenders().find(s => s.track.kind === 'video');

      if (sender) sender.replaceTrack(screenTrack);
      setIsScreenSharing(true);

      screenTrack.onended = () => stopScreenShare();
    } catch (err) {
      console.error('❌ Screen share failed:', err);
    }
  };

  const stopScreenShare = () => {
    const videoTrack = stream?.getVideoTracks()[0];
    const sender = peerRef.current?.getSenders().find(s => s.track.kind === 'video');
    if (sender && videoTrack) {
      sender.replaceTrack(videoTrack);
    }
    setIsScreenSharing(false);
  };

  const endCall = () => {
    stream?.getTracks().forEach(track => track.stop());
    peerRef.current?.close();
    peerRef.current = null;
    socket?.emit('leave-room', roomId);
    setConnectionState('disconnected');
    navigate('/');
  };

  return {
    localVideoRef,
    remoteVideoRef,
    initConnection,
    toggleAudio,
    toggleVideo,
    shareScreen,
    stopScreenShare,
    endCall,
    state: {
      isMuted,
      isVideoOff,
      isScreenSharing,
      connectionState,
    },
  };
}
