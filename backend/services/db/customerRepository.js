import { query } from './mysql.js';

function parsePreviousCalls(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function mapOrders(rows) {
  const orderMap = new Map();

  rows.forEach((row) => {
    if (!orderMap.has(row.order_id)) {
      orderMap.set(row.order_id, {
        order_id: row.order_id,
        order_date: row.order_date,
        order_status: row.order_status,
        total_amount: Number(row.total_amount),
        payment_method: row.payment_method,
        sales_channel: row.sales_channel,
        items: [],
      });
    }

    if (row.product_id) {
      orderMap.get(row.order_id).items.push({
        product_id: row.product_id,
        product_code: row.product_code,
        product_name: row.product_name,
        category: row.category,
        quantity: row.quantity,
        unit_price: Number(row.unit_price),
        line_total: Number(row.line_total),
      });
    }
  });

  return Array.from(orderMap.values());
}

function mapCallLogs(rows) {
  return rows.map((row) => ({
    call_log_id: row.call_log_id,
    customer_id: row.customer_id,
    call_time: row.call_time,
    agent_name: row.agent_name,
    call_type: row.call_type,
    call_summary: row.call_summary,
    resolution_status: row.resolution_status,
    next_follow_up_at: row.next_follow_up_at,
  }));
}

async function getCustomerById(customerId) {
  const rows = await query(
    `SELECT customer_id, full_name, phone_number, email, date_of_birth, address, notes, previous_calls, created_at, updated_at
     FROM customers
     WHERE customer_id = ?
     LIMIT 1`,
    [customerId]
  );

  const customer = rows[0];
  if (!customer) {
    return null;
  }

  return {
    ...customer,
    previous_calls: parsePreviousCalls(customer.previous_calls),
  };
}

async function getOrdersByCustomerId(customerId) {
  const rows = await query(
    `SELECT
       o.order_id,
       o.order_date,
       o.order_status,
       o.total_amount,
       o.payment_method,
       o.sales_channel,
       p.product_id,
       p.product_code,
       p.product_name,
       p.category,
       oi.quantity,
       oi.unit_price,
       oi.line_total
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.order_id
     LEFT JOIN products p ON p.product_id = oi.product_id
     WHERE o.customer_id = ?
     ORDER BY o.order_date DESC, o.order_id DESC, oi.order_item_id ASC`,
    [customerId]
  );

  return mapOrders(rows);
}

async function getCallLogsByCustomerId(customerId) {
  const rows = await query(
    `SELECT
       call_log_id,
       customer_id,
       call_time,
       agent_name,
       call_type,
       call_summary,
       resolution_status,
       next_follow_up_at
     FROM customer_call_logs
     WHERE customer_id = ?
     ORDER BY call_time DESC, call_log_id DESC`,
    [customerId]
  );

  return mapCallLogs(rows);
}

export async function getCustomerContextByCustomerId(customerId) {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    return null;
  }

  const [orders, callLogs] = await Promise.all([
    getOrdersByCustomerId(customer.customer_id),
    getCallLogsByCustomerId(customer.customer_id),
  ]);

  return {
    customer,
    orders,
    call_logs: callLogs,
  };
}

export async function getCustomerContextByPhoneNumber(phoneNumber) {
  const rows = await query(
    `SELECT customer_id
     FROM customers
     WHERE phone_number = ?
     LIMIT 1`,
    [phoneNumber]
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return getCustomerContextByCustomerId(row.customer_id);
}

export async function getCustomerContextByCallLogId(callLogId) {
  const rows = await query(
    `SELECT customer_id
     FROM customer_call_logs
     WHERE call_log_id = ?
     LIMIT 1`,
    [callLogId]
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return getCustomerContextByCustomerId(row.customer_id);
}

export default {
  getCustomerContextByCallLogId,
  getCustomerContextByCustomerId,
  getCustomerContextByPhoneNumber,
};
