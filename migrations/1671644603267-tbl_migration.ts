import { MigrationInterface, QueryRunner } from "typeorm";

export class tblMigration1671644603267 implements MigrationInterface {
    name = 'tblMigration1671644603267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" DROP COLUMN "server_dir_name"`);
        await queryRunner.query(`ALTER TABLE "deployments" ADD "short_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deployments" ADD CONSTRAINT "UQ_dfeeaf15886d4a5cd9492546f8f" UNIQUE ("short_id")`);
        await queryRunner.query(`ALTER TABLE "deployments" ALTER COLUMN "root_dir" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" ALTER COLUMN "root_dir" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deployments" DROP CONSTRAINT "UQ_dfeeaf15886d4a5cd9492546f8f"`);
        await queryRunner.query(`ALTER TABLE "deployments" DROP COLUMN "short_id"`);
        await queryRunner.query(`ALTER TABLE "deployments" ADD "server_dir_name" character varying NOT NULL`);
    }

}
