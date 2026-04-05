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

    // Создаём таблицы при старте (для разработки)
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
      console.log('Tables created/verified');
    } catch (err) {
      console.error('Table creation error:', err);
    } finally {
      client.release();
    }

    return pool;
  },
};