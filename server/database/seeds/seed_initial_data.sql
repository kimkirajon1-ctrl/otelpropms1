-- Örnek Misafir
INSERT INTO guests (first_name, last_name, id_number, email, phone) VALUES
('Ahmet', 'Yılmaz', '12345678901', 'ahmet@email.com', '05551112233');

-- Örnek Rezervasyon (Oda 101 için)
INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, total_price, status) VALUES
(1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', 4500.00, 'CONFIRMED');

-- Örnek Envanter
INSERT INTO inventory (item_name, category, quantity, min_stock_level, unit_price) VALUES
('Şampuan 50ml', 'AMENITY', 500, 100, 15.00),
('Çarşaf Çift Kişilik', 'LINEN', 100, 20, 450.00),
('Genel Temizlik Sıvısı', 'CLEANING_SUPPLY', 20, 5, 120.00);
