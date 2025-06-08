import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749353171484 implements MigrationInterface {
  name = 'Migrations1749353171484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "emotion_collects" ("id" BIGSERIAL NOT NULL, "user_id" bigint NOT NULL, "muisc_id" bigint NOT NULL, "emotion" integer NOT NULL, CONSTRAINT "PK_fcb0846b2eac7c71bc3e53922cc" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "emotion_collects"`);
  }
}
