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
import {
  CodeChallengeMethod,
  OAuthAuthCode as OAuthAuthCodeInterface,
} from '@jmondi/oauth2-server'

import { OAuthClient } from './oauth-client.entity'
import { OAuthScope } from './oauth-scope.entity'
import { OAuthUser } from './oauth-user.entity'

@Entity('oauth_auth_codes')
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
  @Column('uuid', { nullable: true })
  userId?: string

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
