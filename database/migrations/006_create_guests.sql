-- ============================================================
-- Migration: 006_create_guests
-- Description: Misafir tablosu oluşturma
-- ============================================================

CREATE TABLE IF NOT EXISTS guests (
    id                  SERIAL PRIMARY KEY,

    -- Kimlik bilgileri
    first_name          VARCHAR(100)    NOT NULL,
    last_name           VARCHAR(100)    NOT NULL,
    date_of_birth       DATE,
    gender              VARCHAR(10)
                            CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', NULL)),
    nationality         VARCHAR(60),
    language            VARCHAR(10)     DEFAULT 'tr',

    -- Kimlik belgesi
    id_type             VARCHAR(20)
                            CHECK (id_type IN ('PASSPORT', 'NATIONAL_ID', 'DRIVER_LICENSE', NULL)),
    id_number           VARCHAR(50),
    id_expiry_date      DATE,

    -- İletişim
    email               VARCHAR(100)    UNIQUE,
    phone               VARCHAR(20),
    phone_alt           VARCHAR(20),

    -- Adres
    address_line1       VARCHAR(150),
    address_line2       VARCHAR(150),
    city                VARCHAR(80),
    state               VARCHAR(80),
    country             VARCHAR(60),
    postal_code         VARCHAR(20),

    -- Sadakat / Profil
    guest_type          VARCHAR(20)     NOT NULL DEFAULT 'REGULAR'
                            CHECK (guest_type IN ('REGULAR', 'VIP', 'BLACKLISTED', 'CORPORATE')),
    loyalty_points      INTEGER         NOT NULL DEFAULT 0 CHECK (loyalty_points >= 0),
    company_name        VARCHAR(150),
    tax_number          VARCHAR(50),

    -- İstatistikler
    total_stays         INTEGER         NOT NULL DEFAULT 0 CHECK (total_stays >= 0),
    total_spent         DECIMAL(12,2)   NOT NULL DEFAULT 0,
    last_stay_date      DATE,
    first_stay_date     DATE,

    -- Tercihler ve notlar
    preferences         JSONB,          -- { "room_type": "SUITE", "floor": "high", "pillow": "soft" }
    notes               TEXT,
    marketing_consent   BOOLEAN         NOT NULL DEFAULT FALSE,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_guests_email           ON guests(email);
CREATE INDEX idx_guests_phone           ON guests(phone);
CREATE INDEX idx_guests_id_number       ON guests(id_number);
CREATE INDEX idx_guests_guest_type      ON guests(guest_type);
CREATE INDEX idx_guests_nationality     ON guests(nationality);
CREATE INDEX idx_guests_last_stay_date  ON guests(last_stay_date);
CREATE INDEX idx_guests_deleted_at      ON guests(deleted_at);
CREATE INDEX idx_guests_fullname        ON guests(last_name, first_name);

CREATE TRIGGER trg_guests_updated_at
    BEFORE UPDATE ON guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
