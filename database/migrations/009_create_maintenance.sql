-- ============================================================
-- Migration: 009_create_maintenance
-- Description: Periyodik bakım planı ve iş emri tabloları
-- ============================================================

-- ============================================================
-- Maintenance Plans (Periyodik Bakım Planları)
-- ============================================================

CREATE TABLE IF NOT EXISTS maintenance_plans (
    id                  SERIAL PRIMARY KEY,
    title               VARCHAR(150)    NOT NULL,
    description         TEXT,

    target_type         VARCHAR(20)     NOT NULL DEFAULT 'ROOM'
                            CHECK (target_type IN ('ROOM', 'FLOOR', 'FACILITY', 'EQUIPMENT')),
    room_id             INTEGER         REFERENCES rooms(id) ON DELETE SET NULL,
    facility_name       VARCHAR(100),

    frequency           VARCHAR(20)     NOT NULL
                            CHECK (frequency IN (
                                'DAILY', 'WEEKLY', 'BIWEEKLY',
                                'MONTHLY', 'QUARTERLY', 'ANNUALLY'
                            )),
    estimated_duration  INTEGER         CHECK (estimated_duration > 0), -- dakika cinsinden

    last_performed_at   DATE,
    next_due_date       DATE,

    assigned_department VARCHAR(50)
                            CHECK (assigned_department IN ('HOUSEKEEPING', 'ADMIN', NULL)),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_maint_plans_next_due    ON maintenance_plans(next_due_date);
CREATE INDEX idx_maint_plans_is_active   ON maintenance_plans(is_active);
CREATE INDEX idx_maint_plans_deleted_at  ON maintenance_plans(deleted_at);

CREATE TRIGGER trg_maint_plans_updated_at
    BEFORE UPDATE ON maintenance_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Work Orders (İş Emirleri)
-- ============================================================

CREATE TABLE IF NOT EXISTS work_orders (
    id                  SERIAL PRIMARY KEY,
    work_order_number   VARCHAR(30)     UNIQUE NOT NULL,

    -- Kaynak: bakım talebinden veya periyodik plandan oluşturulabilir
    source_request_id   INTEGER         REFERENCES maintenance_requests(id) ON DELETE SET NULL,
    source_plan_id      INTEGER         REFERENCES maintenance_plans(id)    ON DELETE SET NULL,

    room_id             INTEGER         REFERENCES rooms(id) ON DELETE SET NULL,
    assigned_to         INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    supervisor_id       INTEGER         REFERENCES users(id) ON DELETE SET NULL,

    title               VARCHAR(150)    NOT NULL,
    description         TEXT,
    category            VARCHAR(50)     NOT NULL
                            CHECK (category IN (
                                'ELECTRICAL', 'PLUMBING', 'HVAC',
                                'FURNITURE', 'APPLIANCE', 'STRUCTURAL',
                                'GENERAL', 'OTHER'
                            )),
    priority            VARCHAR(10)     NOT NULL DEFAULT 'NORMAL'
                            CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    status              VARCHAR(20)     NOT NULL DEFAULT 'OPEN'
                            CHECK (status IN (
                                'OPEN', 'IN_PROGRESS', 'ON_HOLD',
                                'PENDING_PARTS', 'COMPLETED', 'CANCELLED'
                            )),

    -- Maliyet
    estimated_cost      DECIMAL(10,2)   CHECK (estimated_cost >= 0),
    actual_cost         DECIMAL(10,2)   CHECK (actual_cost >= 0),
    parts_cost          DECIMAL(10,2)   DEFAULT 0,
    labor_cost          DECIMAL(10,2)   DEFAULT 0,

    -- Tarihler
    due_date            DATE,
    started_at          TIMESTAMP,
    completed_at        TIMESTAMP,

    -- Tamamlama notu
    resolution_notes    TEXT,
    completion_photos   TEXT[],          -- foto URL dizisi

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_wo_assigned_to     ON work_orders(assigned_to);
CREATE INDEX idx_wo_room_id         ON work_orders(room_id);
CREATE INDEX idx_wo_status          ON work_orders(status);
CREATE INDEX idx_wo_priority        ON work_orders(priority);
CREATE INDEX idx_wo_due_date        ON work_orders(due_date);
CREATE INDEX idx_wo_deleted_at      ON work_orders(deleted_at);

CREATE TRIGGER trg_wo_updated_at
    BEFORE UPDATE ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- İş emri numarası otomatik oluşturma
CREATE OR REPLACE FUNCTION generate_work_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.work_order_number IS NULL OR NEW.work_order_number = '' THEN
        NEW.work_order_number := 'WO-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(NEW.id::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_wo_number
    BEFORE INSERT ON work_orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_work_order_number();
