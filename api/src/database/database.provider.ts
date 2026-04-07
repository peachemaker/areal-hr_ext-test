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

    try {
      const client = await pool.connect();
      client.release();
      console.log('Successfully connected to PostgreSQL');
    } catch (err) {
      console.error('Database connection error:', err);
    }

    return pool;
  },
};