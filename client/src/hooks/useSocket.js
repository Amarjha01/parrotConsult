/*  src/hooks/useSocket.js  */
import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

export default function useSocket(roomId) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // Connect socket
  useEffect(() => {
    const url = import.meta.env.VITE_SOCKET_URL;

    socketRef.current = io(url, {
      transports: ['websocket'],
      withCredentials: true,
    });

    // Log on successful connection
    socketRef.current.on('connect', () => {
      setConnected(true);
      console.log(`✅ Socket connected: ${socketRef.current.id}`);
    });

    // Log connection errors
    socketRef.current.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    socketRef.current.on('disconnect', () => {
      setConnected(false);
      console.warn('⚠️ Socket disconnected');
    });

    return () => {
      socketRef.current.disconnect();
      console.log('🧹 Socket cleanup');
    };
  }, []);

  // Join and leave room
  useEffect(() => {
    if (!connected || !roomId) return;

    console.log(`🚪 Joining room: ${roomId}`);
    socketRef.current.emit('join-room', roomId);

    return () => {
      console.log(`🚪 Leaving room: ${roomId}`);
      socketRef.current.emit('leave-room', roomId);
    };
  }, [connected, roomId]);

  const disconnectSocket = useCallback(() => {
    socketRef.current?.disconnect();
    setConnected(false);
  }, []);

  return {
    socket: socketRef.current,
    connected,
    disconnectSocket,
  };
}
