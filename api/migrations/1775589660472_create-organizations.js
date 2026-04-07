exports.up = (pgm) => {
  pgm.createTable('organizations', {
    id: 'id',
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
  pgm.dropTable('organizations');
};
