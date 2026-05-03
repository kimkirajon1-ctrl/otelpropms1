-- ============================================================
-- Migration: 011_create_audit_logs
-- Description: Kritik tablo audit log sistemi
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id                  BIGSERIAL PRIMARY KEY,
    table_name          VARCHAR(80)     NOT NULL,
    record_id           INTEGER         NOT NULL,
    action              VARCHAR(10)     NOT NULL
                            CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),

    -- Kim yaptı
    performed_by        INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    performed_at        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address          VARCHAR(45),    -- IPv4 ve IPv6 destekli
    user_agent          TEXT,

    -- Ne değişti
    old_values          JSONB,
    new_values          JSONB,
    changed_fields      TEXT[],         -- Sadece değişen kolon isimleri

    -- Oturum bilgisi
    session_id          VARCHAR(100),

    -- Audit log immutable — güncelleme ve soft delete yok
    CONSTRAINT chk_audit_values CHECK (
        (action = 'INSERT' AND old_values IS NULL AND new_values IS NOT NULL) OR
        (action = 'UPDATE' AND old_values IS NOT NULL AND new_values IS NOT NULL) OR
        (action = 'DELETE' AND old_values IS NOT NULL AND new_values IS NULL)
    )
);

-- Indexes
CREATE INDEX idx_audit_table_name   ON audit_logs(table_name);
CREATE INDEX idx_audit_record_id    ON audit_logs(record_id);
CREATE INDEX idx_audit_performed_by ON audit_logs(performed_by);
CREATE INDEX idx_audit_performed_at ON audit_logs(performed_at);
CREATE INDEX idx_audit_action       ON audit_logs(action);

-- Bileşik index: belirli bir kayıttaki tüm değişiklikleri hızlı getirmek için
CREATE INDEX idx_audit_table_record ON audit_logs(table_name, record_id);

-- ============================================================
-- Audit Trigger Factory
-- Kritik tablolara tek fonksiyonla trigger eklenir
-- ============================================================

CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    v_old_values    JSONB;
    v_new_values    JSONB;
    v_changed_fields TEXT[];
    v_key           TEXT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        v_old_values := NULL;
        v_new_values := to_jsonb(NEW);

    ELSIF TG_OP = 'UPDATE' THEN
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);

        -- Sadece değişen kolonları tespit et
        FOR v_key IN SELECT key FROM jsonb_each(v_old_values) LOOP
            IF (v_old_values -> v_key) IS DISTINCT FROM (v_new_values -> v_key) THEN
                v_changed_fields := array_append(v_changed_fields, v_key);
            END IF;
        END LOOP;

        -- Hiçbir şey değişmediyse log atma
        IF v_changed_fields IS NULL THEN
            RETURN NEW;
        END IF;

        -- updated_at tek değişiklikse log atma
        IF v_changed_fields = ARRAY['updated_at'] THEN
            RETURN NEW;
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
    END IF;

    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        performed_by,
        old_values,
        new_values,
        changed_fields
    )
    VALUES (
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'DELETE' THEN (v_old_values->>'id')::INTEGER
            ELSE (v_new_values->>'id')::INTEGER
        END,
        TG_OP,
        NULLIF(current_setting('app.current_user_id', TRUE), '')::INTEGER,
        v_old_values,
        v_new_values,
        v_changed_fields
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Kritik tablolara audit trigger ekleme
-- ============================================================

-- reservations
CREATE TRIGGER trg_audit_reservations
    AFTER INSERT OR UPDATE OR DELETE ON reservations
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- payments
CREATE TRIGGER trg_audit_payments
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- guests
CREATE TRIGGER trg_audit_guests
    AFTER INSERT OR UPDATE OR DELETE ON guests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- users
CREATE TRIGGER trg_audit_users
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- rooms
CREATE TRIGGER trg_audit_rooms
    AFTER INSERT OR UPDATE OR DELETE ON rooms
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- room_rates
CREATE TRIGGER trg_audit_room_rates
    AFTER INSERT OR UPDATE OR DELETE ON room_rates
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- financial_reports
CREATE TRIGGER trg_audit_financial_reports
    AFTER INSERT OR UPDATE OR DELETE ON financial_reports
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ============================================================
-- Session helper: Node.js'ten user id set etmek için
-- Her API isteğinin başında çağrılır:
-- SET LOCAL app.current_user_id = '<user_id>';
-- ============================================================
