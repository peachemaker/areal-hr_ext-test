import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateOrganizationDto } from './create_organization.dto';
import { UpdateOrganizationDto } from './update_organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async create(dto: CreateOrganizationDto) {
    const { name, comment } = dto;
    const result = await this.pool.query(
      'INSERT INTO organizations (name, comment) VALUES ($1, $2) RETURNING *',
      [name, comment || null]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query(
      'SELECT * FROM organizations WHERE deleted_at IS NULL ORDER BY id'
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM organizations WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Organization not found');
    }
    return result.rows[0];
  }

  async update(id: number, dto: UpdateOrganizationDto) {
    const { name, comment } = dto;
    const result = await this.pool.query(
      `UPDATE organizations 
       SET name = COALESCE($1, name), 
           comment = COALESCE($2, comment) 
       WHERE id = $3 AND deleted_at IS NULL 
       RETURNING *`,
      [name, comment, id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Organization not found');
    }
    return result.rows[0];
  }

  async softDelete(id: number) {
    const result = await this.pool.query(
      'UPDATE organizations SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id',
      [id]
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Organization not found');
    }
    return { message: 'Organization soft deleted' };
  }
}