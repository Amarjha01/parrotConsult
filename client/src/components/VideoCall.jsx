import React, { useState, useEffect } from 'react';
import AgoraUIKit from 'agora-react-uikit';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
const SERVER_URL = `${import.meta.env.VITE_API_BASE_URL}/agora`; 

export default function VideoCall() {
  const [videoCall, setVideoCall] = useState(false);
  const [token, setToken] = useState(null);
  
  const {meetingRoomId} = useParams();
  const channelName = meetingRoomId
  // Fetch token from your backend
  const getToken = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/token/${channelName}`);
      setToken(res.data.token);
      setVideoCall(true);
    } catch (err) {
      console.error('Error fetching Agora token:', err);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

 const connectionData = {
  appId: APP_ID,
  channel: channelName,
  token: token,
  role: 'host', 
}

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {videoCall && token ? (
        <AgoraUIKit
          rtcProps={connectionData}
          callbacks={{ EndCall: () => setVideoCall(false) }}
        />
      ) : (
        <h3>Loading call...</h3>
      )}
    </div>
  );
}
