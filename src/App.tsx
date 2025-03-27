import React, { useState } from 'react';
import { Database, Play, Clock, Table as TableIcon } from 'lucide-react';
import Editor from '@monaco-editor/react';
import styles from './styles.module.css';

// Sample queries
const SAMPLE_QUERIES = [
  {
    id: 1,
    name: 'Active Users Analysis',
    query: `SELECT 
  u.id,
  u.full_name,
  u.email,
  COUNT(o.id) as total_orders,
  SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
  AND o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.full_name, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 10;`,
    data: {
      columns: ['id', 'full_name', 'email', 'total_orders', 'total_spent'],
      rows: [
        [1, 'John Doe', 'john@example.com', 12, '$2,450.00'],
        [2, 'Sarah Connor', 'sarah@example.com', 8, '$1,875.50'],
        [3, 'Michael Scott', 'michael@example.com', 6, '$1,540.75'],
        [4, 'Lisa Anderson', 'lisa@example.com', 5, '$1,230.25'],
        [5, 'James Wilson', 'james@example.com', 4, '$985.00'],
      ],
    },
  },
  {
    id: 2,
    name: 'Product Performance',
    query: `WITH monthly_sales AS (
  SELECT 
    p.id,
    p.name,
    p.category,
    DATE_TRUNC('month', o.created_at) as sale_month,
    SUM(oi.quantity) as units_sold,
    SUM(oi.quantity * oi.unit_price) as revenue
  FROM products p
  JOIN order_items oi ON p.id = oi.product_id
  JOIN orders o ON oi.order_id = o.id
  WHERE o.status = 'completed'
    AND o.created_at >= NOW() - INTERVAL '6 months'
  GROUP BY p.id, p.name, p.category, sale_month
)
SELECT 
  name,
  category,
  SUM(units_sold) as total_units,
  SUM(revenue) as total_revenue,
  AVG(revenue) as avg_monthly_revenue
FROM monthly_sales
GROUP BY id, name, category
ORDER BY total_revenue DESC
LIMIT 10;`,
    data: {
      columns: ['name', 'category', 'total_units', 'total_revenue', 'avg_monthly_revenue'],
      rows: [
        ['iPhone 13 Pro', 'Electronics', 1250, '$1,562,500.00', '$260,416.67'],
        ['MacBook Air M1', 'Electronics', 845, '$1,098,500.00', '$183,083.33'],
        ['AirPods Pro', 'Electronics', 2300, '$689,000.00', '$114,833.33'],
        ['Nike Air Max', 'Footwear', 1560, '$234,000.00', '$39,000.00'],
        ['Samsung TV 4K', 'Electronics', 425, '$212,500.00', '$35,416.67'],
      ],
    },
  },
  {
    id: 3,
    name: 'Customer Cohort Analysis',
    query: `WITH user_cohorts AS (
  SELECT 
    DATE_TRUNC('month', created_at) as cohort_month,
    id as user_id
  FROM users
),
user_activities AS (
  SELECT 
    u.user_id,
    u.cohort_month,
    DATE_TRUNC('month', o.created_at) as activity_month,
    COUNT(DISTINCT o.id) as orders,
    SUM(o.total_amount) as revenue
  FROM user_cohorts u
  JOIN orders o ON u.user_id = o.user_id
  GROUP BY u.user_id, u.cohort_month, activity_month
)
SELECT 
  cohort_month,
  COUNT(DISTINCT user_id) as cohort_size,
  SUM(orders) as total_orders,
  SUM(revenue) as total_revenue,
  SUM(revenue) / COUNT(DISTINCT user_id) as revenue_per_user
FROM user_activities
GROUP BY cohort_month
ORDER BY cohort_month DESC
LIMIT 12;`,
    data: {
      columns: ['cohort_month', 'cohort_size', 'total_orders', 'total_revenue', 'revenue_per_user'],
      rows: [
        ['2024-03', 1250, 2450, '$245,000.00', '$196.00'],
        ['2024-02', 1100, 3300, '$330,000.00', '$300.00'],
        ['2024-01', 950, 4275, '$427,500.00', '$450.00'],
        ['2023-12', 875, 5250, '$525,000.00', '$600.00'],
        ['2023-11', 800, 5600, '$560,000.00', '$700.00'],
      ],
    },
  },
  {
    id: 4,
    name: 'Inventory Analysis',
    query: `WITH inventory_metrics AS (
  SELECT 
    p.id,
    p.name,
    p.category,
    p.current_stock,
    p.reorder_point,
    p.unit_cost,
    COALESCE(SUM(oi.quantity), 0) as units_sold_30d
  FROM products p
  LEFT JOIN order_items oi ON p.id = oi.product_id
  LEFT JOIN orders o ON oi.order_id = o.id
  WHERE o.created_at >= NOW() - INTERVAL '30 days'
    OR o.created_at IS NULL
  GROUP BY p.id, p.name, p.category, p.current_stock, p.reorder_point, p.unit_cost
)
SELECT 
  name,
  category,
  current_stock,
  units_sold_30d,
  ROUND(units_sold_30d::numeric / 30, 2) as avg_daily_demand,
  CASE 
    WHEN current_stock < reorder_point THEN 'Reorder Required'
    WHEN current_stock < (units_sold_30d * 1.5) THEN 'Low Stock'
    ELSE 'Sufficient Stock'
  END as stock_status,
  current_stock * unit_cost as inventory_value
FROM inventory_metrics
ORDER BY 
  CASE 
    WHEN current_stock < reorder_point THEN 1
    WHEN current_stock < (units_sold_30d * 1.5) THEN 2
    ELSE 3
  END,
  units_sold_30d DESC;`,
    data: {
      columns: ['name', 'category', 'current_stock', 'units_sold_30d', 'avg_daily_demand', 'stock_status', 'inventory_value'],
      rows: [
        ['iPhone 13 Pro', 'Electronics', 50, 125, 4.17, 'Reorder Required', '$49,500.00'],
        ['AirPods Pro', 'Electronics', 75, 230, 7.67, 'Low Stock', '$22,500.00'],
        ['Nike Air Max', 'Footwear', 120, 156, 5.20, 'Low Stock', '$18,000.00'],
        ['MacBook Air M1', 'Electronics', 200, 85, 2.83, 'Sufficient Stock', '$260,000.00'],
        ['Samsung TV 4K', 'Electronics', 150, 42, 1.40, 'Sufficient Stock', '$75,000.00'],
      ],
    },
  },
];

