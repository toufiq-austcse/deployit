import { MigrationInterface, QueryRunner } from "typeorm";

export class addRepositoryFullNameInDeploymentsTable1677840578843 implements MigrationInterface {
    name = 'addRepositoryFullNameInDeploymentsTable1677840578843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" DROP COLUMN "repository_full_name"`);
        await queryRunner.query(`ALTER TABLE "deployments" ADD "repository_full_name" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" DROP COLUMN "repository_full_name"`);
        await queryRunner.query(`ALTER TABLE "deployments" ADD "repository_full_name" character varying`);
    }

}
