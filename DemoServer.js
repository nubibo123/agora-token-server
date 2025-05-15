const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const PORT = process.env.PORT || 8080;
const APP_ID = process.env.APP_ID || '641dd0f7a16c4ad1b423397ed3d202ee';
const APP_CERTIFICATE = process.env.APP_CERTIFICATE || '4251d14ac60c479c9353c052799c5211';
const EXPIRATION_TIME_IN_SECONDS = 3600;

const app = express();
app.use(cors({ origin: 'https://agora-token-server-gzha.onrender.com' }));app.use(express.json());

const generateRtcToken = (req, res) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + EXPIRATION_TIME_IN_SECONDS;
    const channelName = req.query.channelName;
    const uid = parseInt(req.query.uid) || 0;

    if (!channelName) {
        return res.status(400).json({ error: 'channelName is required' });
    }

    try {
        const token = RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            channelName,
            uid,
            RtcRole.PUBLISHER,
            privilegeExpiredTs
        );
        res.json({ key: token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate token' });
    }
};

app.get('/rtcToken', generateRtcToken);

app.listen(PORT, () => {
    console.log(`AgoraSignServer running at port ${PORT}`);
});