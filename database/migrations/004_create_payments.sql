-- ============================================================
-- Migration: 004_create_payments
-- Description: Ödeme tablosu oluşturma
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
    id                      SERIAL PRIMARY KEY,
    payment_number          VARCHAR(30)     UNIQUE NOT NULL,
    reservation_id          INTEGER         NOT NULL REFERENCES reservations(id) ON DELETE RESTRICT,
    guest_id                INTEGER         NOT NULL REFERENCES guests(id)       ON DELETE RESTRICT,

    -- Ödeme bilgileri
    amount                  DECIMAL(10,2)   NOT NULL CHECK (amount > 0),
    currency                VARCHAR(3)      NOT NULL DEFAULT 'TRY',
    payment_method          VARCHAR(30)     NOT NULL
                                CHECK (payment_method IN (
                                    'CASH', 'CREDIT_CARD', 'DEBIT_CARD',
                                    'BANK_TRANSFER', 'ONLINE', 'CHEQUE'
                                )),
    payment_type            VARCHAR(20)     NOT NULL DEFAULT 'PAYMENT'
                                CHECK (payment_type IN ('PAYMENT', 'DEPOSIT', 'REFUND', 'ADJUSTMENT')),
    status                  VARCHAR(20)     NOT NULL DEFAULT 'PENDING'
                                CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED')),

    -- Kart / transfer bilgileri (hassas veri saklanmaz)
    card_last_four          CHAR(4),
    card_brand              VARCHAR(20),
    transaction_id          VARCHAR(100)    UNIQUE,
    bank_reference          VARCHAR(100),

    -- Fatura bilgileri
    invoice_number          VARCHAR(30)     UNIQUE,
    invoice_date            DATE,
    tax_rate                DECIMAL(5,2)    NOT NULL DEFAULT 18.00,
    tax_amount              DECIMAL(10,2)   NOT NULL DEFAULT 0,
    net_amount              DECIMAL(10,2)   NOT NULL,

    -- Geri ödeme
    refund_reason           TEXT,
    refunded_at             TIMESTAMP,
    refunded_by             INTEGER REFERENCES users(id) ON DELETE SET NULL,
    original_payment_id     INTEGER REFERENCES payments(id) ON DELETE SET NULL,

    notes                   TEXT,
    processed_at            TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at              TIMESTAMP,
    created_by              INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by              INTEGER REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_net_amount CHECK (net_amount > 0),
    CONSTRAINT chk_tax_amount CHECK (tax_amount >= 0)
);

-- Indexes
CREATE INDEX idx_payments_reservation_id    ON payments(reservation_id);
CREATE INDEX idx_payments_guest_id          ON payments(guest_id);
CREATE INDEX idx_payments_status            ON payments(status);
CREATE INDEX idx_payments_payment_method    ON payments(payment_method);
CREATE INDEX idx_payments_payment_type      ON payments(payment_type);
CREATE INDEX idx_payments_processed_at      ON payments(processed_at);
CREATE INDEX idx_payments_invoice_number    ON payments(invoice_number);
CREATE INDEX idx_payments_deleted_at        ON payments(deleted_at);

-- Auto-update updated_at trigger
CREATE TRIGGER trg_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ödeme numarası otomatik oluşturma
CREATE OR REPLACE FUNCTION generate_payment_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_number IS NULL OR NEW.payment_number = '' THEN
        NEW.payment_number := 'PAY-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payments_number
    BEFORE INSERT ON payments
    FOR EACH ROW
    EXECUTE FUNCTION generate_payment_number();

-- Fatura numarası otomatik oluşturma
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL AND NEW.status = 'COMPLETED' THEN
        NEW.invoice_number := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEW.id::TEXT, 6, '0');
        NEW.invoice_date := CURRENT_DATE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payments_invoice
    BEFORE INSERT OR UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_number();
