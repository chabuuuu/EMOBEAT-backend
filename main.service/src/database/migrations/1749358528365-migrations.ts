import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749358528365 implements MigrationInterface {
  name = 'Migrations1749358528365';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mucis" ADD "emotion" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mucis" DROP COLUMN "emotion"`);
  }
}
