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

  async deserializeUser(payload: any, done: (err: any, user: any) => void) {
  try {
    const userId = Number(payload);
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      return done(null, null); 
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}
}
