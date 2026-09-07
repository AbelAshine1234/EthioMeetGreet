import { Router, Request, Response } from 'express';

const router = Router();

interface SignalPayload {
  id: string;
  roomId: string;
  sender: string; // 'fan' | 'creator' | string
  type: 'offer' | 'answer' | 'candidate' | 'chat' | 'reaction' | 'join' | 'leave';
  data: any;
  timestamp: number;
}

// In-memory room signals store
const roomSignals: Record<string, SignalPayload[]> = {};

// Clean up stale signals every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const roomId in roomSignals) {
    roomSignals[roomId] = roomSignals[roomId].filter(s => now - s.timestamp < 300000); // 5 min
    if (roomSignals[roomId].length === 0) {
      delete roomSignals[roomId];
    }
  }
}, 60000);

// Post a signal (offer, answer, ICE candidate, chat message)
router.post('/signal', (req: Request, res: Response) => {
  const { roomId, sender, type, data } = req.body;
  if (!roomId || !sender || !type) {
    return res.status(400).json({ error: 'Missing required fields: roomId, sender, type' });
  }

  const signal: SignalPayload = {
    id: `sig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    roomId,
    sender,
    type,
    data,
    timestamp: Date.now(),
  };

  if (!roomSignals[roomId]) {
    roomSignals[roomId] = [];
  }
  roomSignals[roomId].push(signal);

  // Keep max 50 signals per room
  if (roomSignals[roomId].length > 50) {
    roomSignals[roomId] = roomSignals[roomId].slice(-50);
  }

  res.json({ success: true, signalId: signal.id });
});

// Poll for signals in a room
router.get('/signals/:roomId', (req: Request, res: Response) => {
  const { roomId } = req.params;
  const since = Number(req.query.since || 0);
  const sender = req.query.sender as string;

  const allInRoom = roomSignals[roomId] || [];
  // Return signals from other senders created after 'since'
  const newSignals = allInRoom.filter(
    (s) => s.timestamp > since && (!sender || s.sender !== sender)
  );

  res.json({
    roomId,
    signals: newSignals,
    serverTime: Date.now(),
  });
});

// Reset / leave room
router.delete('/room/:roomId', (req: Request, res: Response) => {
  const { roomId } = req.params;
  delete roomSignals[roomId];
  res.json({ success: true, message: `Room ${roomId} cleared` });
});

export default router;
