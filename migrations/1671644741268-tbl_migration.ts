import { MigrationInterface, QueryRunner } from "typeorm";

export class tblMigration1671644741268 implements MigrationInterface {
    name = 'tblMigration1671644741268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" ALTER COLUMN "docker_img_tag" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deployments" ALTER COLUMN "docker_img_tag" SET NOT NULL`);
    }

}
