import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddIndexToUserActiveStatus1684552058229 implements MigrationInterface {
  name = 'AddIndexToUserActiveStatus1684552058229'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      CREATE INDEX "IDX_acdfae58a9a1936b4bf66c69ef" ON "oauth_user" ("active")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      DROP INDEX "public"."IDX_acdfae58a9a1936b4bf66c69ef"
    `)
  }
}
