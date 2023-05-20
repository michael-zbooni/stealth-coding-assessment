import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { OAuthToken as OAuthTokenInterface } from '@jmondi/oauth2-server'

import { OAuthClient } from './oauth-client.entity'
import { OAuthScope } from './oauth-scope.entity'
import { OAuthUser } from './oauth-user.entity'

/**
 * An OAuth2 token entity.  Required by the @jmondi/oauth2-server library.
 */
@Entity('oauth_token') // the snake_case naming strategy will make this o_auth_token
export class OAuthToken implements OAuthTokenInterface {
  @PrimaryColumn('varchar', { length: 128 })
  accessToken!: string

  @Column()
  accessTokenExpiresAt!: Date

  @Column('varchar', { nullable: true, length: 128, unique: true })
  refreshToken?: string

  @Column({ nullable: true })
  refreshTokenExpiresAt?: Date

  @ManyToOne(() => OAuthClient)
  @JoinColumn({ name: 'clientId' })
  client!: OAuthClient

  @Index()
  @Column('uuid')
  clientId!: string

  @ManyToOne(() => OAuthUser, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: OAuthUser

  @Index()
  @Column({ nullable: true })
  // @IsUUID()
  userId?: number

  @ManyToMany(() => OAuthScope, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'oauth_token_scopes',
    joinColumn: {
      name: 'accessToken',
      referencedColumnName: 'accessToken',
    },
    inverseJoinColumn: { name: 'scopeId', referencedColumnName: 'id' },
  })
  scopes!: OAuthScope[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  /**
   * Returns true if the access token has expired.
   */
  get isRevoked() {
    return Date.now() > this.accessTokenExpiresAt.getTime()
  }

  /**
   * Revokes the access and refresh tokens.
   */
  revoke() {
    this.accessTokenExpiresAt = new Date(0)
    this.refreshTokenExpiresAt = new Date(0)
  }
}
