import { GetImageDto } from '@/dto/get-image.dto';
import { GetMusicDto } from '@/dto/get-music.dto';
import { IMediaService } from '@/service/interface/i.media.service';
import { ITrackingService } from '@/service/interface/i.tracking.service';
import { GlobalConfig } from '@/utils/config/global-config.util';
import { getCurrentLoggedUser } from '@/utils/get-current-logged-user.util';
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { v4 as uuidv4 } from 'uuid';

export class MediaController {
  private mediaService: IMediaService;
  private trackingService: ITrackingService;

  private serverUrl = GlobalConfig.server.url || '';

  constructor(
    @inject('MediaService') mediaService: IMediaService,
    @inject('TrackingService') trackingService: ITrackingService
  ) {
    this.mediaService = mediaService;
    this.trackingService = trackingService;
  }

  async getMediaId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mediaId = await this.mediaService.getMediaId();
      res.send_ok('Get media ID successfully', { mediaId: mediaId });
    } catch (error) {
      next(error);
    }
  }

  async getImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mediaCategory = req.query.mediaCategory?.toString();
      const fileName = req.query.fileName?.toString();
      const width = req.query.width ? parseInt(req.query.width as string, 10) : undefined;
      const height = req.query.height ? parseInt(req.query.height as string, 10) : undefined;

      if (!mediaCategory) {
        res.status(400).send('No media category provided.');
        return;
      }

      if (!fileName) {
        res.status(400).send('No file name provided.');
        return;
      }

      if ((width && width <= 0) || (height && height <= 0)) {
        res.status(400).send('Width and height must be positive numbers.');
        return;
      }

      const mediaDto: GetImageDto = await this.mediaService.getImage(fileName, mediaCategory, width, height);

      res.setHeader('Content-Type', mediaDto.contentType);
      mediaDto.mediaStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    const mediaCategory = req.query.mediaCategory?.toString();

    if (!mediaCategory) {
      return res.send_badRequest('No bucket name provided.');
    }

    if (!req.file) {
      return res.send_badRequest('No file uploaded or file is too large.');
    }

    try {
      const tempFilePath = req.file.path;

      console.log('tempFilePath', req.file);

      const fileName = uuidv4() + req!.file!.originalname!.toLowerCase().replace(/\s+/g, '');

      const result = await this.mediaService.uploadImage(fileName, tempFilePath, mediaCategory);
      res.send_ok('Upload image successfully', result);
    } catch (error) {
      console.log('error', error);

      res.send_internalServerError('Upload image failed', error);
    }
  }

  async getMusic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mediaCategory = req.query.mediaCategory?.toString();
      const fileName = req.query.fileName?.toString();
      const quality = req.query.quality?.toString() || '128';
      const listener = await getCurrentLoggedUser(req);

      if (!mediaCategory || !fileName) {
        res.status(400).send('Missing mediaCategory or fileName.');
        return;
      }

      // Check if listner can listen to the requested quality
      const canListenToQuality = await this.mediaService.checkCanListenToQuality(listener.id, quality);
      if (!canListenToQuality) {
        return res.send_forbidden('You do not have premium to listen to this quality.');
      }

      const mediaId = fileName.split('_')[0];

      const range = req.headers.range;

      const mediaDto: GetMusicDto = await this.mediaService.getMusic(fileName, mediaCategory, quality, range);

      if (range) {
        res.writeHead(206, {
          'Content-Range': `bytes ${mediaDto.start}-${mediaDto.end}/${mediaDto.fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': mediaDto.end - mediaDto.start + 1,
          'Content-Type': mediaDto.contentType
        });
      } else {
        res.writeHead(200, {
          'Content-Length': mediaDto.fileSize,
          'Content-Type': mediaDto.contentType
        });
      }

      mediaDto.mediaStream.pipe(res);

      // Track the music play event
      this.trackingService.trackMusicPlayed(mediaId, listener.id);
    } catch (error) {
      next(error);
    }
  }

  async uploadMusic(req: Request, res: Response, next: NextFunction) {
    const mediaCategory = req.query.mediaCategory?.toString();

    if (!req.query.mediaId) {
      return res.send_badRequest('No mediaId provided.');
    }

    const mediaId = req.query.mediaId.toString();

    if (!mediaCategory) {
      return res.send_badRequest('No bucket name provided.');
    }

    if (!req.file) {
      return res.send_badRequest('No file uploaded or file is too large.');
    }

    try {
      const tempFilePath = req.file.path;

      console.log('tempFilePath', req.file);

      const fileName = mediaId + '_' + req!.file!.originalname!.toLowerCase().replace(/\s+/g, '');

      this.mediaService.uploadMusic(fileName, mediaCategory, tempFilePath, mediaId);

      const resoureLink = `${this.serverUrl}/media/music?mediaCategory=${mediaCategory}&fileName=${fileName}`;

      res.send_ok('Upload music successfully', {
        mediaUrl: resoureLink
      });
    } catch (error) {
      console.log('error', error);

      return res.send_internalServerError('Upload music failed', error);
    }
  }
}
