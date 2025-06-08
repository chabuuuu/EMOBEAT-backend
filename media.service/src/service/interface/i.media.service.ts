import { GetImageDto } from '@/dto/get-image.dto';
import { GetMusicDto } from '@/dto/get-music.dto';
import { MediaUploadRes } from '@/dto/media-upload.res';

export interface IMediaService {
  getImage(fileName: string, mediaCategory: string, width?: number, height?: number): Promise<GetImageDto>;

  uploadImage(fileName: string, mediaCategory: string, tempFilePath: string): Promise<MediaUploadRes>;

  getMusic(fileName: string, mediaCategory: string, quality: string, rangeHeader?: string): Promise<GetMusicDto>;

  uploadMusic(fileName: string, mediaCategory: string, tempFilePath: string, mediaId: string): Promise<void>;

  getMediaId(): Promise<string>;

  checkIsPremiumUser(listenerId: number): Promise<boolean>;

  checkCanListenToQuality(listenerId: number, quality: string): Promise<boolean>;
}
