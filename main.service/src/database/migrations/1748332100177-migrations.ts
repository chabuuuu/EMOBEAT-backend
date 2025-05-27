import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1748332100177 implements MigrationInterface {
  name = 'Migrations1748332100177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listeners" DROP COLUMN "points"`);
    await queryRunner.query(`ALTER TABLE "listeners" DROP COLUMN "premium_expired_at"`);
    await queryRunner.query(`ALTER TABLE "listeners" ADD "birthdate" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "listeners" ALTER COLUMN "nationality" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "listeners" ALTER COLUMN "nationality" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "listeners" DROP COLUMN "birthdate"`);
    await queryRunner.query(`ALTER TABLE "listeners" ADD "premium_expired_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "listeners" ADD "points" integer NOT NULL DEFAULT '0'`);
  }
}
