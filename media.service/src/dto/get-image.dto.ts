import { Readable } from 'stream';

export class GetImageDto {
  contentType!: string;
  mediaStream!: Readable;
}
