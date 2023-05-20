import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixTokenTimezoneIssues1684574899326 implements MigrationInterface {
  name = 'FixTokenTimezoneIssues1684574899326'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ALTER COLUMN "access_token_expires_at" TYPE TIMESTAMP WITH TIME ZONE,
        ALTER COLUMN "refresh_token_expires_at" TYPE TIMESTAMP WITH TIME ZONE,
        ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE,
        ALTER COLUMN "updated_at" TYPE TIMESTAMP WITH TIME ZONE
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_token"
        ALTER COLUMN "access_token_expires_at" TYPE TIMESTAMP,
        ALTER COLUMN "refresh_token_expires_at" TYPE TIMESTAMP,
        ALTER COLUMN "created_at" TYPE TIMESTAMP,
        ALTER COLUMN "updated_at" TYPE TIMESTAMP
    `)
  }
}
