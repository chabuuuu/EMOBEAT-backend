import { mediaController } from '@/container/media.container';
import { authenticateJWT } from '@/middleware/authenticate.middleware';
import uploadImageMiddleware from '@/middleware/upload-image.middleware';
import uploadMusicMiddleware from '@/middleware/upload-music.middleware';
import express from 'express';
const mediaRouter = express.Router();

mediaRouter

  .post('/upload/image', uploadImageMiddleware.single('file'), mediaController.uploadImage.bind(mediaController))

  .post('/upload/music', uploadMusicMiddleware.single('file'), mediaController.uploadMusic.bind(mediaController))

  .get('/music', authenticateJWT, mediaController.getMusic.bind(mediaController))

  .get('/image', mediaController.getImage.bind(mediaController));

export default mediaRouter;
