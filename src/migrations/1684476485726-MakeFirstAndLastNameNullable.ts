import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeFirstAndLastNameNullable1684476485726 implements MigrationInterface {
  name = 'MakeFirstAndLastNameNullable1684476485726'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ALTER COLUMN "first_name" DROP NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ALTER COLUMN "last_name" DROP NOT NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ALTER COLUMN "last_name"
        SET NOT NULL
    `)
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
        ALTER COLUMN "first_name"
        SET NOT NULL
    `)
  }
}
