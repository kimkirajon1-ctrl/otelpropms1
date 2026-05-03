-- ============================================================
-- Migration: 005_create_housekeeping
-- Description: Housekeeping görev ve bakım tabloları
-- ============================================================

-- ============================================================
-- Housekeeping Tasks (Temizlik Görevleri)
-- ============================================================

CREATE TABLE IF NOT EXISTS housekeeping_tasks (
    id                  SERIAL PRIMARY KEY,
    room_id             INTEGER         NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    assigned_to         INTEGER         REFERENCES users(id) ON DELETE SET NULL,

    task_type           VARCHAR(30)     NOT NULL
                            CHECK (task_type IN (
                                'DAILY_CLEANING', 'DEEP_CLEANING',
                                'CHECKOUT_CLEANING', 'TURNDOWN',
                                'INSPECTION', 'LINEN_CHANGE'
                            )),
    priority            VARCHAR(10)     NOT NULL DEFAULT 'NORMAL'
                            CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    status              VARCHAR(20)     NOT NULL DEFAULT 'PENDING'
                            CHECK (status IN (
                                'PENDING', 'IN_PROGRESS', 'COMPLETED',
                                'SKIPPED', 'CANCELLED'
                            )),

    scheduled_date      DATE            NOT NULL,
    scheduled_time      TIME,
    started_at          TIMESTAMP,
    completed_at        TIMESTAMP,

    -- Tamamlama bilgileri
    checklist           JSONB,           -- { "bed_made": true, "bathroom_clean": false, ... }
    quality_score       SMALLINT         CHECK (quality_score BETWEEN 1 AND 5),
    inspected_by        INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    inspected_at        TIMESTAMP,

    -- Kullanılan malzeme
    supplies_used       JSONB,           -- [{ "item": "towels", "quantity": 4 }, ...]
    notes               TEXT,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_hk_tasks_room_id       ON housekeeping_tasks(room_id);
CREATE INDEX idx_hk_tasks_assigned_to   ON housekeeping_tasks(assigned_to);
CREATE INDEX idx_hk_tasks_status        ON housekeeping_tasks(status);
CREATE INDEX idx_hk_tasks_scheduled     ON housekeeping_tasks(scheduled_date);
CREATE INDEX idx_hk_tasks_priority      ON housekeeping_tasks(priority);
CREATE INDEX idx_hk_tasks_deleted_at    ON housekeeping_tasks(deleted_at);

CREATE TRIGGER trg_hk_tasks_updated_at
    BEFORE UPDATE ON housekeeping_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Maintenance Requests (Bakım/Arıza Talepleri)
-- ============================================================

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id                  SERIAL PRIMARY KEY,
    room_id             INTEGER         REFERENCES rooms(id) ON DELETE SET NULL,
    reported_by         INTEGER         NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_to         INTEGER         REFERENCES users(id) ON DELETE SET NULL,

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
                                'COMPLETED', 'CANCELLED'
                            )),

    title               VARCHAR(150)    NOT NULL,
    description         TEXT            NOT NULL,
    resolution_notes    TEXT,

    estimated_cost      DECIMAL(10,2)   CHECK (estimated_cost >= 0),
    actual_cost         DECIMAL(10,2)   CHECK (actual_cost >= 0),

    reported_at         TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at          TIMESTAMP,
    completed_at        TIMESTAMP,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_maint_room_id      ON maintenance_requests(room_id);
CREATE INDEX idx_maint_assigned_to  ON maintenance_requests(assigned_to);
CREATE INDEX idx_maint_status       ON maintenance_requests(status);
CREATE INDEX idx_maint_priority     ON maintenance_requests(priority);
CREATE INDEX idx_maint_category     ON maintenance_requests(category);
CREATE INDEX idx_maint_deleted_at   ON maintenance_requests(deleted_at);

CREATE TRIGGER trg_maintenance_updated_at
    BEFORE UPDATE ON maintenance_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
