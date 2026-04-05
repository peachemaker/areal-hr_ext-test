import { Controller, Get, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Controller()
export class AppController {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  @Get()
  getHello(): string {
    return 'hello mr. president';
}
}
