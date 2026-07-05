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

      <p><Link to="/medicines">
        Medicines
      </Link></p>

      <p><Link to="/inventory">
        Inventory
      </Link></p>

      <p><Link to="/customers">
        Customers
      </Link></p>

      <p><Link to="/distributors">
        Distributors
      </Link></p>

      <p><Link to="/billing">
        Billing
      </Link></p>

      <p><Link to="/invoices">
        Invoices
      </Link></p>

      <p>AI Assistant</p>

    </div>
  );
}

export default Sidebar;