exports.up = (pgm) => {
  pgm.createTable('session', {
    sid: { 
      type: 'varchar', 
      notNull: true, 
      primaryKey: true,
      collation: '"default"' 
    },
    sess: { 
      type: 'json', 
      notNull: true 
    },
    expire: { 
      type: 'timestamp(6)', 
      notNull: true 
    },
  }, {
    ifNotExists: true 
  });
  pgm.createIndex('session', 'expire', { name: 'IDX_session_expire' });
};

exports.down = (pgm) => {
  pgm.dropTable('session');
};