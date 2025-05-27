import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1748331142235 implements MigrationInterface {
  name = 'Migrations1748331142235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admins" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "name" character varying(30) NOT NULL, "picture" text, "username" character varying(70) NOT NULL, "password" character varying(100), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "artist_students" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "teacher_id" integer NOT NULL, "student_id" integer NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_4feb96abe171130deeccf002777" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_63db99026cc8b0773842cb94c5" ON "artist_students" ("teacher_id", "student_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "name" character varying(50) NOT NULL, "picture" text, "description" text, "viewCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "periods" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "picture" text NOT NULL, CONSTRAINT "PK_86c6afb6c818d97dc321898627c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "mucis" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "slug" text, "description" text, "lyric" text, "nationality" character varying(50), "cover_photo" text, "resource_link" character varying NOT NULL, "releaseYear" integer NOT NULL, "listenCount" integer NOT NULL DEFAULT '0', "favoriteCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_7d02a66c4aef1223d1791958806" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "instruments" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "description" text, "picture" text, CONSTRAINT "PK_44d772c3199b38559c5fb666eb6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "orchestras" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "name" character varying(50) NOT NULL, "picture" text, "description" text, CONSTRAINT "PK_619fccdb658bd09ef5b0ee4791d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "artists" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(30) NOT NULL, "description" text, "picture" text, "awards_and_honors" text, "nationality" character varying(50), "teaching_and_academic_contributions" character varying(150), "significant_performences" text, "roles" text array, "date_of_birth" date, "date_of_death" date, "viewCount" integer NOT NULL DEFAULT '0', "followers" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_09b823d4607d2675dc4ffa82261" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "genres" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "picture" text, CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "albums" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "name" character varying(50) NOT NULL, "cover_photo" text, "release_date" TIMESTAMP NOT NULL, "album_type" character varying(50), "description" text, "viewCount" integer NOT NULL DEFAULT '0', "likeCount" integer NOT NULL DEFAULT '0', "created_by" bigint, CONSTRAINT "PK_838ebae24d2e12082670ffc95d7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "favorite_lists" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" SERIAL NOT NULL, "listener_id" bigint NOT NULL, "music_id" integer NOT NULL, CONSTRAINT "PK_33aad4fbe9873b39ff1e2d0e0b1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "listener_album_likes" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "album_id" bigint NOT NULL, "listener_id" bigint NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_5060426713c10c2b2a004400c40" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2356a7dc4a2cfd573828dbf39f" ON "listener_album_likes" ("album_id", "listener_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "listeners" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "email" character varying(100) NOT NULL, "username" character varying(70) NOT NULL, "password" character varying(100) NOT NULL, "fullname" character varying(50) NOT NULL, "gender" character varying(10), "nationality" character varying(50), "points" integer NOT NULL DEFAULT '0', "premium_expired_at" TIMESTAMP, CONSTRAINT "UQ_9617f7d073f8607aaeec4cecf91" UNIQUE ("email"), CONSTRAINT "PK_f49128afeccb8d02c75d9245a0e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "artist_followers" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "artist_id" integer NOT NULL, "listener_id" bigint NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_9f767fb623655b02de6724fc8a1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_9391c4ded2e90a8a3cd98982be" ON "artist_followers" ("artist_id", "listener_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "listener_music_recommend_score" ("create_at" TIMESTAMP NOT NULL DEFAULT now(), "update_at" TIMESTAMP NOT NULL DEFAULT now(), "delete_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "listener_id" bigint NOT NULL, "music_id" integer NOT NULL, "score" double precision NOT NULL DEFAULT '0', CONSTRAINT "PK_2ff63ec0363010240cd0879e830" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "music_albums" ("music_id" integer NOT NULL, "album_id" bigint NOT NULL, CONSTRAINT "PK_83613b3bf004c99f5d8e0341c9d" PRIMARY KEY ("music_id", "album_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_22bb85f6aec67b0d8c15492f94" ON "music_albums" ("music_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_23c00f664130ed8fb25fbc6928" ON "music_albums" ("album_id") `);
    await queryRunner.query(
      `CREATE TABLE "music_genres" ("music_id" integer NOT NULL, "genre_id" integer NOT NULL, CONSTRAINT "PK_26dd64ccf43d968ce3853b7e509" PRIMARY KEY ("music_id", "genre_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_55b44675758fbae9a439842c04" ON "music_genres" ("music_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_ed0bd4ab9f32a8d7b1a43468a9" ON "music_genres" ("genre_id") `);
    await queryRunner.query(
      `CREATE TABLE "music_instruments" ("music_id" integer NOT NULL, "instrument_id" integer NOT NULL, CONSTRAINT "PK_154f9cf0fd641dcec0d42879194" PRIMARY KEY ("music_id", "instrument_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_8b9bb7eb4b2819acb48283a052" ON "music_instruments" ("music_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_9283369ad97aa9ace910809ca6" ON "music_instruments" ("instrument_id") `);
    await queryRunner.query(
      `CREATE TABLE "music_periods" ("music_id" integer NOT NULL, "period_id" integer NOT NULL, CONSTRAINT "PK_c36800c43f0a3c9e16ecb65f6cc" PRIMARY KEY ("music_id", "period_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_95607a494e5181b866c707a9b4" ON "music_periods" ("music_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_8eba2729741efc10871ec2f4a4" ON "music_periods" ("period_id") `);
    await queryRunner.query(
      `CREATE TABLE "music_categories" ("music_id" integer NOT NULL, "category_id" bigint NOT NULL, CONSTRAINT "PK_d0e0b654229da54b46e3b847584" PRIMARY KEY ("music_id", "category_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_747a76443490d7f50752f9a99d" ON "music_categories" ("music_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_7720916ae1a7bdf1f4714acd19" ON "music_categories" ("category_id") `);
    await queryRunner.query(
      `CREATE TABLE "music_composers" ("music_id" integer NOT NULL, "artist_id" integer NOT NULL, CONSTRAINT "PK_4334a5248f5b29a0c037aa7b5eb" PRIMARY KEY ("music_id", "artist_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_ee75b919278f516344f18ec6ae" ON "music_composers" ("music_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_33da87e208bdfb2b27fdc09006" ON "music_composers" ("artist_id") `);
    await queryRunner.query(
      `CREATE TABLE "music_artists" ("artist_id" integer NOT NULL, "music_id" integer NOT NULL, CONSTRAINT "PK_3b1001868d58e33b5b455e09b35" PRIMARY KEY ("artist_id", "music_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_d2cc0829a3077f507e2d057fec" ON "music_artists" ("artist_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_1a615738e750adbc9004472b7f" ON "music_artists" ("music_id") `);
    await queryRunner.query(
      `CREATE TABLE "artist_periods" ("artist_id" integer NOT NULL, "period_id" integer NOT NULL, CONSTRAINT "PK_0f6cd1b8c0de369befca1e973e7" PRIMARY KEY ("artist_id", "period_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_f855dd26f6eb63f9245605984e" ON "artist_periods" ("artist_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_58895dd20617105601e57517c5" ON "artist_periods" ("period_id") `);
    await queryRunner.query(
      `CREATE TABLE "orchestra_artists" ("artist_id" integer NOT NULL, "orchestra_id" bigint NOT NULL, CONSTRAINT "PK_799285747c50f4df56be1ca93d4" PRIMARY KEY ("artist_id", "orchestra_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_d08b802246f82365c0dbfd502a" ON "orchestra_artists" ("artist_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_175b582a5d7a4d6f013788e633" ON "orchestra_artists" ("orchestra_id") `);
    await queryRunner.query(
      `CREATE TABLE "genre_artists" ("artist_id" integer NOT NULL, "genre_id" integer NOT NULL, CONSTRAINT "PK_1ff5b88c70a4db601b74b9bdc0c" PRIMARY KEY ("artist_id", "genre_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_73ede931a4669991c4a81c0082" ON "genre_artists" ("artist_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_dd0f3c3faee65ae14a63e9e454" ON "genre_artists" ("genre_id") `);
    await queryRunner.query(
      `CREATE TABLE "instrument_artists" ("artist_id" integer NOT NULL, "instrument_id" integer NOT NULL, CONSTRAINT "PK_c56cc77516dc071db5c223f0adc" PRIMARY KEY ("artist_id", "instrument_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_390af0fb81077a0aaed492ca5d" ON "instrument_artists" ("artist_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_3f5fc1aba857a7b09e43975844" ON "instrument_artists" ("instrument_id") `);
    await queryRunner.query(
      `CREATE TABLE "album_genres" ("album_id" bigint NOT NULL, "genre_id" integer NOT NULL, CONSTRAINT "PK_ddd2a5846e5ffd21d333966d045" PRIMARY KEY ("album_id", "genre_id"))`
    );
    await queryRunner.query(`CREATE INDEX "IDX_4082b00f72bab6f0a580b3c3b9" ON "album_genres" ("album_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_a145db8221e96da0270465e648" ON "album_genres" ("genre_id") `);
    await queryRunner.query(
      `ALTER TABLE "artist_students" ADD CONSTRAINT "FK_3c2ab038bf150e133e630ee1408" FOREIGN KEY ("student_id") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "artist_students" ADD CONSTRAINT "FK_4efb0085450ff892dce1c914bda" FOREIGN KEY ("teacher_id") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "albums" ADD CONSTRAINT "FK_295ee1f3412e65c9f79cfeb057c" FOREIGN KEY ("created_by") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_lists" ADD CONSTRAINT "FK_c7257563ca773aa6cb637b12863" FOREIGN KEY ("listener_id") REFERENCES "listeners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_lists" ADD CONSTRAINT "FK_3c891a7660ea5a9112cf6cd434f" FOREIGN KEY ("music_id") REFERENCES "mucis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "listener_album_likes" ADD CONSTRAINT "FK_b067d73fe0d058f4e3524fab1d1" FOREIGN KEY ("listener_id") REFERENCES "listeners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "listener_album_likes" ADD CONSTRAINT "FK_d0b4e8ec320d79af76839ea277b" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "artist_followers" ADD CONSTRAINT "FK_2284889f3a1b0b9b3305955e94a" FOREIGN KEY ("listener_id") REFERENCES "listeners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "artist_followers" ADD CONSTRAINT "FK_5193496055adf1876bd868a60ce" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "listener_music_recommend_score" ADD CONSTRAINT "FK_68206d359b7ea4ff4b762ddbff2" FOREIGN KEY ("listener_id") REFERENCES "listeners"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "listener_music_recommend_score" ADD CONSTRAINT "FK_9dba2291e10bd2e2fcbe1ec5eb0" FOREIGN KEY ("music_id") REFERENCES "mucis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "music_albums" ADD CONSTRAINT "FK_22bb85f6aec67b0d8c15492f942" FOREIGN KEY ("music_id") REFERENCES "mucis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "music_albums" ADD CONSTRAINT "FK_23c00f664130ed8fb25fbc69283" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "music_genres" ADD CONSTRAINT "FK_55b44675758fbae9a439842c049" FOREIGN KEY ("music_id") REFERENCES "mucis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "music_genres" ADD CONSTRAINT "FK_ed0bd4ab9f32a8d7b1a43468a9d" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "music_instruments" ADD CONSTRAINT "FK_8b9bb7eb4b2819acb48283a0526" FOREIGN KEY ("music_id") REFERENCES "mucis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "music_instruments" ADD CONSTRAINT "FK_9283369ad97aa9ace910809ca6c" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "music_periods" ADD CONSTRAINT "FK_95607a494e5181b866c707a9b49" FOREIGN KEY ("music_id") REFERENCES "mucis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "music_periods" ADD CONSTRAINT "FK_8eba2729741efc10871ec2f4a43" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "music_categories" ADD CONSTRAINT "FK_747a76443490d7f50752f9a99d3" FOREIGN KEY ("music_id") REFERENCES "mucis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "music_categories" ADD CONSTRAINT "FK_7720916ae1a7bdf1f4714acd19f" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "music_composers" ADD CONSTRAINT "FK_ee75b919278f516344f18ec6aef" FOREIGN KEY ("music_id") REFERENCES "mucis"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "music_composers" ADD CONSTRAINT "FK_33da87e208bdfb2b27fdc090062" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "music_artists" ADD CONSTRAINT "FK_d2cc0829a3077f507e2d057fec7" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "music_artists" ADD CONSTRAINT "FK_1a615738e750adbc9004472b7f3" FOREIGN KEY ("music_id") REFERENCES "mucis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "artist_periods" ADD CONSTRAINT "FK_f855dd26f6eb63f9245605984ed" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "artist_periods" ADD CONSTRAINT "FK_58895dd20617105601e57517c57" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "orchestra_artists" ADD CONSTRAINT "FK_d08b802246f82365c0dbfd502a4" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "orchestra_artists" ADD CONSTRAINT "FK_175b582a5d7a4d6f013788e633b" FOREIGN KEY ("orchestra_id") REFERENCES "orchestras"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "genre_artists" ADD CONSTRAINT "FK_73ede931a4669991c4a81c0082b" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "genre_artists" ADD CONSTRAINT "FK_dd0f3c3faee65ae14a63e9e4549" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "instrument_artists" ADD CONSTRAINT "FK_390af0fb81077a0aaed492ca5d8" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "instrument_artists" ADD CONSTRAINT "FK_3f5fc1aba857a7b09e439758442" FOREIGN KEY ("instrument_id") REFERENCES "instruments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "album_genres" ADD CONSTRAINT "FK_4082b00f72bab6f0a580b3c3b9f" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "album_genres" ADD CONSTRAINT "FK_a145db8221e96da0270465e6482" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "album_genres" DROP CONSTRAINT "FK_a145db8221e96da0270465e6482"`);
    await queryRunner.query(`ALTER TABLE "album_genres" DROP CONSTRAINT "FK_4082b00f72bab6f0a580b3c3b9f"`);
    await queryRunner.query(`ALTER TABLE "instrument_artists" DROP CONSTRAINT "FK_3f5fc1aba857a7b09e439758442"`);
    await queryRunner.query(`ALTER TABLE "instrument_artists" DROP CONSTRAINT "FK_390af0fb81077a0aaed492ca5d8"`);
    await queryRunner.query(`ALTER TABLE "genre_artists" DROP CONSTRAINT "FK_dd0f3c3faee65ae14a63e9e4549"`);
    await queryRunner.query(`ALTER TABLE "genre_artists" DROP CONSTRAINT "FK_73ede931a4669991c4a81c0082b"`);
    await queryRunner.query(`ALTER TABLE "orchestra_artists" DROP CONSTRAINT "FK_175b582a5d7a4d6f013788e633b"`);
    await queryRunner.query(`ALTER TABLE "orchestra_artists" DROP CONSTRAINT "FK_d08b802246f82365c0dbfd502a4"`);
    await queryRunner.query(`ALTER TABLE "artist_periods" DROP CONSTRAINT "FK_58895dd20617105601e57517c57"`);
    await queryRunner.query(`ALTER TABLE "artist_periods" DROP CONSTRAINT "FK_f855dd26f6eb63f9245605984ed"`);
    await queryRunner.query(`ALTER TABLE "music_artists" DROP CONSTRAINT "FK_1a615738e750adbc9004472b7f3"`);
    await queryRunner.query(`ALTER TABLE "music_artists" DROP CONSTRAINT "FK_d2cc0829a3077f507e2d057fec7"`);
    await queryRunner.query(`ALTER TABLE "music_composers" DROP CONSTRAINT "FK_33da87e208bdfb2b27fdc090062"`);
    await queryRunner.query(`ALTER TABLE "music_composers" DROP CONSTRAINT "FK_ee75b919278f516344f18ec6aef"`);
    await queryRunner.query(`ALTER TABLE "music_categories" DROP CONSTRAINT "FK_7720916ae1a7bdf1f4714acd19f"`);
    await queryRunner.query(`ALTER TABLE "music_categories" DROP CONSTRAINT "FK_747a76443490d7f50752f9a99d3"`);
    await queryRunner.query(`ALTER TABLE "music_periods" DROP CONSTRAINT "FK_8eba2729741efc10871ec2f4a43"`);
    await queryRunner.query(`ALTER TABLE "music_periods" DROP CONSTRAINT "FK_95607a494e5181b866c707a9b49"`);
    await queryRunner.query(`ALTER TABLE "music_instruments" DROP CONSTRAINT "FK_9283369ad97aa9ace910809ca6c"`);
    await queryRunner.query(`ALTER TABLE "music_instruments" DROP CONSTRAINT "FK_8b9bb7eb4b2819acb48283a0526"`);
    await queryRunner.query(`ALTER TABLE "music_genres" DROP CONSTRAINT "FK_ed0bd4ab9f32a8d7b1a43468a9d"`);
    await queryRunner.query(`ALTER TABLE "music_genres" DROP CONSTRAINT "FK_55b44675758fbae9a439842c049"`);
    await queryRunner.query(`ALTER TABLE "music_albums" DROP CONSTRAINT "FK_23c00f664130ed8fb25fbc69283"`);
    await queryRunner.query(`ALTER TABLE "music_albums" DROP CONSTRAINT "FK_22bb85f6aec67b0d8c15492f942"`);
    await queryRunner.query(
      `ALTER TABLE "listener_music_recommend_score" DROP CONSTRAINT "FK_9dba2291e10bd2e2fcbe1ec5eb0"`
    );
    await queryRunner.query(
      `ALTER TABLE "listener_music_recommend_score" DROP CONSTRAINT "FK_68206d359b7ea4ff4b762ddbff2"`
    );
    await queryRunner.query(`ALTER TABLE "artist_followers" DROP CONSTRAINT "FK_5193496055adf1876bd868a60ce"`);
    await queryRunner.query(`ALTER TABLE "artist_followers" DROP CONSTRAINT "FK_2284889f3a1b0b9b3305955e94a"`);
    await queryRunner.query(`ALTER TABLE "listener_album_likes" DROP CONSTRAINT "FK_d0b4e8ec320d79af76839ea277b"`);
    await queryRunner.query(`ALTER TABLE "listener_album_likes" DROP CONSTRAINT "FK_b067d73fe0d058f4e3524fab1d1"`);
    await queryRunner.query(`ALTER TABLE "favorite_lists" DROP CONSTRAINT "FK_3c891a7660ea5a9112cf6cd434f"`);
    await queryRunner.query(`ALTER TABLE "favorite_lists" DROP CONSTRAINT "FK_c7257563ca773aa6cb637b12863"`);
    await queryRunner.query(`ALTER TABLE "albums" DROP CONSTRAINT "FK_295ee1f3412e65c9f79cfeb057c"`);
    await queryRunner.query(`ALTER TABLE "artist_students" DROP CONSTRAINT "FK_4efb0085450ff892dce1c914bda"`);
    await queryRunner.query(`ALTER TABLE "artist_students" DROP CONSTRAINT "FK_3c2ab038bf150e133e630ee1408"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a145db8221e96da0270465e648"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_4082b00f72bab6f0a580b3c3b9"`);
    await queryRunner.query(`DROP TABLE "album_genres"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3f5fc1aba857a7b09e43975844"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_390af0fb81077a0aaed492ca5d"`);
    await queryRunner.query(`DROP TABLE "instrument_artists"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dd0f3c3faee65ae14a63e9e454"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_73ede931a4669991c4a81c0082"`);
    await queryRunner.query(`DROP TABLE "genre_artists"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_175b582a5d7a4d6f013788e633"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d08b802246f82365c0dbfd502a"`);
    await queryRunner.query(`DROP TABLE "orchestra_artists"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_58895dd20617105601e57517c5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_f855dd26f6eb63f9245605984e"`);
    await queryRunner.query(`DROP TABLE "artist_periods"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1a615738e750adbc9004472b7f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d2cc0829a3077f507e2d057fec"`);
    await queryRunner.query(`DROP TABLE "music_artists"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_33da87e208bdfb2b27fdc09006"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ee75b919278f516344f18ec6ae"`);
    await queryRunner.query(`DROP TABLE "music_composers"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7720916ae1a7bdf1f4714acd19"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_747a76443490d7f50752f9a99d"`);
    await queryRunner.query(`DROP TABLE "music_categories"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8eba2729741efc10871ec2f4a4"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_95607a494e5181b866c707a9b4"`);
    await queryRunner.query(`DROP TABLE "music_periods"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9283369ad97aa9ace910809ca6"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8b9bb7eb4b2819acb48283a052"`);
    await queryRunner.query(`DROP TABLE "music_instruments"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ed0bd4ab9f32a8d7b1a43468a9"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_55b44675758fbae9a439842c04"`);
    await queryRunner.query(`DROP TABLE "music_genres"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_23c00f664130ed8fb25fbc6928"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_22bb85f6aec67b0d8c15492f94"`);
    await queryRunner.query(`DROP TABLE "music_albums"`);
    await queryRunner.query(`DROP TABLE "listener_music_recommend_score"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_9391c4ded2e90a8a3cd98982be"`);
    await queryRunner.query(`DROP TABLE "artist_followers"`);
    await queryRunner.query(`DROP TABLE "listeners"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2356a7dc4a2cfd573828dbf39f"`);
    await queryRunner.query(`DROP TABLE "listener_album_likes"`);
    await queryRunner.query(`DROP TABLE "favorite_lists"`);
    await queryRunner.query(`DROP TABLE "albums"`);
    await queryRunner.query(`DROP TABLE "genres"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "orchestras"`);
    await queryRunner.query(`DROP TABLE "instruments"`);
    await queryRunner.query(`DROP TABLE "mucis"`);
    await queryRunner.query(`DROP TABLE "periods"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_63db99026cc8b0773842cb94c5"`);
    await queryRunner.query(`DROP TABLE "artist_students"`);
    await queryRunner.query(`DROP TABLE "admins"`);
  }
}
