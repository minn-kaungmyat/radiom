import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  if (!socketId || !channel) {
    return res.status(400).send('socket_id and channel_name are required');
  }

  // Generate random user id since we don't have true authentication
  const userId = Math.random().toString(36).slice(2, 11);
  const presenceData = {
    user_id: userId,
    user_info: {}
  };

  try {
    const auth = pusher.authorizeChannel(socketId, channel, presenceData);
    res.status(200).send(auth);
  } catch (error) {
    console.error('Pusher auth error:', error);
    res.status(500).send('Auth error');
  }
}
