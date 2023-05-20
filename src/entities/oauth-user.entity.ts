import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm'
import { OAuthUser as OAuthUserInterface } from '@jmondi/oauth2-server'
import { IsEmail, IsStrongPassword } from 'class-validator'
import { passwordStrengthConfig } from '../config'

/**
 * An OAuth2 user entity.  Required by the @jmondi/oauth2-server library.
 */
@Entity('oauth_user') // the snake_case naming strategy will make this o_auth_user
export class OAuthUser implements OAuthUserInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  firstName!: string

  @Column({ nullable: true })
  lastName!: string

  @Column({ unique: true })
  @IsEmail()
  email!: string

  @IsStrongPassword(passwordStrengthConfig)
  plainTextPassword?: string // not persisted (no @Column(), always undefined when fetched from DB)

  @Column()
  hashedPassword!: string

  @Column({ default: false })
  @Index()
  active!: boolean

  @Column({ unique: true })
  activationToken!: string

  @CreateDateColumn()
  readonly createdAt!: Date

  @UpdateDateColumn()
  readonly updatedAt!: Date
}
