import pool from '../../config/db.js';

export async function getDashboard() {
  const [today, counts, lowStock, containers, customers, salesPerDay, topProducts, ordersByStatus, topCustomers] =
    await Promise.all([
      pool.query(
        `SELECT
           COUNT(*)::int AS orders_today,
           COALESCE(SUM(total), 0)::float AS sales_today
         FROM orders
         WHERE status <> 'CANCELLED'
           AND created_at >= CURRENT_DATE`
      ),
      pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending,
           COUNT(*) FILTER (WHERE status = 'OUT_FOR_DELIVERY')::int AS out_for_delivery,
           COUNT(*) FILTER (WHERE status = 'DELIVERED')::int AS delivered
         FROM orders`
      ),
      pool.query(
        `SELECT name, stock FROM products
         WHERE active = TRUE AND stock <= 10
         ORDER BY stock ASC LIMIT 10`
      ),
      pool.query(
        `SELECT
           COALESCE(SUM(CASE WHEN type = 'DELIVERED' THEN quantity ELSE 0 END), 0)::int AS delivered,
           COALESCE(SUM(CASE WHEN type = 'RETURNED' THEN quantity ELSE 0 END), 0)::int AS returned
         FROM container_movements`
      ),
      pool.query(
        `SELECT
           COUNT(*)::int AS customers,
           (SELECT COUNT(*)::int FROM users u JOIN roles r ON r.id = u.role_id WHERE r.name = 'DRIVER' AND u.active) AS drivers
         FROM customers`
      ),
      pool.query(
        `SELECT to_char(created_at, 'YYYY-MM-DD') AS day,
                COUNT(*)::int AS orders,
                COALESCE(SUM(total), 0)::float AS revenue
           FROM orders
          WHERE status <> 'CANCELLED' AND created_at >= NOW() - INTERVAL '14 days'
          GROUP BY day
          ORDER BY day`
      ),
      pool.query(
        `SELECT p.name, SUM(oi.quantity)::int AS quantity, SUM(oi.subtotal)::float AS revenue
           FROM order_items oi
           JOIN products p ON p.id = oi.product_id
           JOIN orders o ON o.id = oi.order_id
          WHERE o.status <> 'CANCELLED'
          GROUP BY p.id, p.name
          ORDER BY quantity DESC
          LIMIT 5`
      ),
      pool.query(
        `SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status`
      ),
      pool.query(
        `SELECT c.id, u.name, COUNT(o.id)::int AS orders, COALESCE(SUM(o.total), 0)::float AS spent
           FROM customers c
           JOIN users u ON u.id = c.user_id
           LEFT JOIN orders o ON o.customer_id = c.id AND o.status <> 'CANCELLED'
          GROUP BY c.id, u.name
          ORDER BY orders DESC
          LIMIT 5`
      ),
    ]);

  const containerSummary = containers.rows[0];
  const pendingContainers = Math.max(0, containerSummary.delivered - containerSummary.returned);

  return {
    cards: {
      ordersToday: today.rows[0].orders_today,
      salesToday: today.rows[0].sales_today,
      pendingOrders: counts.rows[0].pending,
      outForDelivery: counts.rows[0].out_for_delivery,
      deliveredOrders: counts.rows[0].delivered,
      customers: customers.rows[0].customers,
      drivers: customers.rows[0].drivers,
      pendingContainers,
    },
    lowStock: lowStock.rows,
    salesPerDay: salesPerDay.rows,
    topProducts: topProducts.rows,
    ordersByStatus: ordersByStatus.rows,
    topCustomers: topCustomers.rows,
  };
}
