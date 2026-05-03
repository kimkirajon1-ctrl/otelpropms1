CREATE TABLE IF NOT EXISTS daily_reports (
    id SERIAL PRIMARY KEY,
    report_date DATE UNIQUE DEFAULT CURRENT_DATE,
    total_occupancy INTEGER,
    total_revenue DECIMAL(12, 2),
    new_reservations INTEGER,
    check_ins INTEGER,
    check_outs INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
