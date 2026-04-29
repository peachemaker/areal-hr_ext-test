import { Controller, Request, Post, UseGuards, Get, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './localguard';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user || null;
  }

  @Post('logout')
  logout(@Request() req, @Response() res) {
    req.logout((err) => {
      if (err) return res.status(500).send(err);
      res.clearCookie('connect.sid');
      res.status(200).send({ message: 'Logged out' });
    });
  }
}
