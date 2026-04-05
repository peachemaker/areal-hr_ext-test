import { Provider } from '@nestjs/common';
import { Pool } from 'pg';

export const DatabaseProvider: Provider = {
  provide: 'PG_POOL',
  useFactory: async () => {
    const pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS organizations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          comment TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS positions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
        );
      `);
      await client.query(`
        CREATE TABLE IF NOT EXISTS departments (
          id SERIAL PRIMARY KEY,
          organization_id INTEGER REFERENCES organizations(id) ON DELETE SET NULL,
          parent_department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
          name VARCHAR(255) NOT NULL,
          comment TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
        );
      `);
    } catch (err) {
      console.error('Table creation error:', err);
    } finally {
      client.release();
    }

    return pool;
  },
};