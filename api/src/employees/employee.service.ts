import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateEmployeeDto } from './create.dto';
import { UpdateEmployeeDto } from './update.dto';

@Injectable()
export class EmployeesService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const allowedKeys = [
      'last_name',
      'first_name',
      'patronymic',
      'position_id',
      'birth_date',
      'passport_series',
      'passport_number',
      'passport_issue_date',
      'passport_department_code',
      'passport_issued_by',
      'address_region',
      'address_locality',
      'address_street',
      'address_house',
      'address_block',
      'address_apartment',
    ];
    const keys = Object.keys(createEmployeeDto).filter((key) =>
      allowedKeys.includes(key),
    );
    if (keys.length === 0) {
      throw new BadRequestException('Валидные поля не были переданы');
    }
    const columns = keys.join(', ');
    const values = keys.map(
      (key) => createEmployeeDto[key as keyof CreateEmployeeDto],
    );
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO employees (${columns}) 
      VALUES (${placeholders}) 
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const query = `SELECT * FROM employees WHERE deleted_at IS NULL ORDER BY id ASC;`;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `SELECT * FROM employees WHERE id = $1 AND deleted_at IS NULL;`;
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }
    return result.rows[0];
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    
    const keys = Object.keys(updateEmployeeDto);
    if (keys.length === 0) {
      return this.findOne(id);
    }

    const setClause = keys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = [id, ...Object.values(updateEmployeeDto)];

    const query = `
      UPDATE employees 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL 
      RETURNING *;
    `;

    const result = await this.pool.query(query, values);

    if (result.rows.length === 0) {
      throw new NotFoundException(
        `Сотрудник с ID ${id} не найден или был удален`,
      );
    }
    return result.rows[0];
  }

  async remove(id: number) {
    const query = `
      UPDATE employees 
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND deleted_at IS NULL 
      RETURNING id;
    `;
    const result = await this.pool.query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`Сотрудник с ID ${id} не найден`);
    }
    return { message: `Сотрудник с ID ${id} успешно удален` };
  }
}

