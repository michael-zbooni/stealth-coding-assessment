import { MigrationInterface, QueryRunner } from 'typeorm'

export class SwitchToCamelCase1684340999891 implements MigrationInterface {
  name = 'SwitchToCamelCase1684340999891'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_0625a578e020984428e3eed6ab"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_5a42f2ad821febfd4ccdd57245"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_73e3ff79523101067a961f4d4e"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_73807359f788686077f5fd92de"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_f6b4b1ac66b753feab5d831ba0"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_scope" DROP COLUMN "createdAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_scope" DROP COLUMN "updatedAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client" DROP COLUMN "redirectUris"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client" DROP COLUMN "allowedGrants"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client" DROP COLUMN "createdAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client" DROP COLUMN "updatedAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "firstName"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "lastName"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "createdAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "updatedAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "hashedPassword"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "redirectUri"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "codeChallenge"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "codeChallengeMethod"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "expiresAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "createdAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "updatedAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP CONSTRAINT "PK_4555ec0b13aa755eb9481b68113"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "accessToken"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "accessTokenExpiresAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "refreshToken"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "refreshTokenExpiresAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "createdAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "updatedAt"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_scope"
        ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_scope"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client"
        ADD "redirect_uris" text array NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client"
        ADD "allowed_grants" text array NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client"
        ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "first_name" character varying NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "last_name" character varying NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "hashed_password" character varying NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "user_id" integer
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "client_id" uuid NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "redirect_uri" character varying
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "code_challenge" character varying(128)
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "code_challenge_method" character varying(128)
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "expires_at" TIMESTAMP NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "access_token" character varying(128) NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD CONSTRAINT "PK_eff4c35110e50405b1ccb65da73" PRIMARY KEY ("access_token")
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "access_token_expires_at" TIMESTAMP NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "refresh_token" character varying(128)
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "refresh_token_expires_at" TIMESTAMP
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "client_id" uuid NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "user_id" integer
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP CONSTRAINT "FK_5a42f2ad821febfd4ccdd57245e"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
            ALTER COLUMN "clientId" DROP NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP CONSTRAINT "FK_73807359f788686077f5fd92de4"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
            ALTER COLUMN "clientId" DROP NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_77ed210f793c410e1cad80d3c2" ON "oauth_code" ("user_id")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_3528ecec0459a0f8ca3d2eb317" ON "oauth_code" ("client_id")
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
      ALTER TABLE "oauth_code"
        ADD CONSTRAINT "FK_5a42f2ad821febfd4ccdd57245e" FOREIGN KEY ("clientId") REFERENCES "oauth_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD CONSTRAINT "FK_73807359f788686077f5fd92de4" FOREIGN KEY ("clientId") REFERENCES "oauth_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP CONSTRAINT "FK_73807359f788686077f5fd92de4"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP CONSTRAINT "FK_5a42f2ad821febfd4ccdd57245e"
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
      DROP INDEX "public"."IDX_3528ecec0459a0f8ca3d2eb317"
    `)
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_77ed210f793c410e1cad80d3c2"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
            ALTER COLUMN "clientId"
            SET NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD CONSTRAINT "FK_73807359f788686077f5fd92de4" FOREIGN KEY ("clientId") REFERENCES "oauth_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
            ALTER COLUMN "clientId"
            SET NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD CONSTRAINT "FK_5a42f2ad821febfd4ccdd57245e" FOREIGN KEY ("clientId") REFERENCES "oauth_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "updated_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "created_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "user_id"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "client_id"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "refresh_token_expires_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "refresh_token"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "access_token_expires_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP CONSTRAINT "PK_eff4c35110e50405b1ccb65da73"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP COLUMN "access_token"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "updated_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "created_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "expires_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "code_challenge_method"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "code_challenge"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "redirect_uri"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "client_id"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code" DROP COLUMN "user_id"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "updated_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "created_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "hashed_password"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "last_name"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "first_name"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client" DROP COLUMN "updated_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client" DROP COLUMN "created_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client" DROP COLUMN "allowed_grants"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client" DROP COLUMN "redirect_uris"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_scope" DROP COLUMN "updated_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_scope" DROP COLUMN "created_at"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "refreshTokenExpiresAt" TIMESTAMP
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "refreshToken" character varying(128)
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "accessTokenExpiresAt" TIMESTAMP NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD "accessToken" character varying(128) NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ADD CONSTRAINT "PK_4555ec0b13aa755eb9481b68113" PRIMARY KEY ("accessToken")
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "expiresAt" TIMESTAMP NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "codeChallengeMethod" character varying(128)
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "codeChallenge" character varying(128)
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_code"
        ADD "redirectUri" character varying
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "hashedPassword" character varying NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "lastName" character varying NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "firstName" character varying NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client"
        ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client"
        ADD "allowedGrants" text array NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_client"
        ADD "redirectUris" text array NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_scope"
        ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_scope"
        ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_f6b4b1ac66b753feab5d831ba0" ON "oauth_token" ("userId")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_73807359f788686077f5fd92de" ON "oauth_token" ("clientId")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_73e3ff79523101067a961f4d4e" ON "oauth_token" ("refreshToken")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_5a42f2ad821febfd4ccdd57245" ON "oauth_code" ("clientId")
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_0625a578e020984428e3eed6ab" ON "oauth_code" ("userId")
    `)
  }
}
