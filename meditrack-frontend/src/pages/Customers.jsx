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
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Customers
      </h1>
      <Card>
        <div className="flex justify-between items-center mb-4">
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
        <Table headers={["ID","Customer Name","Phone Number"]}>
          {filteredCustomers.map((customer)=>(
            <tr key={customer.customer_id}>
              <td className="border p-2">
                {customer.customer_id}
              </td>
              <td className="border p-2">
                {customer.customer_name}
              </td>
              <td className="border p-2">
                {customer.phone_number}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
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