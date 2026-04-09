import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateDepartmentDto } from './create.dto';
import { UpdateDepartmentDto } from './update.dto';

@Injectable()
export class DepartmentsService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async create(dto: CreateDepartmentDto) {
    const { organization_id, parent_department_id, name, comment } = dto;
    const result = await this.pool.query(
      `INSERT INTO departments (organization_id, parent_department_id, name, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        organization_id || null,
        parent_department_id || null,
        name,
        comment || null,
      ],
    );
    return result.rows[0];
  }

  async findAll() {
    const query = `
      SELECT d.*,
             o.name AS organization_name,
             p.name AS parent_name
      FROM departments d
      LEFT JOIN organizations o ON d.organization_id = o.id
      LEFT JOIN departments p ON d.parent_department_id = p.id
      WHERE d.deleted_at IS NULL
      ORDER BY d.organization_id, d.name
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT d.*,
             o.name AS organization_name,
             p.name AS parent_name
      FROM departments d
      LEFT JOIN organizations o ON d.organization_id = o.id
      LEFT JOIN departments p ON d.parent_department_id = p.id
      WHERE d.id = $1 AND d.deleted_at IS NULL
    `;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) {
      throw new NotFoundException('Department not found');
    }
    return result.rows[0];
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const keys = Object.keys(dto);

    if (keys.length === 0) {
      const currentState = await this.pool.query(
        `SELECT * FROM departments WHERE id = $1 AND deleted_at IS NULL`,
        [id],
      );
      if (currentState.rows.length === 0) {
        throw new NotFoundException('Department not found');
      }
      return currentState.rows[0];
    }
    const setClause = keys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    const values = [id, ...Object.values(dto)];
    const result = await this.pool.query(
      `UPDATE departments 
     SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $1 AND deleted_at IS NULL 
     RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Department not found');
    }

    return result.rows[0];
  }

  async softDelete(id: number) {
    const result = await this.pool.query(
      `UPDATE departments SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id],
    );
    if (result.rowCount === 0) {
      throw new NotFoundException('Department not found');
    }
    return { message: 'Department soft deleted' };
  }
}
