import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { message, username, stationTitle, station } = req.body;

  if (!message || !username) {
    return res.status(400).send('message and username are required');
  }

  try {
    await pusher.trigger('presence-study-lounge', 'new-message', {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      sender: username,
      text: message,
      timestamp: Date.now(),
      stationTitle: stationTitle,
      station: station
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Pusher trigger error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
