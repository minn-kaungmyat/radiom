import express from 'express';
import cors from 'cors';
import Pusher from 'pusher';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

app.post('/api/message', async (req, res) => {
  const { message, username, stationTitle, station } = req.body;
  
  try {
    await pusher.trigger('presence-study-lounge', 'new-message', {
      id: Date.now().toString(),
      text: message,
      sender: username,
      stationTitle: stationTitle,
      station: station,
      timestamp: Date.now(),
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Pusher error:', error);
    res.status(500).json({ success: false, error: 'Failed to broadcast message' });
  }
});

app.post('/api/pusher/auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  
  // Create a random unique ID for the user's connection
  const presenceData = {
    user_id: 'user_' + Math.random().toString(36).substring(7),
    user_info: { name: 'Anonymous' }
  };
  
  try {
    const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
    res.send(authResponse);
  } catch (err) {
    console.error('Pusher auth error:', err);
    res.status(403).send('Forbidden');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local Pusher API server running on port ${PORT}`);
});
