import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateHrOperationDto } from './create.dto';
import { UpdateHrOperationDto } from './update.dto';

@Injectable()
export class HrOperationsService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async create(createDto: CreateHrOperationDto) {
    const allowedKeys = [
      'employee_id',
      'action_type',
      'department_id',
      'position_id',
      'salary',
    ];
    const keys = Object.keys(createDto).filter((key) =>
      allowedKeys.includes(key),
    );
    if (keys.length === 0) {
      throw new BadRequestException('Валидные поля не были переданы');
    }
    const columns = keys.join(', ');
    const values = keys.map(
      (key) => createDto[key as keyof CreateHrOperationDto],
    );
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO hr_operations (${columns}) 
      VALUES (${placeholders}) 
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const query = `SELECT * FROM hr_operations WHERE deleted_at IS NULL ORDER BY operation_date DESC;`;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findByEmployee(employeeId: number) {
    const query = `
      SELECT * FROM hr_operations 
      WHERE employee_id = $1 AND deleted_at IS NULL 
      ORDER BY operation_date DESC;
    `;
    const result = await this.pool.query(query, [employeeId]);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `SELECT * FROM hr_operations WHERE id = $1 AND deleted_at IS NULL;`;
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Операция с ID ${id} не найдена`);
    }
    return result.rows[0];
  }

  async update(id: number, updateDto: UpdateHrOperationDto) {
    const keys = Object.keys(updateDto);
    if (keys.length === 0) return this.findOne(id);

    const setClause = keys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = [id, ...Object.values(updateDto)];

    const query = `
      UPDATE hr_operations 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL 
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Операция с ID ${id} не найдена`);
    }
    return result.rows[0];
  }

  async remove(id: number) {
    const query = `
      UPDATE hr_operations 
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL 
      RETURNING id;
    `;
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Операция с ID ${id} не найдена`);
    }
    return { message: `Кадровая операция с ID ${id} удалена` };
  }
}
