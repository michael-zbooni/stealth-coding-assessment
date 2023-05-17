import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { OAuthScope as OAuthScopeInterface } from '@jmondi/oauth2-server'

@Entity()
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
