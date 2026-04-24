import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByLogin(login);

    if (user && (await argon2.verify(user.password_hash, pass))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }
}
