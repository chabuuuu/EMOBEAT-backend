import { Admin } from '@/models/admin.model';
import { Album } from '@/models/album.model';
import { Artist } from '@/models/artist.model';
import { ArtistFollower } from '@/models/artist_follower.model';
import { ArtistStudent } from '@/models/artist_student.model';
import { BaseModel } from '@/models/base/base.model';
import { Category } from '@/models/category.model';
import { FavoriteList } from '@/models/favorite_list.model';
import { Genre } from '@/models/genre.model';
import { Instrument } from '@/models/instrument.model';
import { Listener } from '@/models/listener.model';
import { ListenerAlbumLike } from '@/models/listener_album_like.model';
import { ListenerMusicRecommendScore } from '@/models/listener_music_recommend_score.model';
import { Music } from '@/models/music.model';
import { Orchestra } from '@/models/orchestra.model';
import { Period } from '@/models/period.model';
import { AlbumSubscriber } from '@/models/subcribers/album.subcriber';
import { ArtistSubscriber } from '@/models/subcribers/artist.subcriber';
import { CategorySubscriber } from '@/models/subcribers/category.subcriber';
import { MusicSubscriber } from '@/models/subcribers/music.subcriber';
import { GlobalConfig } from '@/utils/config/global-config.util';
import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const MODELS = [
  Admin,
  Album,
  Artist,
  ArtistStudent,
  Category,
  FavoriteList,
  Genre,
  Instrument,
  Listener,
  Music,
  Orchestra,
  Period,
  BaseModel,
  ListenerAlbumLike,
  ArtistFollower,
  ListenerMusicRecommendScore
];

export class AppDataSourceSingleton {
  private static instance: DataSource;

  private constructor() {}

  public static getInstance(): DataSource {
    if (!AppDataSourceSingleton.instance) {
      AppDataSourceSingleton.instance = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'test',
        entities: MODELS,
        synchronize: GlobalConfig.database.sync,
        logging: true,
        migrations: [__dirname + '/migrations/*.js'],
        subscribers: [AlbumSubscriber, ArtistSubscriber, CategorySubscriber, MusicSubscriber]
      });
    }
    return AppDataSourceSingleton.instance;
  }
}

export const AppDataSource = AppDataSourceSingleton.getInstance();
