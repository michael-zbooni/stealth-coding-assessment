import { GrantIdentifier, OAuthClient as OAuthClientInterface } from '@jmondi/oauth2-server'
import {
  Column,
  CreateDateColumn,
  ManyToMany,
  PrimaryColumn,
  JoinTable,
  UpdateDateColumn,
  Entity,
} from 'typeorm'
import { OAuthScope } from './oauth-scope.entity'

/**
 * An OAuth2 client entity.  Required by the @jmondi/oauth2-server library.
 */
@Entity('oauth_client') // the snake_case naming strategy will make this o_auth_client
export class OAuthClient implements OAuthClientInterface {
  @PrimaryColumn('uuid')
  readonly id!: string

  @Column('varchar', { length: 128, nullable: true })
  secret?: string

  @Column()
  name!: string

  @Column('text', { array: true })
  redirectUris!: string[]

  @Column('text', { array: true })
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
