import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749372777028 implements MigrationInterface {
  name = 'Migrations1749372777028';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mucis" ALTER COLUMN "emotion" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mucis" ALTER COLUMN "emotion" SET NOT NULL`);
  }
}
