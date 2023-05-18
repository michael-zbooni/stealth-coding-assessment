import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeActivationColumnUnique1684397065140 implements MigrationInterface {
  name = 'MakeActivationColumnUnique1684397065140'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD CONSTRAINT "UQ_744e8a58d601e7aa02f2c671bf0" UNIQUE ("activation_token")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP CONSTRAINT "UQ_744e8a58d601e7aa02f2c671bf0"
    `)
  }
}
