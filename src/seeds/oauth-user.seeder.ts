import { Seeder } from 'typeorm-extension'
import { DataSource } from 'typeorm'
import { OAuthUser } from '../entities/oauth-user.entity'
import { UserService } from '../services/user.service'

export default class OAuthScopeSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(OAuthUser)
    const userService = new UserService(repository)

    await userService.register({
      email: 'richard.michael.coo@gmail.com',
      firstName: 'Mike',
      lastName: 'Coo',
      plainTextPassword: 'yahoo',
    })
  }
}
