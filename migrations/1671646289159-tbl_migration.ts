import { MigrationInterface, QueryRunner } from "typeorm";

export class tblMigration1671646289159 implements MigrationInterface {
    name = 'tblMigration1671646289159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" DROP COLUMN "deployment_type_id"`);
        await queryRunner.query(`ALTER TABLE "deployments" ADD "deployment_type_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deployments" ADD CONSTRAINT "FK_4a7b4dafb4ceeb52ea417936c49" FOREIGN KEY ("deployment_type_id") REFERENCES "deployment_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" DROP CONSTRAINT "FK_4a7b4dafb4ceeb52ea417936c49"`);
        await queryRunner.query(`ALTER TABLE "deployments" DROP COLUMN "deployment_type_id"`);
        await queryRunner.query(`ALTER TABLE "deployments" ADD "deployment_type_id" character varying NOT NULL`);
    }

}
