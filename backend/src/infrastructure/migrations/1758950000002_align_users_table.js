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
  // Add new name column (only if it doesn't exist)
  pgm.sql(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                     WHERE table_name = 'users' 
                     AND column_name = 'name') THEN
        ALTER TABLE users ADD COLUMN name varchar(255);
      END IF;
    END $$;
  `);

  // Update name column with concatenated first_name and last_name (only if first_name exists)
  pgm.sql(`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' 
                 AND column_name = 'first_name') THEN
        UPDATE users 
        SET name = COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
        WHERE (first_name IS NOT NULL OR last_name IS NOT NULL) AND name IS NULL;
      END IF;
    END $$;
  `);

  // Make name column not null after data migration
  pgm.sql(`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' 
                 AND column_name = 'name' 
                 AND is_nullable = 'YES') THEN
        ALTER TABLE users ALTER COLUMN name SET NOT NULL;
      END IF;
    END $$;
  `);

  // Rename password_hash to password (only if password_hash exists and password doesn't)
  pgm.sql(`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' 
                 AND column_name = 'password_hash')
         AND NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name = 'users' 
                         AND column_name = 'password') THEN
        ALTER TABLE users RENAME COLUMN password_hash TO password;
      END IF;
    END $$;
  `);

  // Drop old columns (only if they exist)
  pgm.sql(`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' 
                 AND column_name = 'first_name') THEN
        ALTER TABLE users DROP COLUMN first_name;
      END IF;
    END $$;
  `);

  pgm.sql(`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' 
                 AND column_name = 'last_name') THEN
        ALTER TABLE users DROP COLUMN last_name;
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
  // Add back first_name and last_name columns
  pgm.addColumn('users', {
    first_name: { type: 'varchar(100)' },
    last_name: { type: 'varchar(100)' }
  });

  // Split name back into first_name and last_name
  pgm.sql(`
    UPDATE users 
    SET 
      first_name = SPLIT_PART(name, ' ', 1),
      last_name = SUBSTRING(name FROM POSITION(' ' IN name) + 1)
    WHERE name IS NOT NULL
  `);

  // Rename password back to password_hash
  pgm.renameColumn('users', 'password', 'password_hash');

  // Drop name column
  pgm.dropColumn('users', 'name');
};
