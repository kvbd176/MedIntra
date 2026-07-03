import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [summary, setSummary] = useState({
    total_medicines: 0,
    total_customers: 0,
    total_invoices: 0
  });
  const [inventoryValue, setInventoryValue] = useState(0);
  const [lowStock, setLowStock] = useState([]);
  const [expiring, setExpiring] = useState([]);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token=localStorage.getItem("token");
        const response=await api.get(
          "/dashboard/summary",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
        setSummary(response.data);
        const inventoryResponse = await api.get(
        "/dashboard/inventory-value",
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
        );
        setInventoryValue(inventoryResponse.data.inventory_value);
        const lowStockResponse = await api.get(
        "/dashboard/low-stock",
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
        );
        setLowStock(lowStockResponse.data);
        const expiringResponse = await api.get(
        "/dashboard/expiring",
        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
        );
        setExpiring(expiringResponse.data);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchDashboard();
  }, []);
  return (
  <div
    style={{
      display: "flex"
    }}
  >
    <Sidebar />
    <div
      style={{
        padding: "20px"
      }}
    >
      <h1>Dashboard</h1>
        <div>
            <h2>Total Medicines</h2>
            <h3>{summary.total_medicines}</h3>
        </div>

        <div>
            <h2>Total Customers</h2>
            <h3>{summary.total_customers}</h3>
        </div>

        <div>
            <h2>Total Invoices</h2>
            <h3>{summary.total_invoices}</h3>
        </div>

        <div>
            <h2>Inventory Value</h2>
            <h3>₹ {inventoryValue}</h3>
        </div>
        <h2>Low Stock Alerts</h2>
        {lowStock.length === 0 ? (
        <p>No low stock medicines</p>
        ) : (
        lowStock.map((item) => (
            <div key={item.batch_number}>
            {item.medicine_name} - Qty: {item.quantity}
            </div>
        ))
        )}
        <h2>Expiring Medicines</h2>
        {expiring.length === 0 ? (
        <p>No medicines expiring soon</p>
        ) : (
        expiring.map((item) => (
            <div key={item.batch_number}>
            {item.medicine_name} - {item.days_left} days left
            </div>
        ))
        )}

    </div>
  </div>
);
}

export default Dashboard;