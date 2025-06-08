import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749353548820 implements MigrationInterface {
  name = 'Migrations1749353548820';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "emotion_collects" RENAME COLUMN "muisc_id" TO "music_id"`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5308f7d00be7f31ad18275d28c" ON "emotion_collects" ("user_id", "emotion", "music_id") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_5308f7d00be7f31ad18275d28c"`);
    await queryRunner.query(`ALTER TABLE "emotion_collects" RENAME COLUMN "music_id" TO "muisc_id"`);
  }
}
