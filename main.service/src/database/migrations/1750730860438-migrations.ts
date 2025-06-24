import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1750730860438 implements MigrationInterface {
  name = 'Migrations1750730860438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_settings" ("id" SERIAL NOT NULL, "is_allow_recommend" boolean NOT NULL DEFAULT true, "recommend_interval" integer NOT NULL DEFAULT '10', "detect_interval" integer NOT NULL DEFAULT '10', "listener_id" bigint, CONSTRAINT "REL_347093fc0f9f8d97e2b2b40b85" UNIQUE ("listener_id"), CONSTRAINT "PK_00f004f5922a0744d174530d639" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_settings" ADD CONSTRAINT "FK_347093fc0f9f8d97e2b2b40b859" FOREIGN KEY ("listener_id") REFERENCES "listeners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_settings" DROP CONSTRAINT "FK_347093fc0f9f8d97e2b2b40b859"`);
    await queryRunner.query(`DROP TABLE "user_settings"`);
  }
}
