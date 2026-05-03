-- ============================================================
-- Migration: 001_create_users
-- Description: Kullanıcı tablosu oluşturma
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id                  SERIAL PRIMARY KEY,
    username            VARCHAR(50)  UNIQUE NOT NULL,
    email               VARCHAR(100) UNIQUE NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    department          VARCHAR(50)  NOT NULL
                            CHECK (department IN ('FRONTOFFICE', 'HOUSEKEEPING', 'FINANCE', 'ADMIN')),
    role                VARCHAR(50)  NOT NULL
                            CHECK (role IN ('MANAGER', 'STAFF', 'DIRECTOR', 'ADMIN')),
    phone               VARCHAR(20),
    employee_id         VARCHAR(50)  UNIQUE,
    hire_date           DATE,
    status              VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
                            CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    last_login          TIMESTAMP,
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_users_department   ON users(department);
CREATE INDEX idx_users_role         ON users(role);
CREATE INDEX idx_users_status       ON users(status);
CREATE INDEX idx_users_employee_id  ON users(employee_id);
CREATE INDEX idx_users_deleted_at   ON users(deleted_at);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
