import { streamQueueController } from '@/container/stream_queue.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import express from 'express';
const streamQueueRouter = express.Router();

streamQueueRouter
  .get('/', authenticateJWT, streamQueueController.getQueue.bind(streamQueueController))
  .post('/prev/:musicId', authenticateJWT, streamQueueController.prevTrack.bind(streamQueueController))
  .post('/add/:musicId', authenticateJWT, streamQueueController.addToQueue.bind(streamQueueController))
  .post('/next/:musicId', authenticateJWT, streamQueueController.nextTrack.bind(streamQueueController));

export default streamQueueRouter;
