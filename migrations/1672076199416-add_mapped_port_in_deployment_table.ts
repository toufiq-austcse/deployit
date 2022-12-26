import { MigrationInterface, QueryRunner } from "typeorm";

export class addMappedPortInDeploymentTable1672076199416 implements MigrationInterface {
    name = 'addMappedPortInDeploymentTable1672076199416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" ADD "mapped_port" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" DROP COLUMN "mapped_port"`);
    }

}
