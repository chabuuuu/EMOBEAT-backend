import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749353449053 implements MigrationInterface {
  name = 'Migrations1749353449053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "emotion_collects" ADD "score" bigint NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "emotion_collects" DROP COLUMN "score"`);
  }
}
