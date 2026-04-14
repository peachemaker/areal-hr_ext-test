exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    last_name: { type: 'varchar(100)', notNull: true },
    role_id: {
      type: 'integer',
      references: '"roles"', 
      onDelete: 'SET NULL', 
    },
    first_name: { type: 'varchar(100)', notNull: true },
    patronymic: { type: 'varchar(100)' },
    login: { type: 'varchar(100)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    deleted_at: { type: 'timestamp' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
