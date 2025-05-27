import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function convertAudio(inputPath: string, bitrates: string[]): Promise<Record<string, string>> {
  const outputPaths: Record<string, string> = {};

  for (const bitrate of bitrates) {
    const outputFilePath = path.join('/tmp', `${uuidv4()}_${bitrate}.mp3`);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .audioBitrate(bitrate)
        .format('mp3')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputFilePath);
    });

    outputPaths[bitrate] = outputFilePath;
  }

  return outputPaths;
}
