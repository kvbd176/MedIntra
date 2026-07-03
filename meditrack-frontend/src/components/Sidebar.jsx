import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#1e293b",
        color: "white",
        padding: "20px"
      }}
    >
      <h2>MediTrack Pro</h2>

      <hr />

      <p>
        <Link
          to="/dashboard"
          style={{ color: "white" }}
        >
          Dashboard
        </Link>
      </p>

      <p>Medicines</p>

      <p>Inventory</p>

      <p>Customers</p>

      <p>Distributors</p>

      <p>Billing</p>

      <p>Invoices</p>

      <p>AI Assistant</p>

    </div>
  );
}

export default Sidebar;