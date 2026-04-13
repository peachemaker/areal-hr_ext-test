exports.up = (pgm) => {
  pgm.createTable('employees', {
    id: 'id',
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
    last_name: { type: 'varchar(100)', notNull: true },
    first_name: { type: 'varchar(100)', notNull: true },
    patronymic: { type: 'varchar(100)' },
    birth_date: { type: 'date' },
    passport_series: { type: 'varchar(4)' },
    passport_number: { type: 'varchar(6)' },
    passport_issue_date: { type: 'date' },
    passport_department_code: { type: 'varchar(20)' },
    passport_issued_by: { type: 'text' },
    address_region: { type: 'varchar(100)' },
    address_locality: { type: 'varchar(100)' },
    address_street: { type: 'varchar(100)' },
    address_house: { type: 'varchar(20)' },
    address_block: { type: 'varchar(20)' },
    address_apartment: { type: 'varchar(20)' },
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
  pgm.dropTable('employees');
};
