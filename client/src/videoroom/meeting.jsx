import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { getBookingById } from "../apis/bookingApi";

let hasPlayedRemote = false;
const cleanupWebRTC = ({
  peerConnection,
  localStream,
  localVideo,
  remoteVideo,
}) => {
  console.log("🧹 Cleaning up WebRTC");

  if (peerConnection.current) {
    peerConnection.current.close();
    peerConnection.current = null;
  }

  if (localStream.current) {
    localStream.current.getTracks().forEach((track) => track.stop());
    localStream.current = null;
  }

  if (remoteVideo.current) {
    remoteVideo.current.srcObject = null;
  }

  if (localVideo.current) {
    localVideo.current.srcObject = null;
  }

  hasPlayedRemote = false;
};

export default function MeetingRoom() {
  const [hasLocalVideo, setHasLocalVideo] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  let screenVideoTrackRef = useRef(null); // Keeps screen track reference

  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accessAllowed, setAccessAllowed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionState, setConnectionState] = useState("new");
  const [remoteStreamReceived, setRemoteStreamReceived] = useState(false);
  const socketRef = useRef(null);

  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerConnection = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    const socket = io(
      import.meta.env.VITE_SOCKET_URL || "https://api.parrotconsult.com",
      {
        transports: ["websocket"],
        withCredentials: true,
      }
    );
    socketRef.current = socket;

    const initAccess = async () => {
      try {
        const booking = await getBookingById(bookingId);
        const rawUser =
          localStorage.getItem("user") || localStorage.getItem("consultant");
        if (!rawUser) throw new Error("User not logged in");

        const parsed = JSON.parse(rawUser);
        const currentUser = parsed.data || parsed;

        const consultantId =
          typeof booking.consultant === "object"
            ? booking.consultant._id
            : booking.consultant;

        const userId =
          typeof booking.user === "object" ? booking.user._id : booking.user;

        const isConsultant = currentUser._id === consultantId;
        const isUser = currentUser._id === userId;

        if (!isConsultant && !isUser) {
          alert("Unauthorized");
          return navigate("/");
        }

        setAccessAllowed(true); // ✅ Now your JSX video can render
      } catch (err) {
        console.error("Initialization failed:", err);
        alert("Failed to join meeting.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    initAccess();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave-room", bookingId);
        socketRef.current.disconnect();
        socketRef.current.off();
      }

      cleanupWebRTC({
        peerConnection,
        localStream,
        localVideo,
        remoteVideo,
      });

      setHasLocalVideo(false);
    };
  }, [bookingId]);

  useEffect(() => {
    if (!accessAllowed) return;
    if (!localVideo.current) return;

    const setup = async () => {
      console.log("✅ localVideo ref is ready:", localVideo.current);

      await cleanupWebRTC({
        peerConnection,
        localStream,
        localVideo,
        remoteVideo,
      });

      await setupWebRTC(bookingId);
    };

    setup();
  }, [accessAllowed, localVideo.current]); // 👈 this triggers when video ref is ready

  const setupWebRTC = async (roomId) => {
    let isOfferer = false;

    try {
      console.log("\u{1F3AC} Setting up WebRTC for room:", roomId);

      // Get media stream with fallback
      const requestMediaStream = () =>
        new Promise((resolve, reject) => {
          console.log("\u{1F3A5} Requesting media devices...");

          navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
              console.log("\u{1F3A5} Local stream tracks:", stream.getTracks());
              console.log(
                "\u{1F3A5} Audio track enabled:",
                stream.getAudioTracks()?.[0]?.enabled
              );
              console.log(
                "\u{1F3A5} Video track enabled:",
                stream.getVideoTracks()?.[0]?.enabled
              );
              resolve(stream);
            })
            .catch((err) => {
              console.warn(
                "\u{274C} First attempt failed, retrying in 500ms...",
                err
              );
              setTimeout(() => {
                navigator.mediaDevices
                  .getUserMedia({ video: true, audio: true })
                  .then((stream) => {
                    console.log("\u{2705} Media stream acquired on retry");
                    resolve(stream);
                  })
                  .catch((finalErr) => {
                    console.error(
                      "\u{1F6AB} Final camera/mic error:",
                      finalErr
                    );
                    alert(
                      "Could not access camera or mic. Please check permissions."
                    );
                    reject(finalErr);
                  });
              }, 500);
            });
        });

      const stream = await requestMediaStream();
      localStream.current = stream;

      stream.getTracks().forEach((track) => {
        console.log(
          "\u{1F4F7} Local track:",
          track.kind,
          "enabled:",
          track.enabled
        );
      });

      if (!stream.getVideoTracks()[0]) {
        console.warn("\u{26A0} No video track found in local stream");
      }

      // Attach local stream to video element (only once)
      if (localVideo.current) {
        localVideo.current.srcObject = stream;
        setHasLocalVideo(true); // ✅ This tells React that local video is attached

        console.log("\u{1F39E}\uFE0F Local video DOM state");
        console.log("srcObject exists:", !!localVideo.current?.srcObject);
        console.log("Video tag muted:", localVideo.current?.muted);
        console.log(
          "Video visibility (offsetHeight):",
          localVideo.current?.offsetHeight
        );
        console.log(
          "Video visibility (offsetWidth):",
          localVideo.current?.offsetWidth
        );

        setTimeout(() => {
          localVideo.current
            .play()
            .then(() => console.log("\u{1F4FA} Local video is playing"))
            .catch((err) =>
              console.error("\u{274C} Local video play() failed:", err)
            );
        }, 50);
      }

      // Create peer connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      });

      // Add local tracks
      stream.getTracks().forEach((track) => {
        console.log("\u{2795} Adding track:", track.kind);
        peerConnection.current.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        console.log("\u{1F3A5} Remote stream received:", event);
        if (event.streams?.[0]) {
          setRemoteStreamReceived(true);
          const remoteStream = event.streams[0];
          if (
            remoteVideo.current &&
            (!remoteVideo.current.srcObject ||
              remoteVideo.current.srcObject !== remoteStream)
          ) {
            remoteVideo.current.srcObject = remoteStream;
            console.log("\u{2705} Remote video stream assigned");

            setTimeout(() => {
              remoteVideo.current
                .play()
                .then(() => console.log("\u{1F4FA} Remote video is playing"))
                .catch((err) =>
                  console.error("\u{274C} Remote video play() failed:", err)
                );
            }, 50);
          }
        }
      };

      // Handle ICE
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("\u{1F9CA} Sending ICE candidate");
          socketRef.current.emit("ice-candidate", {
            candidate: event.candidate,
            roomId,
          });
        } else {
          console.log("\u{1F9CA} All ICE candidates sent");
        }
      };

      // Connection state logging
      peerConnection.current.onconnectionstatechange = () =>
        setConnectionState(peerConnection.current.connectionState);
      peerConnection.current.onicegatheringstatechange = () =>
        console.log(
          "ICE gathering state:",
          peerConnection.current.iceGatheringState
        );
      peerConnection.current.oniceconnectionstatechange = () =>
        console.log(
          "ICE connection state:",
          peerConnection.current.iceConnectionState
        );

      // Clear previous socket listeners
      [
        "ready",
        "offer",
        "answer",
        "ice-candidate",
        "user-disconnected",
      ].forEach((event) => {
        socketRef.current.off(event);
      });

      // Join room
      socketRef.current.emit("join-room", roomId, (response) => {
        const clientCount = response?.clientCount ?? response;
        console.log("\u{1F3E0} Join room response:", clientCount);
        if (clientCount === 1) {
          isOfferer = true;
          console.log("\u{1F464} I am the offerer");
        }
      });

      // Handle signaling
      socketRef.current.on("ready", async () => {
        console.log("\u{1F680} Ready signal received, isOfferer:", isOfferer);
        if (isOfferer) {
          try {
            const offer = await peerConnection.current.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            await peerConnection.current.setLocalDescription(offer);
            socketRef.current.emit("offer", { sdp: offer, roomId });
          } catch (err) {
            console.error("\u{274C} Error creating offer:", err);
          }
        }
      });

      socketRef.current.on("offer", async ({ sdp }) => {
        console.log("\u{1F4E5} Offer received:", sdp);
        try {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(sdp)
          );
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socketRef.current.emit("answer", { sdp: answer, roomId });
        } catch (err) {
          console.error("\u{274C} Error handling offer:", err);
        }
      });

      socketRef.current.on("answer", async ({ sdp }) => {
        console.log("\u{1F4E5} Answer received:", sdp);
        try {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(sdp)
          );
          console.log("\u{2705} Remote description set successfully");
        } catch (err) {
          console.error("\u{274C} Error handling answer:", err);
        }
      });

      socketRef.current.on("ice-candidate", async ({ candidate }) => {
        try {
          if (candidate && peerConnection.current.remoteDescription) {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
            console.log("\u{2705} ICE candidate added successfully");
          } else {
            console.log("\u{23F3} Queueing ICE candidate");
          }
        } catch (err) {
          console.error("\u{274C} Failed to add ICE candidate:", err);
        }
      });

      socketRef.current.on("user-disconnected", () => {
        console.log("\u{1F44B} Remote user disconnected");
        setRemoteStreamReceived(false);
        cleanupWebRTC({ peerConnection, localStream, localVideo, remoteVideo });
      });
    } catch (err) {
      console.error("\u{1F6AB} setupWebRTC error:", err);
      alert(
        `Could not access camera/mic or establish connection.\n\n${err.message}`
      );
    }
  };

  const toggleMute = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const screenVideoTrack = screenStream.getVideoTracks()[0];
      const screenAudioTrack = screenStream.getAudioTracks()[0];

      const senders = peerConnection.current.getSenders();

      const videoSender = senders.find((s) => s.track?.kind === "video");
      const audioSender = senders.find((s) => s.track?.kind === "audio");

      if (videoSender && screenVideoTrack) {
        await videoSender.replaceTrack(screenVideoTrack);
        screenVideoTrackRef.current = screenVideoTrack;
        setIsScreenSharing(true);
      }

      if (audioSender && screenAudioTrack) {
        await audioSender.replaceTrack(screenAudioTrack);
      }

      screenVideoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Screen sharing failed:", err);
      alert("Screen sharing failed or was cancelled.");
    }
  };

  const stopScreenShare = async () => {
    try {
      const camVideoTrack = localStream.current?.getVideoTracks()[0];
      const micAudioTrack = localStream.current?.getAudioTracks()[0];

      const senders = peerConnection.current.getSenders();
      const videoSender = senders.find((s) => s.track?.kind === "video");
      const audioSender = senders.find((s) => s.track?.kind === "audio");

      if (videoSender && camVideoTrack) {
        await videoSender.replaceTrack(camVideoTrack);
      }

      if (audioSender && micAudioTrack) {
        await audioSender.replaceTrack(micAudioTrack);
      }

      if (screenVideoTrackRef.current) {
        screenVideoTrackRef.current.stop();
        screenVideoTrackRef.current = null;
      }

      setIsScreenSharing(false);
    } catch (err) {
      console.error("Failed to stop screen share:", err);
    }
  };

  const endCall = () => {
    if (socketRef.current) {
      socketRef.current.emit("leave-room", bookingId);
      socketRef.current.off();
      socketRef.current.disconnect();
    }

    cleanupWebRTC({ peerConnection, localStream, localVideo, remoteVideo });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!accessAllowed) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                connectionState === "connected"
                  ? "bg-green-500"
                  : connectionState === "connecting"
                  ? "bg-yellow-500 animate-pulse"
                  : "bg-red-500 animate-pulse"
              }`}
            ></div>
            <h1 className="text-xl font-semibold text-white">Meeting Room</h1>
            <span className="text-xs text-gray-400 capitalize">
              ({connectionState})
            </span>
          </div>
          <div className="text-sm text-gray-300">
            Room ID: {bookingId?.slice(-8)}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Remote Video - Main */}
            <div className="relative group order-2 lg:order-1">
              <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl aspect-video">
                <video
                  ref={remoteVideo}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!remoteStreamReceived && (
                  <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Waiting for remote user...
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-sm font-medium">
                        Remote
                      </span>
                    </div>
                  </div>
                </div>
                {/* Connection Status Indicator */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        remoteStreamReceived
                          ? "bg-green-400 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-white text-xs">
                      {remoteStreamReceived ? "Connected" : "Waiting..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Local Video - Picture in Picture */}
            <div className="relative group order-1 lg:order-2">
              <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl aspect-video">
                {/* <video
                  ref={localVideo}
                  autoPlay
                  muted // ✅ Required to bypass autoplay policy
                  playsInline // ✅ Avoid full screen on iOS/safari
                  className="w-full h-full object-cover"
                /> */}

                {accessAllowed && (
                  <video
                    ref={localVideo}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      minWidth: "300px",
                      minHeight: "200px",
                      backgroundColor: "black",
                      border: "2px solid red",
                    }}
                  />
                )}
                {/* 
                {!hasLocalVideo && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(255, 0, 0, 0.6)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      zIndex: 10,
                    }}
                  >
                    🚨 No local video stream
                  </div>
                )} */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-sm font-medium">
                        You
                      </span>
                    </div>
                  </div>
                </div>
                {/* Video Off Overlay */}
                {isVideoOff && (
                  <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-300 text-sm">Camera Off</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex justify-center">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center space-x-4">

                {/* Mic Mute/Unmute */}
                <button
                  onClick={toggleMute}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isMuted
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                  title={isMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isMuted ? (
                      // Mic Off Icon
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5a3 3 0 016 0v6a3 3 0 01-6 0V5zm-4 6a8 8 0 0016 0M3 3l18 18"
                      />
                    ) : (
                      // Mic On Icon
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 1v11a3 3 0 01-3 3H9a3 3 0 01-3-3V1m9 10a3 3 0 01-3 3h0a3 3 0 01-3-3"
                      />
                    )}
                  </svg>
                </button>

                {/* Video Toggle */}
                <button
                  onClick={toggleVideo}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isVideoOff
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                  }`}
                  title={isVideoOff ? "Turn on camera" : "Turn off camera"}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isVideoOff ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12l-1.41-1.41L16 13.17V6a2 2 0 00-2-2H4.83l1.58-1.58L5 1l-4 4v1h1v10a2 2 0 002 2h10a2 2 0 002-2v-7.17l2.59 2.58L20 12z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    )}
                  </svg>
                </button>

                {/* End Call */}
                <button
                  onClick={endCall}
                  className="w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-200 transform hover:scale-105"
                  title="End call"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 16.5v2.25A2.25 2.25 0 005.25 21h2.25M3 16.5V14.25A2.25 2.25 0 015.25 12H8.5m7 8.25h2.25A2.25 2.25 0 0020.25 18.75V16.5M17.5 12h2.25A2.25 2.25 0 0122.5 14.25V16.5"
                    />
                  </svg>
                </button>

                {/* Screen Share (Placeholder) */}
                {isScreenSharing ? (
                  // Stop Sharing Button
                  <button
                    onClick={stopScreenShare}
                    className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 rounded-full flex items-center justify-center text-white transition-all duration-200"
                    title="Stop screen share"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                ) : (
                  // Start Sharing Button
                  <button
                    onClick={startScreenShare}
                    className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center text-white transition-all duration-200"
                    title="Share screen"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                )}

                {/* Settings (Placeholder) */}
                <button
                  className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200"
                  title="Settings"
                  disabled
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
