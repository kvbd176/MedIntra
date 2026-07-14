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
    expired_stock_loss: 0,
    operating_profit: 0,
    net_profit: 0
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


  
return (
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

    <p className="text-slate-400 mt-2 mb-8">
      Welcome back. Here's your pharmacy overview.
    </p>

    {/* Top Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

    {/* Financial Overview */}
    <div className="grid lg:grid-cols-2 gap-6 mb-8">

      <Card>
        <h2 className="text-xl font-semibold mb-5">
          Inventory Overview
        </h2>

        <div className="space-y-5">

          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Purchased Stock
            </span>

            <span className="text-cyan-400 font-bold text-lg">
              ₹ {inventoryStats.total_purchased_stock_value}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Current Inventory
            </span>

            <span className="text-green-400 font-bold text-lg">
              ₹ {inventoryStats.current_inventory_value}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Revenue
            </span>

            <span className="text-blue-400 font-bold text-lg">
              ₹ {inventoryStats.stock_sold_value}
            </span>
          </div>

        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-5">
          Profit Analysis
        </h2>

        <div className="space-y-5">

          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Expired Stock Loss
            </span>

            <span className="text-red-400 font-bold text-lg">
              ₹ {inventoryStats.expired_stock_loss}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">
              Operating Profit
            </span>

            <span
              className={`font-bold text-lg ${
                inventoryStats.operating_profit >= 0
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              ₹ {inventoryStats.operating_profit}
            </span>
          </div>

          <div className="border-t border-slate-700 pt-4 flex justify-between items-center">
            <span className="font-semibold text-white">
              Net Profit
            </span>

            <span
              className={`text-2xl font-extrabold ${
                inventoryStats.net_profit >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              ₹ {inventoryStats.net_profit}
            </span>
          </div>

        </div>
      </Card>

    </div>

    {/* Alerts Section */}
    <div className="grid lg:grid-cols-2 gap-6">

      {/* Low Stock */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">
          Low Stock Alerts
        </h2>

        {lowStock.length === 0 ? (
          <p className="text-slate-400">
            No low stock medicines
          </p>
        ) : (
          lowStock.map((item, index) => (
            <div
              key={index}
              className="
              p-3
              rounded-lg
              bg-red-500/10
              border
              border-red-500/20
              mb-3
              "
            >
              <div className="font-medium text-white">
                {item.medicine_name}
              </div>

              <div className="text-sm text-slate-400">
                Manufacturer: {item.manufacturer}
              </div>

              <div className="text-red-400 font-medium">
                Qty Left: {item.quantity}
              </div>
            </div>
          ))
        )}
      </Card>

      {/* Expiring */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">
          Expiring Medicines
        </h2>

        {expiring.length === 0 ? (
          <p className="text-slate-400">
            No medicines expiring soon
          </p>
        ) : (
          expiring.map((item) => (
            <div
              key={`${item.batch_number}-${item.medicine_name}`}
              className="
              p-3
              rounded-lg
              bg-orange-500/10
              border
              border-orange-500/20
              mb-3
              "
            >
              <div className="font-medium text-white">
                {item.medicine_name}
              </div>

              <div className="text-sm text-slate-400">
                Manufacturer: {item.manufacturer}
              </div>

              <div className="text-sm text-slate-400">
                Batch: {item.batch_number}
              </div>

              <div className="text-sm text-slate-400">
                Remaining Qty: {item.quantity}
              </div>

              <div className="text-orange-400 font-medium">
                {item.days_left} days left
              </div>
            </div>
          ))
        )}
      </Card>

    </div>

  </Layout>
);
}

export default Dashboard;