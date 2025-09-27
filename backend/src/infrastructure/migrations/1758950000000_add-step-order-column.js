/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Add step_order column to existing booking_steps table
  pgm.addColumn('booking_steps', {
    step_order: { type: 'integer', notNull: false }
  });

  // Update existing rows with step_order values
  pgm.sql(`
    UPDATE booking_steps SET step_order = CASE 
      WHEN step_name = 'location' THEN 1
      WHEN step_name = 'items' THEN 2
      WHEN step_name = 'carType' THEN 3
      WHEN step_name = 'confirming' THEN 4
      WHEN step_name = 'processing' THEN 5
      WHEN step_name = 'confirmed' THEN 6
      ELSE 999
    END
    WHERE step_order IS NULL;
  `);

  // Make step_order not null after updating existing data
  pgm.alterColumn('booking_steps', 'step_order', { notNull: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropColumn('booking_steps', 'step_order');
};
