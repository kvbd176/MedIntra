import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Layout from "../components/Layout";

function Dashboard() {
  const [summary, setSummary] = useState({
    total_medicines: 0,
    total_customers: 0,
    total_invoices: 0
  });
  const [inventoryStats, setInventoryStats] = useState({
    total_purchased_stock_value: 0,
    current_inventory_value: 0,
    stock_sold_value: 0,
    estimated_profit: 0
  });
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
        const stockResponse = await api.get(
        "/dashboard/stock-summary",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
        );
        setInventoryStats(stockResponse.data);
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


  
  return(
  <Layout>

      <h1
        className="
        text-5xl
        font-extrabold
        bg-gradient-to-r
        from-cyan-400
        via-blue-400
        to-indigo-400
        text-transparent
        bg-clip-text
        "
      >
        Dashboard
      </h1>

      <p className="text-slate-400 mt-2 mb-6">
        Welcome back. Here's your pharmacy overview.
      </p>

        <div className="space-y-6 mb-8">

          <div className="grid grid-cols-3 gap-6">
            <StatCard
              title="Medicines"
              value={summary.total_medicines}
            />

            <StatCard
              title="Customers"
              value={summary.total_customers}
            />

            <StatCard
              title="Invoices"
              value={summary.total_invoices}
            />
          </div>

          <div className="grid grid-cols-4 gap-6">
            <StatCard
              title="Purchased Stock"
              value={`₹ ${inventoryStats.total_purchased_stock_value}`}
            />

            <StatCard
              title="Current Inventory"
              value={`₹ ${inventoryStats.current_inventory_value}`}
            />

            <StatCard
              title="Stock Sold Value"
              value={`₹ ${inventoryStats.stock_sold_value}`}
            />

            <StatCard
              title="Profit"
              value={`₹ ${inventoryStats.estimated_profit}`}
            />
          </div>

        </div>


        <Card>
        <h2 className="text-xl font-semibold mb-4">
          Low Stock Alerts
        </h2>
        {lowStock.length==0?(<p>No low stock medicines</p>): 
        (
        lowStock.map((item) => (
            <div key={item.batch_number}>
            {item.medicine_name}-Qty:{item.quantity}
            </div>
        ))
        )}
        </Card>


        <Card>
        <h2 className="text-xl font-semibold mb-4">
          Expiring Medicines
        </h2>
        {expiring.length==0?(<p>No medicines expiring soon</p>): 
        (
        expiring.map((item)=>(
            <div key={item.batch_number}>
            {item.medicine_name} - {item.days_left} days left
            </div>
        ))
        )}
        </Card>

    </Layout>
);
}

export default Dashboard;