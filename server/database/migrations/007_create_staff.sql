CREATE TABLE IF NOT EXISTS staff_details (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    salary DECIMAL(10, 2),
    hire_date DATE,
    department VARCHAR(50),
    shift_info VARCHAR(100),
    emergency_contact VARCHAR(100)
);