function App() {
  const [selectedQuery, setSelectedQuery] = useState(SAMPLE_QUERIES[0]);
  const [queryText, setQueryText] = useState(SAMPLE_QUERIES[0].query);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const handleExecuteQuery = () => {
    // Simulate query execution time
    const startTime = performance.now();
    setTimeout(() => {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
    }, 500);
  };

  const handleQuerySelect = (query: typeof SAMPLE_QUERIES[0]) => {
    setSelectedQuery(query);
    setQueryText(query.query);
    setExecutionTime(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Database size={24} />
        <h1 className={styles.title}>SQL Query Editor</h1>
      </header>

      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <ul className={styles.queryList}>
            {SAMPLE_QUERIES.map((query) => (
              <li
                key={query.id}
                className={`${styles.queryItem} ${
                  selectedQuery.id === query.id ? styles.active : ''
                }`}
                onClick={() => handleQuerySelect(query)}
              >
                {query.name}
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.content}>
          <div className={styles.editor}>
            <Editor
              height="100%"
              defaultLanguage="sql"
              theme="vs-dark"
              value={queryText}
              onChange={(value) => setQueryText(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          <div className={styles.toolbar}>
            <button className={styles.button} onClick={handleExecuteQuery}>
              <Play size={16} />
              Execute Query
            </button>
          </div>

          <div className={styles.results}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {selectedQuery.data.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selectedQuery.data.rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.statusBar}>
            <Clock size={16} />
            {executionTime ? `Query executed in ${executionTime.toFixed(2)}ms` : 'Ready'}
            <TableIcon size={16} style={{ marginLeft: 'auto' }} />
            {selectedQuery.data.rows.length} rows
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;