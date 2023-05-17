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
import { OAuthToken } from '@jmondi/oauth2-server'

import { OAuthClient } from './oauth-client.entity'
import { OAuthScope } from './oauth-scope.entity'
import { OAuthUser } from './oauth-user.entity'

@Entity('oauth_tokens')
export class Token implements OAuthToken {
  @PrimaryColumn('varchar', { length: 128 })
  accessToken!: string

  @Column()
  accessTokenExpiresAt!: Date

  @Column('varchar', { nullable: true, length: 128 })
  @Index()
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
  @Column('uuid', { nullable: true })
  // @IsUUID()
  userId?: string

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

  get isRevoked() {
    return Date.now() > this.accessTokenExpiresAt.getTime()
  }

  revoke() {
    this.accessTokenExpiresAt = new Date(0)
    this.refreshTokenExpiresAt = new Date(0)
  }
}
