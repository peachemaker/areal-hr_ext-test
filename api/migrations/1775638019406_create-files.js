export const up = (pgm) => {
  pgm.createTable('files', {
    id: 'id',
    employee_id: {
      type: 'integer',
      references: '"employees"',
      onDelete: 'SET NULL',
    },
    name: { type: 'varchar(255)', notNull: true },
    path: { type: 'varchar(500)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    deleted_at: { type: 'timestamp' },
  });
};

export const down = (pgm) => {
  pgm.dropTable('files');
};
