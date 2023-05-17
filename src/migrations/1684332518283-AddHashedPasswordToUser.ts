import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddHashedPasswordToUser1684332518283
  implements MigrationInterface
{
  name = 'AddHashedPasswordToUser1684332518283'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user"
      ADD "hashedPassword" character varying NOT NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `
      ALTER TABLE "oauth_user" DROP COLUMN "hashedPassword"
    `)
  }
}
