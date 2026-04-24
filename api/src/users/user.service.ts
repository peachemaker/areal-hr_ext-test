import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Pool } from 'pg';
import { CreateUserDto } from './create.dto';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    const query = `
      INSERT INTO users (last_name, first_name, patronymic, login, password_hash, role_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, last_name, first_name, patronymic, login, role_id;
    `;
    const values = [
      dto.last_name,
      dto.first_name,
      dto.patronymic,
      dto.login,
      passwordHash,
      dto.role_id,
    ];

    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      const pgError = error as { code?: string };
      if (pgError.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким логином уже существует',
        );
      }
      throw error;
    }
  }

  async findAll() {
    const query = `
      SELECT u.id, u.last_name, u.first_name, u.patronymic, u.login, r.name as role 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.deleted_at IS NULL
      ORDER BY u.id ASC;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT id, last_name, first_name, patronymic, login, role_id 
      FROM users 
      WHERE id = $1 AND deleted_at IS NULL;
    `;
    const result = await this.pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw new NotFoundException('Пользователь не найден');
    }
    return result.rows[0];
  }

  async remove(id: number) {
    const query = `
      UPDATE users 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id;
    `;
    const result = await this.pool.query(query, [id]);

    if (result.rowCount === 0) {
      throw new NotFoundException('Пользователь не найден или уже удален');
    }
    return { message: 'Пользователь успешно удален' };
  }

  async update(id: number, data: any) {
    if (data.password && data.password.trim() !== '') {
      const hashedPassword = await argon2.hash(data.password, {
        type: argon2.argon2id,
      });

      await this.pool.query(
        `UPDATE users 
       SET last_name = $1, first_name = $2, patronymic = $3, login = $4, password_hash = $5, role_id = $6 
       WHERE id = $7`,
        [
          data.last_name,
          data.first_name,
          data.patronymic,
          data.login,
          hashedPassword,
          data.role_id,
          id,
        ],
      );
    } else {
      await this.pool.query(
        `UPDATE users 
       SET last_name = $1, first_name = $2, patronymic = $3, login = $4, role_id = $5 
       WHERE id = $6`,
        [
          data.last_name,
          data.first_name,
          data.patronymic,
          data.login,
          data.role_id,
          id,
        ],
      );
    }

    return { message: 'Пользователь успешно обновлен' };
  }

  async findOneByLogin(login: string) {
    const res = await this.pool.query('SELECT * FROM users WHERE login = $1', [
      login,
    ]);
    return res.rows[0];
  }
}
