import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateChangeHistoryDto } from './create.dto';

@Injectable()
export class ChangeHistoryService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async create(createDto: CreateChangeHistoryDto) {
    const keys = Object.keys(createDto);
    const values = Object.values(createDto);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO change_history (${keys.join(', ')}) 
      VALUES (${placeholders}) 
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const query = `SELECT * FROM change_history ORDER BY operation_time DESC;`;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findByTarget(target: string, targetId: number) {
    const query = `
      SELECT * FROM change_history 
      WHERE target = $1 AND target_id = $2 
      ORDER BY operation_time DESC;
    `;
    const result = await this.pool.query(query, [target, targetId]);
    return result.rows;
  }

  async findByUser(userId: number) {
    const query = `
      SELECT * FROM change_history 
      WHERE user_id = $1 
      ORDER BY operation_time DESC;
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `SELECT * FROM change_history WHERE id = $1;`;
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Запись истории с ID ${id} не найдена`);
    }
    return result.rows[0];
  }
}