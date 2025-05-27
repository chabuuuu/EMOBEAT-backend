export interface ITrackingService {
  trackMusicPlayed(musicId: number, listenerId: number): Promise<void>;
}
