export interface ITrackingService {
  trackMusicPlayed(mediaId: string, listenerId: number): Promise<void>;
}
