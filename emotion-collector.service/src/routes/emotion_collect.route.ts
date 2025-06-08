import { emotionCollectController } from '@/container/emotion_collect.container';
import express from 'express';
const emotionCollectRouter = express.Router();

emotionCollectRouter.post('/collect', emotionCollectController.collect.bind(emotionCollectController));

export default emotionCollectRouter;
