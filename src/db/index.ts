import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.databse_url,
  
});

export const initDB = async () => {
  try {
    // 1. Create Enums if they do not exist
    await pool.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('contributor', 'maintainer');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_type') THEN
          CREATE TYPE issue_type AS ENUM ('bug', 'feature_request');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'issue_status') THEN
          CREATE TYPE issue_status AS ENUM ('open', 'in_progress', 'resolved');
        END IF;
      END $$;
    `);

    // 2. Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role user_role NOT NULL DEFAULT 'contributor',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL CHECK (LENGTH(description) >= 20),
        type issue_type NOT NULL,
        status issue_status NOT NULL DEFAULT 'open',
        reporter_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create the automatic modification timestamp trigger function
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_modified_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 4. Bind triggers to tables safely
    await pool.query(`
      DROP TRIGGER IF EXISTS update_users_modtime ON users;
      CREATE TRIGGER update_users_modtime
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_modified_column();

      DROP TRIGGER IF EXISTS update_issues_modtime ON issues;
      CREATE TRIGGER update_issues_modtime
          BEFORE UPDATE ON issues
          FOR EACH ROW
          EXECUTE FUNCTION update_modified_column();
    `);

    console.log(
      "Database initialized successfully",
    );
  } catch (error) {
    console.error("Critical error initializing database schema:", error);
  }
};
