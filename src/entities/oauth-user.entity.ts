import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { OAuthUser as OAuthUserInterface } from '@jmondi/oauth2-server'

@Entity('oauth_user') // the snake_case naming strategy will make this o_auth_user
export class OAuthUser implements OAuthUserInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column({ unique: true })
  email!: string

  @Column()
  hashedPassword!: string

  @CreateDateColumn()
  readonly createdAt!: Date

  @UpdateDateColumn()
  readonly updatedAt!: Date
}
