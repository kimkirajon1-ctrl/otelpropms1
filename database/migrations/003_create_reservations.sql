-- ============================================================
-- Migration: 003_create_reservations
-- Description: Rezervasyon tablosu oluşturma
-- ============================================================

CREATE TABLE IF NOT EXISTS reservations (
    id                      SERIAL PRIMARY KEY,
    reservation_number      VARCHAR(30)     UNIQUE NOT NULL,
    guest_id                INTEGER         NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
    room_id                 INTEGER         NOT NULL REFERENCES rooms(id)  ON DELETE RESTRICT,
    rate_id                 INTEGER         REFERENCES room_rates(id)      ON DELETE SET NULL,

    -- Tarih bilgileri
    check_in_date           DATE            NOT NULL,
    check_out_date          DATE            NOT NULL,
    actual_check_in         TIMESTAMP,
    actual_check_out        TIMESTAMP,

    -- Misafir sayısı
    adults                  INTEGER         NOT NULL DEFAULT 1 CHECK (adults > 0),
    children                INTEGER         NOT NULL DEFAULT 0 CHECK (children >= 0),

    -- Fiyat bilgileri
    room_rate               DECIMAL(10,2)   NOT NULL CHECK (room_rate >= 0),
    extra_charges           DECIMAL(10,2)   NOT NULL DEFAULT 0,
    discount_amount         DECIMAL(10,2)   NOT NULL DEFAULT 0,
    tax_amount              DECIMAL(10,2)   NOT NULL DEFAULT 0,
    total_amount            DECIMAL(10,2)   NOT NULL CHECK (total_amount >= 0),
    paid_amount             DECIMAL(10,2)   NOT NULL DEFAULT 0,
    currency                VARCHAR(3)      NOT NULL DEFAULT 'TRY',

    -- Durum
    status                  VARCHAR(30)     NOT NULL DEFAULT 'PENDING'
                                CHECK (status IN (
                                    'PENDING', 'CONFIRMED', 'CHECKED_IN',
                                    'CHECKED_OUT', 'CANCELLED', 'NO_SHOW'
                                )),
    payment_status          VARCHAR(20)     NOT NULL DEFAULT 'UNPAID'
                                CHECK (payment_status IN ('UNPAID', 'PARTIAL', 'PAID', 'REFUNDED')),

    -- Kaynak ve ekstra bilgiler
    source                  VARCHAR(50)     DEFAULT 'DIRECT'
                                CHECK (source IN ('DIRECT', 'PHONE', 'ONLINE', 'AGENCY', 'WALK_IN')),
    breakfast_included      BOOLEAN         NOT NULL DEFAULT FALSE,
    extra_bed               BOOLEAN         NOT NULL DEFAULT FALSE,
    special_requests        TEXT,
    internal_notes          TEXT,
    cancellation_reason     TEXT,
    cancelled_at            TIMESTAMP,
    cancelled_by            INTEGER REFERENCES users(id) ON DELETE SET NULL,

    created_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at              TIMESTAMP,
    created_by              INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by              INTEGER REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_reservation_dates   CHECK (check_out_date > check_in_date),
    CONSTRAINT chk_actual_checkin      CHECK (actual_check_out IS NULL OR actual_check_out > actual_check_in),
    CONSTRAINT chk_paid_amount         CHECK (paid_amount <= total_amount)
);

-- Indexes
CREATE INDEX idx_reservations_guest_id          ON reservations(guest_id);
CREATE INDEX idx_reservations_room_id           ON reservations(room_id);
CREATE INDEX idx_reservations_status            ON reservations(status);
CREATE INDEX idx_reservations_payment_status    ON reservations(payment_status);
CREATE INDEX idx_reservations_check_in_date     ON reservations(check_in_date);
CREATE INDEX idx_reservations_check_out_date    ON reservations(check_out_date);
CREATE INDEX idx_reservations_reservation_number ON reservations(reservation_number);
CREATE INDEX idx_reservations_deleted_at        ON reservations(deleted_at);

-- Auto-update updated_at trigger
CREATE TRIGGER trg_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Rezervasyon numarası otomatik oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION generate_reservation_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.reservation_number IS NULL OR NEW.reservation_number = '' THEN
        NEW.reservation_number := 'RES-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reservations_number
    BEFORE INSERT ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION generate_reservation_number();
