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
  // Check if step_order column exists, if not add it
  pgm.sql(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'booking_steps' 
                     AND column_name = 'step_order') THEN
        ALTER TABLE booking_steps ADD COLUMN step_order integer;
      END IF;
    END $$;
  `);

  // Update existing rows with step_order values (only if they don't have values)
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

  // Make step_order not null (but only if the column was missing the constraint)
  pgm.sql(`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'booking_steps' 
                 AND column_name = 'step_order' 
                 AND is_nullable = 'YES') THEN
        ALTER TABLE booking_steps ALTER COLUMN step_order SET NOT NULL;
      END IF;
    END $$;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropColumn('booking_steps', 'step_order');
};
