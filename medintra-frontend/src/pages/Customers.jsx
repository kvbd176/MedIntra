import { useEffect, useState } from "react";

import api from "../api/axios";

import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import Table from "../components/Table";
import Card from "../components/Card";

import AddCustomerModal from "../components/AddCustomerModal";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fetchCustomers = async () => {
    try {
      const token=localStorage.getItem("token");
      const response=await api.get(
        "/customers/",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );
      setCustomers(response.data);
    }
    catch(error){console.log(error);}
  };

  useEffect(()=>{fetchCustomers();},[]);

  const filteredCustomers =
    customers.filter((customer) =>
      customer.customer_name?.toLowerCase().includes(search.toLowerCase())
      ||
      customer.phone_number?.toLowerCase().includes(search.toLowerCase())
    );
  return(
    <Layout>
      <div className="mb-8">
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
          Customers
        </h1>

        <p className="text-slate-400 mt-2">
          Manage customer records and purchase history.
        </p>
      </div>
      <Card>
        <div className="flex justify-between items-center mb-4 gap-4">
          <div className="w-1/2">
            <SearchBar
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customer..."
            />
          </div>
          <Button
            onClick={() =>
              setShowModal(true)
            }
          >
            Add Customer
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <p className="text-slate-400">
              Total Customers
            </p>
            <h2 className="text-3xl font-bold text-cyan-400">
              {customers.length}
            </h2>
          </Card>
          <Card>
            <p className="text-slate-400">
              Search Results
            </p>
            <h2 className="text-3xl font-bold text-green-400">
              {filteredCustomers.length}
            </h2>
          </Card>
          <Card>
            <p className="text-slate-400">
              Active Records
            </p>
            <h2 className="text-3xl font-bold text-purple-400">
              {customers.length}
            </h2>
          </Card>
        </div>

        <Table headers={["ID","Customer Name","Phone Number"]}>
          {filteredCustomers.map((customer)=>(
            <tr
              key={customer.customer_id}
              className="
              hover:bg-slate-800/50
              transition
              "
            >
              <td className="border border-slate-800 p-3">
                {customer.customer_id}
              </td>
              <td className="border border-slate-800 p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400
                    flex items-center justify-center font-bold
                    "
                  >
                    {
                      customer.customer_name ? customer.customer_name.charAt(0).toUpperCase() : "-"
                    }
                  </div>

                  <span>
                    {customer.customer_name || "No Name"}
                  </span>

                </div>
              </td>
              <td className="border border-slate-800 p-3 text-cyan-400 font-medium">
                {customer.phone_number || "-"}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
      {
      filteredCustomers.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-400">
            No customers found.
          </p>
        </div>
      )
      }
      <AddCustomerModal
        isOpen={showModal}
        onClose={() =>
          setShowModal(false)
        }
        onCustomerAdded={
          fetchCustomers
        }
      />
    </Layout>
  );
}

export default Customers;