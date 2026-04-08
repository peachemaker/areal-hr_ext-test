export const up = (pgm) => {
  pgm.createTable('hr_operations', {
    id: 'id',
    employee_id: {
      type: 'integer',
      references: '"employees"',
      onDelete: 'SET NULL',
    },
    action_type: { type: 'varchar(50)', notNull: true },
    department_id: {
      type: 'integer',
      references: '"departments"',
      onDelete: 'SET NULL',
    },
    position_id: {
      type: 'integer',
      references: '"positions"',
      onDelete: 'SET NULL',
    },
    salary: { type: 'numeric(15, 2)', notNull: true },
    operation_date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
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
  pgm.dropTable('hr_operations');
};
