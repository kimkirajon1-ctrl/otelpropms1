-- ============================================================
-- Migration: 010_create_reports
-- Description: Finansal raporlar ve günlük özet tabloları
-- ============================================================

-- ============================================================
-- Financial Reports (Finansal Raporlar)
-- ============================================================

CREATE TABLE IF NOT EXISTS financial_reports (
    id                  SERIAL PRIMARY KEY,
    report_type         VARCHAR(30)     NOT NULL
                            CHECK (report_type IN (
                                'DAILY', 'WEEKLY', 'MONTHLY',
                                'QUARTERLY', 'ANNUAL', 'CUSTOM'
                            )),
    report_date         DATE            NOT NULL,
    period_start        DATE            NOT NULL,
    period_end          DATE            NOT NULL,

    -- Gelir kalemleri
    room_revenue        DECIMAL(12,2)   NOT NULL DEFAULT 0,
    food_beverage_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
    extra_services_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
    total_revenue       DECIMAL(12,2)   NOT NULL DEFAULT 0,

    -- Gider kalemleri
    room_cost           DECIMAL(12,2)   NOT NULL DEFAULT 0,
    staff_cost          DECIMAL(12,2)   NOT NULL DEFAULT 0,
    maintenance_cost    DECIMAL(12,2)   NOT NULL DEFAULT 0,
    utilities_cost      DECIMAL(12,2)   NOT NULL DEFAULT 0,
    supplies_cost       DECIMAL(12,2)   NOT NULL DEFAULT 0,
    other_cost          DECIMAL(12,2)   NOT NULL DEFAULT 0,
    total_cost          DECIMAL(12,2)   NOT NULL DEFAULT 0,

    -- Net
    gross_profit        DECIMAL(12,2)   GENERATED ALWAYS AS (total_revenue - total_cost) STORED,
    tax_collected       DECIMAL(12,2)   NOT NULL DEFAULT 0,
    net_profit          DECIMAL(12,2)   NOT NULL DEFAULT 0,

    -- KPI
    occupancy_rate      DECIMAL(5,2)    CHECK (occupancy_rate BETWEEN 0 AND 100),
    adr                 DECIMAL(10,2),  -- Average Daily Rate
    rev_par             DECIMAL(10,2),  -- Revenue Per Available Room
    total_reservations  INTEGER         NOT NULL DEFAULT 0,
    total_checkins      INTEGER         NOT NULL DEFAULT 0,
    total_checkouts     INTEGER         NOT NULL DEFAULT 0,
    total_cancellations INTEGER         NOT NULL DEFAULT 0,

    currency            VARCHAR(3)      NOT NULL DEFAULT 'TRY',
    status              VARCHAR(15)     NOT NULL DEFAULT 'DRAFT'
                            CHECK (status IN ('DRAFT', 'FINALIZED', 'APPROVED')),
    approved_by         INTEGER         REFERENCES users(id) ON DELETE SET NULL,
    approved_at         TIMESTAMP,
    notes               TEXT,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_report_period    CHECK (period_end >= period_start),
    CONSTRAINT uq_report_period     UNIQUE (report_type, period_start, period_end)
);

CREATE INDEX idx_fin_reports_type       ON financial_reports(report_type);
CREATE INDEX idx_fin_reports_date       ON financial_reports(report_date);
CREATE INDEX idx_fin_reports_status     ON financial_reports(status);
CREATE INDEX idx_fin_reports_deleted_at ON financial_reports(deleted_at);

CREATE TRIGGER trg_fin_reports_updated_at
    BEFORE UPDATE ON financial_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Daily Statistics (Günlük İstatistikler - Snapshot)
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_statistics (
    id                  SERIAL PRIMARY KEY,
    stat_date           DATE            UNIQUE NOT NULL,

    -- Oda durumu
    total_rooms         INTEGER         NOT NULL DEFAULT 0,
    occupied_rooms      INTEGER         NOT NULL DEFAULT 0,
    available_rooms     INTEGER         NOT NULL DEFAULT 0,
    maintenance_rooms   INTEGER         NOT NULL DEFAULT 0,
    cleaning_rooms      INTEGER         NOT NULL DEFAULT 0,
    occupancy_rate      DECIMAL(5,2)    CHECK (occupancy_rate BETWEEN 0 AND 100),

    -- Rezervasyon
    new_reservations    INTEGER         NOT NULL DEFAULT 0,
    checkins_today      INTEGER         NOT NULL DEFAULT 0,
    checkouts_today     INTEGER         NOT NULL DEFAULT 0,
    cancellations_today INTEGER         NOT NULL DEFAULT 0,
    no_shows_today      INTEGER         NOT NULL DEFAULT 0,

    -- Gelir
    revenue_today       DECIMAL(12,2)   NOT NULL DEFAULT 0,
    payments_today      DECIMAL(12,2)   NOT NULL DEFAULT 0,

    -- Housekeeping
    cleaning_tasks_total    INTEGER     NOT NULL DEFAULT 0,
    cleaning_tasks_done     INTEGER     NOT NULL DEFAULT 0,
    maintenance_open        INTEGER     NOT NULL DEFAULT 0,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_daily_stat_date    ON daily_statistics(stat_date);

CREATE TRIGGER trg_daily_stats_updated_at
    BEFORE UPDATE ON daily_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
