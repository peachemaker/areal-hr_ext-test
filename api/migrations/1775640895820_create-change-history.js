exports.up = (pgm) => {
  pgm.createTable('change_history', {
    id: 'id',
    operation_time: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    // user_id: {
    //   type: 'integer',
    //   references: '"users"',
    //   onDelete: 'SET NULL',
    // },
    target: { type: 'varchar(50)', notNull: true },
    target_id: { type: 'integer', notNull: true },
    field_name: { type: 'varchar(100)', notNull: true },
    old_value: { type: 'text', notNull: true },
    new_value: { type: 'text', notNull: true },
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

exports.down = (pgm) => {
  pgm.dropTable('change_history');
};
