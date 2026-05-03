-- ============================================================
-- Migration: 007_create_staff
-- Description: Personel detay ve vardiya tabloları
-- ============================================================

-- ============================================================
-- Staff Details (Personel Detayları)
-- ============================================================

CREATE TABLE IF NOT EXISTS staff_details (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER         UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Kişisel bilgiler
    date_of_birth       DATE,
    gender              VARCHAR(10)     CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', NULL)),
    national_id         VARCHAR(30)     UNIQUE,
    address             TEXT,
    city                VARCHAR(80),
    emergency_contact   VARCHAR(150),
    emergency_phone     VARCHAR(20),

    -- İstihdam bilgileri
    contract_type       VARCHAR(20)     NOT NULL DEFAULT 'FULL_TIME'
                            CHECK (contract_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
    salary              DECIMAL(10,2)   CHECK (salary >= 0),
    salary_currency     VARCHAR(3)      DEFAULT 'TRY',
    bank_iban           VARCHAR(34),
    bank_name           VARCHAR(80),

    -- Vardiya tercihleri
    shift_preference    VARCHAR(10)     DEFAULT 'ANY'
                            CHECK (shift_preference IN ('MORNING', 'AFTERNOON', 'NIGHT', 'ANY')),

    notes               TEXT,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_staff_user_id      ON staff_details(user_id);
CREATE INDEX idx_staff_deleted_at   ON staff_details(deleted_at);

CREATE TRIGGER trg_staff_updated_at
    BEFORE UPDATE ON staff_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Shifts (Vardiyalar)
-- ============================================================

CREATE TABLE IF NOT EXISTS shifts (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    shift_type          VARCHAR(10)     NOT NULL
                            CHECK (shift_type IN ('MORNING', 'AFTERNOON', 'NIGHT')),
    shift_date          DATE            NOT NULL,
    start_time          TIME            NOT NULL,
    end_time            TIME            NOT NULL,

    -- Gerçekleşen giriş/çıkış
    actual_start        TIMESTAMP,
    actual_end          TIMESTAMP,

    status              VARCHAR(15)     NOT NULL DEFAULT 'SCHEDULED'
                            CHECK (status IN (
                                'SCHEDULED', 'IN_PROGRESS', 'COMPLETED',
                                'ABSENT', 'LATE', 'CANCELLED'
                            )),
    notes               TEXT,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_shift_times CHECK (end_time > start_time),
    CONSTRAINT uq_staff_shift   UNIQUE (user_id, shift_date, shift_type)
);

-- Indexes
CREATE INDEX idx_shifts_user_id     ON shifts(user_id);
CREATE INDEX idx_shifts_shift_date  ON shifts(shift_date);
CREATE INDEX idx_shifts_status      ON shifts(status);
CREATE INDEX idx_shifts_deleted_at  ON shifts(deleted_at);

CREATE TRIGGER trg_shifts_updated_at
    BEFORE UPDATE ON shifts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Leave Requests (İzin Talepleri)
-- ============================================================

CREATE TABLE IF NOT EXISTS leave_requests (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER         NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    leave_type          VARCHAR(20)     NOT NULL
                            CHECK (leave_type IN (
                                'ANNUAL', 'SICK', 'MATERNITY',
                                'PATERNITY', 'UNPAID', 'OTHER'
                            )),
    start_date          DATE            NOT NULL,
    end_date            DATE            NOT NULL,
    total_days          SMALLINT        NOT NULL CHECK (total_days > 0),

    status              VARCHAR(15)     NOT NULL DEFAULT 'PENDING'
                            CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),

    reason              TEXT,
    rejection_reason    TEXT,
    reviewed_by         INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at         TIMESTAMP,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_leave_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_leave_user_id      ON leave_requests(user_id);
CREATE INDEX idx_leave_status       ON leave_requests(status);
CREATE INDEX idx_leave_start_date   ON leave_requests(start_date);
CREATE INDEX idx_leave_deleted_at   ON leave_requests(deleted_at);

CREATE TRIGGER trg_leave_updated_at
    BEFORE UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
