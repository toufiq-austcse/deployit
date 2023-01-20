import { MigrationInterface, QueryRunner } from 'typeorm';
import { DEPLOYMENT_TYPE_STATUS } from '@common/utils/constants';

export class tableCreation1674217715734 implements MigrationInterface {
  name = 'tableCreation1674217715734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "environment_variables" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "deployment_id" integer NOT NULL, "key" text NOT NULL, "value" text, CONSTRAINT "PK_58b382642e67cefe198cd9f660b" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "deployment_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_4785b34767e7b779dc8752a5f50" PRIMARY KEY ("id"))`);
    await queryRunner.query(`CREATE TABLE "deployments" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "short_id" character varying NOT NULL, "deployment_type_id" integer NOT NULL, "name" character varying NOT NULL, "sub_domain_name" character varying NOT NULL, "mapped_port" character varying, "status" character varying NOT NULL, "last_deployed_at" TIMESTAMP, "repository_link" text NOT NULL, "branch_name" character varying NOT NULL, "root_dir" character varying, "docker_img_tag" character varying, "container_id" character varying, "user_id" integer NOT NULL, CONSTRAINT "UQ_dfeeaf15886d4a5cd9492546f8f" UNIQUE ("short_id"), CONSTRAINT "PK_1e5627acb3c950deb83fe98fc48" PRIMARY KEY ("id"))`);
    await queryRunner.query(`ALTER TABLE "deployments" ADD CONSTRAINT "FK_4a7b4dafb4ceeb52ea417936c49" FOREIGN KEY ("deployment_type_id") REFERENCES "deployment_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`INSERT INTO "deployment_types" (id, name, status) VALUES (1, 'web_service', '${DEPLOYMENT_TYPE_STATUS.ENABLED}')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "deployments" DROP CONSTRAINT "FK_4a7b4dafb4ceeb52ea417936c49"`);
    await queryRunner.query(`DROP TABLE "deployments"`);
    await queryRunner.query(`DROP TABLE "deployment_types"`);
    await queryRunner.query(`DROP TABLE "environment_variables"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }

}
