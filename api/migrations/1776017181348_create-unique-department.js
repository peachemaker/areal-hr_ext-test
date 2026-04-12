export const up = (pgm) => {
  pgm.addConstraint('departments', 'unique_org_id_name', {
    unique: ['organization_id', 'name'],
  });
};

export const down = (pgm) => {
  pgm.dropConstraint('departments', 'unique_org_id_name');
};
