import {
  GrantIdentifier,
  OAuthClient as OAuthClientInterface,
} from '@jmondi/oauth2-server'
import {
  Column,
  CreateDateColumn,
  ManyToMany,
  PrimaryColumn,
  JoinTable,
  UpdateDateColumn,
} from 'typeorm'
import { OAuthScope } from './oauth-scope.entity'

export class OAuthClient implements OAuthClientInterface {
  @PrimaryColumn('uuid')
  readonly id!: string

  @Column('varchar', { length: 128, nullable: true })
  secret?: string

  @Column()
  name!: string

  @Column('simple-array')
  redirectUris!: string[]

  @Column('simple-array')
  allowedGrants!: GrantIdentifier[]

  @ManyToMany(() => OAuthScope, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'oauth_client_scopes',
    joinColumn: { name: 'clientId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'scopeId', referencedColumnName: 'id' },
  })
  scopes!: OAuthScope[]

  @CreateDateColumn()
  readonly createdAt!: Date

  @UpdateDateColumn()
  readonly updatedAt!: Date
}
