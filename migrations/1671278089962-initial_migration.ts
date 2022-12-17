import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1671278089962 implements MigrationInterface {
    name = 'initialMigration1671278089962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deployments" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "deployment_type_id" character varying NOT NULL, "name" character varying NOT NULL, "sub_domain_name" character varying NOT NULL, "status" character varying NOT NULL, "last_deployed_at" TIMESTAMP, "repository_link" text NOT NULL, "branch_name" character varying NOT NULL, "server_dir_name" character varying NOT NULL, "root_dir" character varying NOT NULL, "docker_img_tag" character varying NOT NULL, "container_id" character varying, "user_id" integer NOT NULL, CONSTRAINT "PK_1e5627acb3c950deb83fe98fc48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deployment_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_4785b34767e7b779dc8752a5f50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "environment_variables" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "deployment_id" integer NOT NULL, "key" text NOT NULL, "value" text, CONSTRAINT "PK_58b382642e67cefe198cd9f660b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "environment_variables"`);
        await queryRunner.query(`DROP TABLE "deployment_types"`);
        await queryRunner.query(`DROP TABLE "deployments"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
