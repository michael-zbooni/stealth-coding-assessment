import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { OAuthUser as OAuthUserInterface } from '@jmondi/oauth2-server'
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator'

@Entity('oauth_user') // the snake_case naming strategy will make this o_auth_user
export class OAuthUser implements OAuthUserInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  @IsNotEmpty()
  firstName!: string

  @Column()
  @IsNotEmpty()
  lastName!: string

  @Column({ unique: true })
  @IsEmail()
  email!: string

  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 1 })
  plainTextPassword?: string // not persisted (no @Column(), always undefined when fetched from DB)

  @Column()
  hashedPassword!: string

  @Column({ default: false })
  active!: boolean

  @Column({ unique: true })
  activationToken!: string

  @CreateDateColumn()
  readonly createdAt!: Date

  @UpdateDateColumn()
  readonly updatedAt!: Date
}
