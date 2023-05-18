import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddColumnsForUserActivation1684396281100 implements MigrationInterface {
  name = 'AddColumnsForUserActivation1684396281100'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "active" boolean NOT NULL DEFAULT false
      `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ADD "activation_token" character varying NOT NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "activation_token"
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "active"
    `)
  }
}
