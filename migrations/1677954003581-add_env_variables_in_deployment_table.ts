import { MigrationInterface, QueryRunner } from "typeorm";

export class addEnvVariablesInDeploymentTable1677954003581 implements MigrationInterface {
    name = 'addEnvVariablesInDeploymentTable1677954003581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" ADD "environment_variables" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" DROP COLUMN "environment_variables"`);
    }

}
