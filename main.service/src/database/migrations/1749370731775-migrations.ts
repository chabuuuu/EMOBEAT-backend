import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749370731775 implements MigrationInterface {
  name = 'Migrations1749370731775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mucis" ADD "media_id" character varying(250)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mucis" DROP COLUMN "media_id"`);
  }
}
