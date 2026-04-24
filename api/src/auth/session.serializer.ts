import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: (err: any, user: any) => void): any {
    done(null, user.id);
  }

  async deserializeUser(
    payload: any,
    done: (err: any, payload: string) => void,
  ): Promise<any> {
    const user = await this.usersService.findOne(payload);
    done(null, user);
  }
}
