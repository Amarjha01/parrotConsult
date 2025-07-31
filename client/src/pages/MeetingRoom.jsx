/*  src/pages/MeetingRoom.jsx  */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  memo,
  Suspense,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import useWebRTC from '../hooks/useWebRTC';
import Spinner from '../components/Spinner';
import ErrorBoundary from '../components/ErrorBoundary';

function MeetingRoom() {
  const { bookingId } = useParams();
  console.log(bookingId);
  
  
  const navigate = useNavigate();

  /* ---------- custom hooks ---------- */
  const {
    socket,
    connected: socketReady,
    disconnectSocket,
  } = useSocket(bookingId);

  const {
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
  } = useWebRTC(socket, bookingId, navigate);

  /* ---------- life-cycle ---------- */
  useEffect(() => {
    if (socketReady) initConnection();
    // clean-up
    return () => {
      endCall();
      disconnectSocket();
    };
  }, [socketReady, initConnection, disconnectSocket, endCall]);
console.log("🧩 MeetingRoom rendered with roomId:", bookingId);

  /* ---------- UI ---------- */
  return (
    <div className="meeting-room">
      <header className="controls">
        <button onClick={toggleAudio} aria-pressed={isMuted}>
          {isMuted ? 'Un-mute' : 'Mute'}
        </button>
        <button onClick={toggleVideo} aria-pressed={isVideoOff}>
          {isVideoOff ? 'Start Cam' : 'Stop Cam'}
        </button>
        {!isScreenSharing && (
          <button onClick={shareScreen}>Share Screen</button>
        )}
        {isScreenSharing && (
          <button onClick={stopScreenShare}>Stop Share</button>
        )}
        <button onClick={endCall} className="danger">
          Leave
        </button>
        <span className={`state ${connectionState}`}>
          {connectionState}
        </span>
      </header>

      {/* Videos */}
      <section className="video-panel">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          aria-label="Your camera feed"
          role="img"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          aria-label="Remote participant"
          role="img"
        />
      </section>
    </div>
  );
}

/* ---------- memoised & guarded export ---------- */
function WrappedMeetingRoom(props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <MeetingRoom {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default memo(WrappedMeetingRoom);

