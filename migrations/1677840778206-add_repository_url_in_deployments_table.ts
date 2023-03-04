import { MigrationInterface, QueryRunner } from "typeorm";

export class addRepositoryUrlInDeploymentsTable1677840778206 implements MigrationInterface {
    name = 'addRepositoryUrlInDeploymentsTable1677840778206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" RENAME COLUMN "repository_link" TO "repository_url"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" RENAME COLUMN "repository_url" TO "repository_link"`);
    }

}
