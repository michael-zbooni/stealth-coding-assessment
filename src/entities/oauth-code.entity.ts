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
import { CodeChallengeMethod, OAuthAuthCode as OAuthAuthCodeInterface } from '@jmondi/oauth2-server'

import { OAuthClient } from './oauth-client.entity'
import { OAuthScope } from './oauth-scope.entity'
import { OAuthUser } from './oauth-user.entity'

/**
 * An OAuth2 authorization code entity.  Required by the @jmondi/oauth2-server library.
 *
 * @ignore - The coding exercise only requires the Password grant type, so this entity is not used.
 */
@Entity('oauth_code') // the snake_case naming strategy will make this o_auth_code
export class OAuthCode implements OAuthAuthCodeInterface {
  @PrimaryColumn('varchar', { length: 128 })
  code!: string

  @ManyToOne(() => OAuthUser, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: OAuthUser

  @Index()
  @Column({ nullable: true })
  userId?: number

  @ManyToOne(() => OAuthClient)
  @JoinColumn({ name: 'clientId' })
  client!: OAuthClient

  @Index()
  @Column('uuid')
  clientId!: string

  @Column({ nullable: true })
  redirectUri?: string

  @Column('varchar', { nullable: true, length: 128 })
  codeChallenge?: string

  @Column('varchar', { nullable: true, length: 128 })
  codeChallengeMethod?: CodeChallengeMethod

  @ManyToMany(() => OAuthScope, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'oauth_code_scopes',
    joinColumn: { name: 'authCode', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'scopeId', referencedColumnName: 'id' },
  })
  scopes!: OAuthScope[]

  @Column()
  expiresAt!: Date

  @CreateDateColumn()
  readonly createdAt!: Date

  @UpdateDateColumn()
  readonly updatedAt!: Date

  revoke() {
    this.expiresAt = new Date(0)
  }

  get isExpired(): boolean {
    return new Date() > this.expiresAt
  }
}
