exports.up = (pgm) => {
  pgm.createTable('departments', {
    id: 'id',
    organization_id: {
      type: 'integer',
      references: '"organizations"',
      onDelete: 'SET NULL',
    },
    parent_department_id: {
      type: 'integer',
      references: '"departments"', // Самоцитирование (дерево)
      onDelete: 'SET NULL',
    },
    name: { type: 'varchar(255)', notNull: true },
    comment: { type: 'text' },
    created_at: { 
      type: 'timestamp', 
      notNull: true, 
      default: pgm.func('current_timestamp') 
    },
    deleted_at: { type: 'timestamp' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('departments');
};