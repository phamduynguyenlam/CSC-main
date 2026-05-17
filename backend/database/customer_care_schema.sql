CREATE DATABASE IF NOT EXISTS customer_care_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE customer_care_db;

CREATE TABLE customers (
  customer_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(150) NULL,
  date_of_birth DATE NULL,
  address TEXT NULL,
  notes TEXT NULL,
  previous_calls JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_customers_phone_number (phone_number)
);

CREATE TABLE products (
  product_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_code VARCHAR(50) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NULL,
  unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_products_product_code (product_code)
);

CREATE TABLE orders (
  order_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id BIGINT UNSIGNED NOT NULL,
  order_date DATETIME NOT NULL,
  order_status VARCHAR(50) NOT NULL DEFAULT 'completed',
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  payment_method VARCHAR(50) NULL,
  sales_channel VARCHAR(50) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  KEY idx_orders_customer_id (customer_id),
  KEY idx_orders_order_date (order_date)
);

CREATE TABLE order_items (
  order_item_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  line_total DECIMAL(12, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  KEY idx_order_items_order_id (order_id),
  KEY idx_order_items_product_id (product_id)
);

CREATE TABLE customer_call_logs (
  call_log_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  customer_id BIGINT UNSIGNED NOT NULL,
  call_time DATETIME NOT NULL,
  agent_name VARCHAR(150) NULL,
  call_type VARCHAR(50) NOT NULL DEFAULT 'inbound',
  call_summary TEXT NOT NULL,
  resolution_status VARCHAR(50) NULL,
  next_follow_up_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_call_logs_customer
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  KEY idx_call_logs_customer_id (customer_id),
  KEY idx_call_logs_call_time (call_time)
);

INSERT INTO customers (full_name, phone_number, email, address, notes, previous_calls)
VALUES
  (
    'Nguyen Van An',
    '0901234567',
    'an.nguyen@example.com',
    '12 Nguyen Trai, Quan 1, TP.HCM',
    'Khach hang than thiet',
    JSON_ARRAY(
      JSON_OBJECT(
        'call_id', 'CALL101',
        'customer_id', 'C001',
        'date', '2026-05-10',
        'issue_type', 'refund_request',
        'summary', 'Customer requested refund for delayed order',
        'sentiment', 'negative',
        'resolution', 'Refund pending',
        'agent_score', 72
      ),
      JSON_OBJECT(
        'call_id', 'CALL089',
        'customer_id', 'C001',
        'date', '2026-04-16',
        'issue_type', 'warranty_activation',
        'summary', 'Customer asked how to activate extended warranty package',
        'sentiment', 'neutral',
        'resolution', 'Resolved on call',
        'agent_score', 88
      )
    )
  ),
  (
    'Tran Thi Binh',
    '0912345678',
    'binh.tran@example.com',
    '45 Le Loi, Hai Chau, Da Nang',
    'Thuong mua qua hotline',
    JSON_ARRAY(
      JSON_OBJECT(
        'call_id', 'CALL102',
        'customer_id', 'C002',
        'date', '2026-04-29',
        'issue_type', 'delivery_delay',
        'summary', 'Customer reported a one-day delivery delay',
        'sentiment', 'negative',
        'resolution', 'Apology issued with voucher follow-up',
        'agent_score', 80
      )
    )
  ),
  (
    'Le Hoang Minh',
    '0933456789',
    'minh.le@example.com',
    '88 Vo Van Tan, Quan 3, TP.HCM',
    'Khach da lien he nhieu lan ve hoan tien don giao cham',
    JSON_ARRAY(
      JSON_OBJECT(
        'call_id', 'CALL201',
        'customer_id', 'C003',
        'date', '2026-05-14',
        'issue_type', 'refund_request',
        'summary', 'Customer called again because refund for delayed delivery has not been processed',
        'sentiment', 'negative',
        'resolution', 'Refund pending supervisor approval',
        'agent_score', 61
      ),
      JSON_OBJECT(
        'call_id', 'CALL188',
        'customer_id', 'C003',
        'date', '2026-05-09',
        'issue_type', 'delivery_delay',
        'summary', 'Customer reported a severe delivery delay and asked for escalation',
        'sentiment', 'negative',
        'resolution', 'Escalated to operations',
        'agent_score', 68
      )
    )
  ),
  (
    'Pham Ngoc Em',
    '0944567890',
    'em.pham@example.com',
    '21 Bach Dang, Hai Chau, Da Nang',
    'Khach nhay cam voi giao hang tre, can uu tien xin loi som',
    JSON_ARRAY(
      JSON_OBJECT(
        'call_id', 'CALL202',
        'customer_id', 'C004',
        'date', '2026-05-12',
        'issue_type', 'delivery_delay',
        'summary', 'Customer experienced second late delivery this month and requested compensation',
        'sentiment', 'negative',
        'resolution', 'Compensation review in progress',
        'agent_score', 65
      )
    )
  );

INSERT INTO products (product_code, product_name, category, unit_price)
VALUES
  ('SP001', 'Goi dich vu cham soc VIP', 'Dich vu', 1990000.00),
  ('SP002', 'Tai nghe bluetooth', 'Phu kien', 790000.00),
  ('SP003', 'Bao hanh mo rong 12 thang', 'Bao hanh', 299000.00);

INSERT INTO orders (customer_id, order_date, order_status, total_amount, payment_method, sales_channel)
VALUES
  (1, '2026-04-15 09:30:00', 'completed', 2780000.00, 'bank_transfer', 'website'),
  (2, '2026-04-28 14:15:00', 'completed', 790000.00, 'cash', 'hotline'),
  (3, '2026-05-08 18:40:00', 'delayed', 790000.00, 'e_wallet', 'app'),
  (4, '2026-05-11 16:05:00', 'delayed', 1990000.00, 'credit_card', 'app');

INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
  (1, 1, 1, 1990000.00),
  (1, 3, 1, 299000.00),
  (1, 2, 1, 790000.00),
  (2, 2, 1, 790000.00),
  (3, 2, 1, 790000.00),
  (4, 1, 1, 1990000.00);

INSERT INTO customer_call_logs (customer_id, call_time, agent_name, call_type, call_summary, resolution_status, next_follow_up_at)
VALUES
  (1, '2026-04-16 10:00:00', 'Le Minh Chau', 'inbound', 'Khach hoi ve cach kich hoat goi bao hanh mo rong sau khi mua.', 'resolved', NULL),
  (1, '2026-05-02 15:20:00', 'Pham Thu Ha', 'outbound', 'Nhan vien goi lai de xac nhan trai nghiem su dung va ghi nhan phan hoi tich cuc.', 'closed', NULL),
  (2, '2026-04-29 08:45:00', 'Nguyen Duc Long', 'inbound', 'Khach phan anh giao hang cham 1 ngay va da duoc xin loi kem voucher.', 'follow_up', '2026-05-06 09:00:00'),
  (3, '2026-05-09 19:05:00', 'Vo Thanh Nam', 'inbound', 'Khach phan nan don giao cham va yeu cau hoan tien.', 'escalated', '2026-05-10 10:00:00'),
  (3, '2026-05-14 09:10:00', 'Tran Mai Anh', 'inbound', 'Khach goi lai vi hoan tien van chua duoc xu ly.', 'pending', '2026-05-15 09:00:00'),
  (4, '2026-05-12 08:20:00', 'Le Quoc Bao', 'inbound', 'Khach than phien lan giao hang tre thu hai trong thang va doi boi thuong.', 'follow_up', '2026-05-12 14:00:00');

CREATE OR REPLACE VIEW customer_purchase_history AS
SELECT
  c.customer_id,
  c.full_name,
  c.phone_number,
  o.order_id,
  o.order_date,
  o.order_status,
  o.total_amount,
  p.product_code,
  p.product_name,
  oi.quantity,
  oi.unit_price,
  oi.line_total
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN order_items oi ON oi.order_id = o.order_id
JOIN products p ON p.product_id = oi.product_id;
