import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { OAuthScope as OAuthScopeInterface } from '@jmondi/oauth2-server'

/**
 * The OAuth2 scope entity.  Required by the @jmondi/oauth2-server library.
 *
 * @ignore - The coding exercise doesn't mention scope, so it's currently not supported.
 */
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
