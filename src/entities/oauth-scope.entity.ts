import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { OAuthScope as OAuthScopeInterface } from '@jmondi/oauth2-server'

@Entity('oauth_scope') // the snake_case naming strategy will make this o_auth_scope
export class OAuthScope implements OAuthScopeInterface {
  @PrimaryGeneratedColumn()
  id!: number

  @Index()
  @Column()
  name!: string

  @Column({ nullable: true })
  description?: string

  @CreateDateColumn()
  readonly createdAt!: Date

  @UpdateDateColumn()
  readonly updatedAt!: Date
}
