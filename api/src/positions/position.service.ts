import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreatePositionDto } from './create.dto';
import { UpdatePositionDto } from './update.dto';

@Injectable()
export class PositionsService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async create(dto: CreatePositionDto) {
    const { name } = dto;
    const result = await this.pool.query(
      'INSERT INTO positions (name) VALUES ($1) RETURNING *',
      [name]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query(
      'SELECT * FROM positions WHERE deleted_at IS NULL ORDER BY name'
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM positions WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Position not found');
    }
    return result.rows[0];
  }

  async update(id: number, dto: UpdatePositionDto) {
    const { name } = dto;
    const result = await this.pool.query(
      'UPDATE positions SET name = COALESCE($1, name) WHERE id = $2 AND deleted_at IS NULL RETURNING *',
      [name, id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Position not found');
    }
    return result.rows[0];
  }

  async softDelete(id: number) {
    const result = await this.pool.query(
      'UPDATE positions SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Position not found');
    }
    return { message: 'Position soft deleted' };
  }
}