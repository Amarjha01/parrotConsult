// server/src/routes/agora.js
import express from 'express';
import dotenv from 'dotenv';
import pkg from 'agora-access-token';

dotenv.config();

const { RtcTokenBuilder, RtcRole } = pkg;
const agoraRouter = express.Router();

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

if (!APP_ID || !APP_CERTIFICATE) {
  console.error('❌ Missing AGORA_APP_ID or AGORA_APP_CERTIFICATE in .env');
}

agoraRouter.get('/token/:channelName', (req, res) => {
  console.log('🎯 Agora token API called');

  const channel = req.params.channelName; // ✅ FIXED
  if (!channel) {
    return res.status(400).json({ error: 'Channel name is required' });
  }

  const uid = 0; // Auto assign UID
  const role = RtcRole.PUBLISHER;
  const expireTime = 3600; // 1 hour in seconds
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTime + expireTime;

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channel,
      uid,
      role,
      privilegeExpireTime
    );

    return res.json({ token, appId: APP_ID });
  } catch (err) {
    console.error('⚠️ Error generating Agora token:', err);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
});

export default agoraRouter;
