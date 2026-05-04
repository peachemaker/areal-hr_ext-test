import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Pool } from 'pg';
import { CreateUserDto } from './create.dto';
import { ChangeHistoryService } from '../change_history/change_history.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('PG_POOL') private pool: Pool,
    private readonly historyService: ChangeHistoryService,
  ) {}

  async create(dto: CreateUserDto, executorId: number) {
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
      const newUser = result.rows[0];

      await this.historyService.create({
        user_id: executorId,
        target: 'users',
        target_id: newUser.id,
        field_name: 'all',
        old_value: null,
        new_value: 'created',
      });

      return newUser;
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
      SELECT u.id, u.last_name, u.first_name, u.patronymic, u.login, u.role_id, r.name as role 
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.deleted_at IS NULL
      ORDER BY u.id ASC;
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number): Promise<any> {
    const query = `
      SELECT id, last_name, first_name, patronymic, login, role_id 
      FROM users 
      WHERE id = $1 AND deleted_at IS NULL;
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async remove(id: number, executorId: number) {
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

    await this.historyService.create({
      user_id: executorId,
      target: 'users',
      target_id: id,
      field_name: 'deleted_at',
      old_value: null,
      new_value: new Date().toISOString(),
    });

    return { message: 'Пользователь успешно удален' };
  }

  async update(id: number, data: any, executorId: number) {
    const oldData = await this.findOne(id);
    if (!oldData) {
      throw new NotFoundException('Пользователь не найден');
    }

    let hashedPassword: string | null = null;
    if (data.password && data.password.trim() !== '') {
      hashedPassword = await argon2.hash(data.password, {
        type: argon2.argon2id,
      });
    }

    if (hashedPassword) {
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

    const fieldsToLog = [
      'last_name',
      'first_name',
      'patronymic',
      'login',
      'role_id',
    ];

    for (const field of fieldsToLog) {
      const oldValue = String(oldData[field]);
      const newValue = String(data[field]);

      if (data[field] !== undefined && oldValue !== newValue) {
        await this.historyService.create({
          user_id: executorId,
          target: 'users',
          target_id: id,
          field_name: field,
          old_value: oldValue,
          new_value: newValue,
        });
      }
    }

    if (hashedPassword) {
      await this.historyService.create({
        user_id: executorId,
        target: 'users',
        target_id: id,
        field_name: 'password',
        old_value: '******',
        new_value: 'updated',
      });
    }

    return { message: 'Пользователь успешно обновлен' };
  }

  async findOneByLogin(login: string) {
    const res = await this.pool.query(
      'SELECT * FROM users WHERE login = $1 AND deleted_at IS NULL',
      [login],
    );
    return res.rows[0];
  }
}
