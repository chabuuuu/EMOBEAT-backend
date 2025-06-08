import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1749368480246 implements MigrationInterface {
  name = 'Migrations1749368480246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mucis" ALTER COLUMN "releaseYear" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mucis" ALTER COLUMN "releaseYear" SET NOT NULL`);
  }
}
