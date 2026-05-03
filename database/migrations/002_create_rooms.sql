-- ============================================================
-- Migration: 002_create_rooms
-- Description: Oda ve oda fiyat tabloları oluşturma
-- ============================================================

CREATE TABLE IF NOT EXISTS rooms (
    id                      SERIAL PRIMARY KEY,
    room_number             VARCHAR(20)     UNIQUE NOT NULL,
    floor                   INTEGER         NOT NULL CHECK (floor >= 0),
    room_type               VARCHAR(50)     NOT NULL
                                CHECK (room_type IN ('SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PRESIDENTIAL')),
    capacity                INTEGER         NOT NULL CHECK (capacity > 0),
    base_price              DECIMAL(10,2)   NOT NULL CHECK (base_price >= 0),
    current_status          VARCHAR(20)     NOT NULL DEFAULT 'AVAILABLE'
                                CHECK (current_status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING')),
    condition_status        VARCHAR(20)     NOT NULL DEFAULT 'CLEAN'
                                CHECK (condition_status IN ('CLEAN', 'DIRTY', 'DAMAGED')),
    amenities               TEXT[],
    view_type               VARCHAR(50)
                                CHECK (view_type IN ('SEA', 'CITY', 'GARDEN', NULL)),
    smoking                 BOOLEAN         NOT NULL DEFAULT FALSE,
    last_cleaning_date      TIMESTAMP,
    next_maintenance_date   DATE,
    notes                   TEXT,
    created_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at              TIMESTAMP,
    updated_by              INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_rooms_room_type        ON rooms(room_type);
CREATE INDEX idx_rooms_current_status   ON rooms(current_status);
CREATE INDEX idx_rooms_condition_status ON rooms(condition_status);
CREATE INDEX idx_rooms_floor            ON rooms(floor);
CREATE INDEX idx_rooms_deleted_at       ON rooms(deleted_at);

-- Auto-update updated_at trigger
CREATE TRIGGER trg_rooms_updated_at
    BEFORE UPDATE ON rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Room Rates (Oda Fiyatları)
-- ============================================================

CREATE TABLE IF NOT EXISTS room_rates (
    id                  SERIAL PRIMARY KEY,
    room_type           VARCHAR(50)     NOT NULL
                            CHECK (room_type IN ('SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PRESIDENTIAL')),
    currency            VARCHAR(3)      NOT NULL DEFAULT 'TRY',
    weekday_rate        DECIMAL(10,2)   NOT NULL CHECK (weekday_rate >= 0),
    weekend_rate        DECIMAL(10,2)   NOT NULL CHECK (weekend_rate >= 0),
    holiday_rate        DECIMAL(10,2)   NOT NULL CHECK (holiday_rate >= 0),
    seasonal_rate       DECIMAL(10,2)            CHECK (seasonal_rate >= 0),
    season_name         VARCHAR(50),
    season_start_date   DATE,
    season_end_date     DATE,
    extra_bed_rate      DECIMAL(10,2)            DEFAULT 0 CHECK (extra_bed_rate >= 0),
    breakfast_rate      DECIMAL(10,2)            DEFAULT 0 CHECK (breakfast_rate >= 0),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    valid_from          DATE            NOT NULL DEFAULT CURRENT_DATE,
    valid_until         DATE,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_season_dates CHECK (
        (season_start_date IS NULL AND season_end_date IS NULL)
        OR (season_start_date IS NOT NULL AND season_end_date IS NOT NULL AND season_end_date > season_start_date)
    ),
    CONSTRAINT chk_valid_dates CHECK (
        valid_until IS NULL OR valid_until > valid_from
    )
);

-- Indexes
CREATE INDEX idx_room_rates_room_type    ON room_rates(room_type);
CREATE INDEX idx_room_rates_is_active    ON room_rates(is_active);
CREATE INDEX idx_room_rates_valid_from   ON room_rates(valid_from);
CREATE INDEX idx_room_rates_deleted_at   ON room_rates(deleted_at);

-- Auto-update updated_at trigger
CREATE TRIGGER trg_room_rates_updated_at
    BEFORE UPDATE ON room_rates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
