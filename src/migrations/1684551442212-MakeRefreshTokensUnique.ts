import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeRefreshTokensUnique1684551442212 implements MigrationInterface {
  name = 'MakeRefreshTokensUnique1684551442212'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_968845a7f037d8f348ffe389ba"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
      ADD CONSTRAINT "UQ_968845a7f037d8f348ffe389ba7" UNIQUE ("refresh_token")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token" DROP CONSTRAINT "UQ_968845a7f037d8f348ffe389ba7"
    `)
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_968845a7f037d8f348ffe389ba" ON "oauth_token" ("refresh_token")
    `)
  }
}
