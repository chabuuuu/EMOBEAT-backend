import { GetImageDto } from '@/dto/get-image.dto';
import { GetMusicDto } from '@/dto/get-music.dto';
import { MediaUploadRes } from '@/dto/media-upload.res';
import { IMediaService } from '@/service/interface/i.media.service';
import BaseError from '@/utils/base.error';
import { GlobalConfig } from '@/utils/config/global-config.util';
import { convertAudio } from '@/utils/convert-audio.util';
import minioClient from '@/utils/minio-instance.util';
import { spawn } from 'child_process';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { injectable } from 'inversify';

@injectable()
export class MediaService implements IMediaService {
  private imageBucket = GlobalConfig.media_service.image_bucket.path;
  private musicBucket = GlobalConfig.media_service.music_bucket.path;
  private minioEndpoint = process.env.MINIO_ENDPOINT || '';
  private serverUrl = GlobalConfig.server.url || '';

  private getResizeArgs(width?: number, height?: number, minWidth: number = 100, minHeight: number = 100): string[] {
    const args: string[] = [];

    if (width && !height) {
      args.push('-vf', `scale=${Math.max(width, minWidth)}:-2`);
    } else if (!width && height) {
      args.push('-vf', `scale=-2:${Math.max(height, minHeight)}`);
    } else if (width && height) {
      const finalWidth = Math.max(width, minWidth);
      const finalHeight = Math.max(height, minHeight);
      args.push('-vf', `scale=${finalWidth}:${finalHeight}`);
    }

    return args;
  }

  async getImage(fileName: string, mediaCategory: string, width?: number, height?: number): Promise<GetImageDto> {
    try {
      const objectName = mediaCategory ? `${mediaCategory}/${fileName}` : fileName;

      const metadata = await minioClient.statObject(this.imageBucket, objectName);
      const contentType = metadata.metaData['content-type'] || (fileName.endsWith('.png') ? 'image/png' : 'image/jpeg');

      const isPng = contentType === 'image/png';
      const vcodec = isPng ? 'png' : 'mjpeg';

      const media = await minioClient.getObject(this.imageBucket, objectName);

      if (width || height) {
        const resizeArgs = this.getResizeArgs(width, height, 100, 100);

        const ffmpeg = spawn('ffmpeg', [
          '-i',
          'pipe:0',
          ...resizeArgs,
          '-vframes',
          '1',
          '-f',
          'image2pipe',
          '-vcodec',
          vcodec,
          'pipe:1'
        ]);

        ffmpeg.stderr.on('data', (data) => {
          console.error(`FFmpeg error: ${data}`);
        });

        ffmpeg.on('close', (code) => {
          if (code !== 0) {
            console.error(`FFmpeg exited with code ${code}`);
          }
        });

        media.pipe(ffmpeg.stdin);

        return {
          mediaStream: ffmpeg.stdout,
          contentType: contentType
        };
      }

      return {
        mediaStream: media,
        contentType: contentType
      };
    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        throw new BaseError('MEDIA_NOT_FOUND', 'Media not found');
      } else {
        throw error;
      }
    }
  }

  async uploadImage(fileName: string, tempFilePath: string, mediaCategory: string): Promise<MediaUploadRes> {
    let existsFileName;

    try {
      existsFileName = await minioClient.getObject(this.imageBucket, mediaCategory + '/' + fileName);
    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        console.log('error', error);
      } else {
        throw error;
      }
    }

    if (existsFileName) {
      throw new BaseError('FILE_EXISTS', 'File name already exists');
    }

    await minioClient.fPutObject(this.imageBucket, mediaCategory + '/' + fileName, tempFilePath);

    // Xóa file tạm sau khi upload
    fs.unlink(tempFilePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting temp file:', unlinkErr);
      }
    });

    return {
      mediaUrl: `${this.serverUrl}/media/image?mediaCategory=${mediaCategory}&fileName=${fileName}`
    };
  }
  async getMusic(fileName: string, mediaCategory: string, quality: string, rangeHeader?: string): Promise<GetMusicDto> {
    try {
      const objectName = mediaCategory ? `${mediaCategory}/${quality}/${fileName}` : `${quality}/${fileName}`;

      const metadata = await minioClient.statObject(this.musicBucket, objectName);
      const fileSize = metadata.size;

      let start = 0;
      let end = fileSize - 1;

      if (rangeHeader) {
        const matches = rangeHeader.match(/bytes=(\d*)-(\d*)/);
        if (matches) {
          if (matches[1]) start = parseInt(matches[1], 10);
          if (matches[2]) end = parseInt(matches[2], 10);
        }
        if (start > end || start >= fileSize) {
          throw new BaseError('INVALID_RANGE', 'Invalid range request');
        }
      }

      const length = end - start + 1;

      const stream = await minioClient.getPartialObject(this.musicBucket, objectName, start, length);

      return {
        mediaStream: stream,
        contentType: 'audio/mpeg',
        fileSize,
        start,
        end
      };
    } catch (error: any) {
      if (error.code === 'NoSuchKey') {
        throw new BaseError('MEDIA_NOT_FOUND', 'Music not found');
      } else {
        throw error;
      }
    }
  }

  async uploadMusic(
    fileName: string,
    mediaCategory: string,
    tempFilePath: string,
    musicId: number
  ): Promise<MediaUploadRes> {
    const bitrates = ['128', '320'];

    // Kiểm tra nếu file đã tồn tại ở bất kỳ chất lượng nào
    for (const bitrate of bitrates) {
      try {
        await minioClient.statObject(this.musicBucket, `${mediaCategory}/${bitrate}/${fileName}`);
        throw new BaseError('FILE_EXISTS', 'File name already exists');
      } catch (error: any) {
        if (error.code !== 'NoSuchKey') {
          console.log('error', error);
        } else {
          throw error;
        }
      }
    }

    // Convert sang các bitrate
    const convertedFiles = await convertAudio(tempFilePath, bitrates);

    // Upload từng phiên bản lên MinIO
    for (const bitrate of bitrates) {
      const pathToUpload = convertedFiles[bitrate];
      const objectName = `${mediaCategory}/${bitrate}/${fileName}`;
      await minioClient.fPutObject(this.musicBucket, objectName, pathToUpload);
      await fsPromises.unlink(pathToUpload); // Xoá file tạm sau khi upload
    }

    // Xoá file gốc
    await fsPromises.unlink(tempFilePath);

    return {
      mediaUrl: `${this.serverUrl}/media/music?mediaCategory=${mediaCategory}&fileName=${fileName}`
    };
  }
}
