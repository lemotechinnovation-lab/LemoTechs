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
  // Add address column to users table (if it doesn't exist)
  pgm.sql(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'users' 
                     AND column_name = 'address') THEN
        ALTER TABLE users ADD COLUMN address text;
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
  pgm.sql(`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' 
                 AND column_name = 'address') THEN
        ALTER TABLE users DROP COLUMN address;
      END IF;
    END $$;
  `);
};
