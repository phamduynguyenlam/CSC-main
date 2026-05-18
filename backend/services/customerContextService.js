function toIsoDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toISOString();
}

function normalizePreviousCalls(previousCalls = []) {
  return previousCalls.map((call, index) => ({
    source: 'customer_previous_calls',
    sort_key: `${call.date || ''}-${index}`,
    call_id: call.call_id || null,
    customer_id: call.customer_id || null,
    date: call.date || null,
    issue_type: call.issue_type || null,
    summary: call.summary || null,
    sentiment: call.sentiment || null,
    resolution: call.resolution || null,
    agent_score: call.agent_score ?? null,
  }));
}

function normalizeCallLogs(callLogs = []) {
  return callLogs.map((call) => ({
    source: 'customer_call_logs',
    sort_key: toIsoDate(call.call_time) || '',
    call_log_id: call.call_log_id,
    date: toIsoDate(call.call_time),
    issue_type: call.call_type,
    summary: call.call_summary,
    sentiment: null,
    resolution: call.resolution_status,
    agent_name: call.agent_name,
    next_follow_up_at: toIsoDate(call.next_follow_up_at),
  }));
}

function compactOrders(orders = []) {
  return orders.slice(0, 3).map((order) => ({
    order_id: order.order_id,
    order_date: toIsoDate(order.order_date),
    order_status: order.order_status,
    total_amount: order.total_amount,
    payment_method: order.payment_method,
    sales_channel: order.sales_channel,
    items: order.items.slice(0, 5).map((item) => ({
      product_name: item.product_name,
      category: item.category,
      quantity: item.quantity,
      line_total: item.line_total,
    })),
  }));
}

function compactCalls(customer = {}, callLogs = []) {
  const previousCalls = normalizePreviousCalls(customer.previous_calls);
  const logCalls = normalizeCallLogs(callLogs);

  return [...previousCalls, ...logCalls]
    .sort((a, b) => String(b.sort_key).localeCompare(String(a.sort_key)))
    .slice(0, 5)
    .map(({ sort_key, ...call }) => call);
}

export function buildCompactCustomerContext(rawContext) {
  const { customer, orders, call_logs: callLogs } = rawContext;
  const compactRecentOrders = compactOrders(orders);
  const compactRecentCalls = compactCalls(customer, callLogs);

  const unresolvedIssues = compactRecentCalls
    .filter((call) => {
      const resolution = String(call.resolution || '').toLowerCase();
      return resolution && !['resolved', 'closed', 'done'].includes(resolution);
    })
    .map((call) => ({
      date: call.date,
      issue_type: call.issue_type,
      resolution: call.resolution,
      summary: call.summary,
    }))
    .slice(0, 3);

  return {
    customer_profile: {
      customer_id: customer.customer_id,
      full_name: customer.full_name,
      phone_number: customer.phone_number,
      email: customer.email,
      address: customer.address,
      notes: customer.notes,
    },
    account_summary: {
      total_orders: orders.length,
      total_logged_calls: callLogs.length,
      total_previous_calls: Array.isArray(customer.previous_calls) ? customer.previous_calls.length : 0,
      unresolved_issue_count: unresolvedIssues.length,
    },
    recent_orders: compactRecentOrders,
    recent_calls: compactRecentCalls,
    unresolved_issues: unresolvedIssues,
  };
}

export default {
  buildCompactCustomerContext,
};
