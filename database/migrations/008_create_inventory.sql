-- ============================================================
-- Migration: 008_create_inventory
-- Description: Envanter ve stok hareket tabloları
-- ============================================================

-- ============================================================
-- Inventory Items (Envanter Kalemleri)
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_items (
    id                  SERIAL PRIMARY KEY,
    sku                 VARCHAR(50)     UNIQUE NOT NULL,
    name                VARCHAR(150)    NOT NULL,
    description         TEXT,
    category            VARCHAR(50)     NOT NULL
                            CHECK (category IN (
                                'LINEN', 'TOILETRIES', 'MINIBAR',
                                'CLEANING_SUPPLIES', 'MAINTENANCE',
                                'OFFICE', 'FOOD_BEVERAGE', 'OTHER'
                            )),
    department          VARCHAR(50)
                            CHECK (department IN ('FRONTOFFICE', 'HOUSEKEEPING', 'FINANCE', 'ADMIN', NULL)),

    -- Stok bilgileri
    unit                VARCHAR(20)     NOT NULL DEFAULT 'PIECE'
                            CHECK (unit IN ('PIECE', 'BOX', 'KG', 'LITER', 'PACK', 'DOZEN', 'ROLL')),
    quantity_in_stock   INTEGER         NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
    minimum_stock       INTEGER         NOT NULL DEFAULT 0 CHECK (minimum_stock >= 0),
    maximum_stock       INTEGER         CHECK (maximum_stock >= minimum_stock),
    reorder_point       INTEGER         CHECK (reorder_point >= 0),
    reorder_quantity    INTEGER         CHECK (reorder_quantity > 0),

    -- Maliyet
    unit_cost           DECIMAL(10,2)   CHECK (unit_cost >= 0),
    currency            VARCHAR(3)      NOT NULL DEFAULT 'TRY',
    supplier_name       VARCHAR(150),
    supplier_contact    VARCHAR(150),

    -- Lokasyon
    storage_location    VARCHAR(100),
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,

    last_restock_date   DATE,
    expiry_date         DATE,

    notes               TEXT,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at          TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_inventory_sku          ON inventory_items(sku);
CREATE INDEX idx_inventory_category     ON inventory_items(category);
CREATE INDEX idx_inventory_department   ON inventory_items(department);
CREATE INDEX idx_inventory_is_active    ON inventory_items(is_active);
CREATE INDEX idx_inventory_deleted_at   ON inventory_items(deleted_at);

-- Low-stock view için bileşik index
CREATE INDEX idx_inventory_stock_check  ON inventory_items(quantity_in_stock, minimum_stock);

CREATE TRIGGER trg_inventory_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Inventory Transactions (Stok Hareketleri)
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id                  SERIAL PRIMARY KEY,
    item_id             INTEGER         NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,

    transaction_type    VARCHAR(20)     NOT NULL
                            CHECK (transaction_type IN (
                                'RESTOCK', 'USAGE', 'DISPOSAL',
                                'TRANSFER', 'ADJUSTMENT', 'RETURN'
                            )),
    quantity            INTEGER         NOT NULL CHECK (quantity != 0),
    quantity_before     INTEGER         NOT NULL,
    quantity_after      INTEGER         NOT NULL CHECK (quantity_after >= 0),

    unit_cost           DECIMAL(10,2)   CHECK (unit_cost >= 0),
    total_cost          DECIMAL(12,2)   CHECK (total_cost >= 0),

    -- İlişkili kayıt
    related_room_id         INTEGER     REFERENCES rooms(id)       ON DELETE SET NULL,
    related_task_id         INTEGER     REFERENCES housekeeping_tasks(id) ON DELETE SET NULL,
    related_reservation_id  INTEGER     REFERENCES reservations(id) ON DELETE SET NULL,

    reference_number    VARCHAR(50),
    notes               TEXT,

    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- Inventory_transactions immutable olduğu için updated_at yok
-- Indexes
CREATE INDEX idx_inv_tx_item_id     ON inventory_transactions(item_id);
CREATE INDEX idx_inv_tx_type        ON inventory_transactions(transaction_type);
CREATE INDEX idx_inv_tx_created_at  ON inventory_transactions(created_at);
CREATE INDEX idx_inv_tx_room_id     ON inventory_transactions(related_room_id);

-- Stok otomatik güncelleme trigger
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inventory_items
    SET quantity_in_stock = NEW.quantity_after,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.item_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_inventory_stock_update
    AFTER INSERT ON inventory_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_stock();
