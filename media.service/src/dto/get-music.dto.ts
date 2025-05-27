import { Readable } from 'stream';

export class GetMusicDto {
  contentType!: string;
  mediaStream!: Readable;
  fileSize!: number;
  start!: number;
  end!: number;
}
