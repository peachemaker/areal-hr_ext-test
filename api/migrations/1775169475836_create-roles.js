exports.up = (pgm) => {
  pgm.createTable('roles', {
    id: 'id',
    name: { type: 'varchar(50)', notNull: true, unique: true },
    description: { type: 'text', notNull: true },
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
  pgm.sql(`
    INSERT INTO roles (name, description) 
    VALUES 
        ('Администратор', 'Управление пользователями и кадровые операции'),
        ('Менеджер по персоналу', 'Управление кадровыми операциями')
    ON CONFLICT (name) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  pgm.dropTable('roles');
};
