import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOAuthTables1684341449579 implements MigrationInterface {
  name = 'AddOAuthTables1684341449579'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE TABLE "oauth_scope" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fe4b56b2ef2e948cceea2a7c73d" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_a8abd735dde6150c60edc06304" ON "oauth_scope" ("name")
    `)
    await queryRunner.query(/* sql */ `
      CREATE TABLE "oauth_client" (
        "id" uuid NOT NULL,
        "secret" character varying(128),
        "name" character varying NOT NULL,
        "redirect_uris" text array NOT NULL,
        "allowed_grants" text array NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_d6e58a7e0ec3ac17a67ba7f97cd" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(/* sql */ `
      CREATE TABLE "oauth_user" (
        "id" SERIAL NOT NULL,
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "hashed_password" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_e1e362edda08183b5c03266cab3" UNIQUE ("email"),
        CONSTRAINT "PK_c1e31b84cedaa9135fd13ca1620" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(/* sql */ `
      CREATE TABLE "oauth_code" (
        "code" character varying(128) NOT NULL,
        "user_id" integer,
        "client_id" uuid NOT NULL,
        "redirect_uri" character varying,
        "code_challenge" character varying(128),
        "code_challenge_method" character varying(128),
        "expires_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        "clientId" uuid,
        CONSTRAINT "PK_58e8d2b562e9ecc218175be609d" PRIMARY KEY ("code")
      )
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_77ed210f793c410e1cad80d3c2" ON "oauth_code" ("user_id")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_3528ecec0459a0f8ca3d2eb317" ON "oauth_code" ("client_id")
    `)
    await queryRunner.query(/* sql */ `
      CREATE TABLE "oauth_token" (
        "access_token" character varying(128) NOT NULL,
        "access_token_expires_at" TIMESTAMP NOT NULL,
        "refresh_token" character varying(128),
        "refresh_token_expires_at" TIMESTAMP,
        "client_id" uuid NOT NULL,
        "user_id" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "clientId" uuid,
        "userId" integer,
        CONSTRAINT "PK_eff4c35110e50405b1ccb65da73" PRIMARY KEY ("access_token")
      )
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_968845a7f037d8f348ffe389ba" ON "oauth_token" ("refresh_token")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_ac1833c18d87bf44ea57bce1da" ON "oauth_token" ("client_id")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_c910052e5b11436554a18fa690" ON "oauth_token" ("user_id")
    `)
    await queryRunner.query(/* sql */ `
      CREATE TABLE "oauth_client_scopes" (
        "clientId" uuid NOT NULL,
        "scopeId" integer NOT NULL,
        CONSTRAINT "PK_4418822562d4ad6e14804390f1f" PRIMARY KEY ("clientId", "scopeId")
      )
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_95bf597cdb3cf7df1907a49e93" ON "oauth_client_scopes" ("clientId")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_b94f84e99819eb0effb8473c54" ON "oauth_client_scopes" ("scopeId")
    `)
    await queryRunner.query(/* sql */ `
      CREATE TABLE "oauth_code_scopes" (
        "authCode" character varying(128) NOT NULL,
        "scopeId" integer NOT NULL,
        CONSTRAINT "PK_6c292ef3f057245cd72c941f5cc" PRIMARY KEY ("authCode", "scopeId")
      )
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_4769112b73f7ce929429a8575c" ON "oauth_code_scopes" ("authCode")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_1d002fc3fd0230d8f8e454fe75" ON "oauth_code_scopes" ("scopeId")
    `)
    await queryRunner.query(/* sql */ `
      CREATE TABLE "oauth_token_scopes" (
        "accessToken" character varying(128) NOT NULL,
        "scopeId" integer NOT NULL,
        CONSTRAINT "PK_04e1bdde6864390fec94fd05958" PRIMARY KEY ("accessToken", "scopeId")
      )
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_bf36d38c72e3616d894a590f81" ON "oauth_token_scopes" ("accessToken")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_339cf46d38a9a44c888f481a1d" ON "oauth_token_scopes" ("scopeId")
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD CONSTRAINT "FK_0625a578e020984428e3eed6ab3" FOREIGN KEY ("userId")
          REFERENCES "oauth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD CONSTRAINT "FK_5a42f2ad821febfd4ccdd57245e" FOREIGN KEY ("clientId")
          REFERENCES "oauth_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD CONSTRAINT "FK_73807359f788686077f5fd92de4" FOREIGN KEY ("clientId")
          REFERENCES "oauth_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD CONSTRAINT "FK_f6b4b1ac66b753feab5d831ba04" FOREIGN KEY ("userId")
          REFERENCES "oauth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client_scopes"
        ADD CONSTRAINT "FK_95bf597cdb3cf7df1907a49e938" FOREIGN KEY ("clientId")
          REFERENCES "oauth_client"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client_scopes"
        ADD CONSTRAINT "FK_b94f84e99819eb0effb8473c547" FOREIGN KEY ("scopeId")
          REFERENCES "oauth_scope"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code_scopes"
        ADD CONSTRAINT "FK_4769112b73f7ce929429a8575c8" FOREIGN KEY ("authCode")
          REFERENCES "oauth_code"("code") ON DELETE CASCADE ON UPDATE CASCADE
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code_scopes"
        ADD CONSTRAINT "FK_1d002fc3fd0230d8f8e454fe752" FOREIGN KEY ("scopeId")
          REFERENCES "oauth_scope"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token_scopes"
        ADD CONSTRAINT "FK_bf36d38c72e3616d894a590f81c" FOREIGN KEY ("accessToken")
          REFERENCES "oauth_token"("access_token") ON DELETE CASCADE ON UPDATE CASCADE
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token_scopes"
        ADD CONSTRAINT "FK_339cf46d38a9a44c888f481a1dc" FOREIGN KEY ("scopeId")
          REFERENCES "oauth_scope"("id") ON DELETE CASCADE ON UPDATE CASCADE
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token_scopes" DROP CONSTRAINT "FK_339cf46d38a9a44c888f481a1dc"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token_scopes" DROP CONSTRAINT "FK_bf36d38c72e3616d894a590f81c"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code_scopes" DROP CONSTRAINT "FK_1d002fc3fd0230d8f8e454fe752"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code_scopes" DROP CONSTRAINT "FK_4769112b73f7ce929429a8575c8"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client_scopes" DROP CONSTRAINT "FK_b94f84e99819eb0effb8473c547"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client_scopes" DROP CONSTRAINT "FK_95bf597cdb3cf7df1907a49e938"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP CONSTRAINT "FK_f6b4b1ac66b753feab5d831ba04"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP CONSTRAINT "FK_73807359f788686077f5fd92de4"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP CONSTRAINT "FK_5a42f2ad821febfd4ccdd57245e"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP CONSTRAINT "FK_0625a578e020984428e3eed6ab3"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_339cf46d38a9a44c888f481a1d"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_bf36d38c72e3616d894a590f81"
    `)
    await queryRunner.query(/* sql */ `
      DROP TABLE "oauth_token_scopes"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_1d002fc3fd0230d8f8e454fe75"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_4769112b73f7ce929429a8575c"
    `)
    await queryRunner.query(/* sql */ `
      DROP TABLE "oauth_code_scopes"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_b94f84e99819eb0effb8473c54"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_95bf597cdb3cf7df1907a49e93"
    `)
    await queryRunner.query(/* sql */ `
      DROP TABLE "oauth_client_scopes"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_c910052e5b11436554a18fa690"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_ac1833c18d87bf44ea57bce1da"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_968845a7f037d8f348ffe389ba"
    `)
    await queryRunner.query(/* sql */ `
      DROP TABLE "oauth_token"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_3528ecec0459a0f8ca3d2eb317"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_77ed210f793c410e1cad80d3c2"
    `)
    await queryRunner.query(/* sql */ `
      DROP TABLE "oauth_code"
    `)
    await queryRunner.query(/* sql */ `
      DROP TABLE "oauth_user"
    `)
    await queryRunner.query(/* sql */ `
      DROP TABLE "oauth_client"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_a8abd735dde6150c60edc06304"
    `)
    await queryRunner.query(/* sql */ `
      DROP TABLE "oauth_scope"
    `)
  }
}
