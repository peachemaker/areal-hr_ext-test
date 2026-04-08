import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateFileDto } from './create.dto';
import { UpdateFileDto } from './update.dto';

@Injectable()
export class FilesService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async create(createFileDto: CreateFileDto) {
    const { employee_id, name, path } = createFileDto;
    
    const query = `
      INSERT INTO files (employee_id, name, path) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    
    const result = await this.pool.query(query, [employee_id, name, path]);
    return result.rows[0];
  }

  async findAll() {
    const query = `SELECT * FROM files WHERE deleted_at IS NULL ORDER BY id ASC;`;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `SELECT * FROM files WHERE id = $1 AND deleted_at IS NULL;`;
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }
    return result.rows[0];
  }

  async update(id: number, updateFileDto: UpdateFileDto) {
    const keys = Object.keys(updateFileDto);
    if (keys.length === 0) return this.findOne(id);

    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updateFileDto)];

    const query = `
      UPDATE files 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL 
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }
    return result.rows[0];
  }

  async remove(id: number) {
    const query = `
      UPDATE files 
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL 
      RETURNING id;
    `;
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }
    return { message: `Файл с ID ${id} успешно удален` };
  }
}