import { useEffect, useState } from "react";

import api from "../api/axios";

import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import Table from "../components/Table";
import Card from "../components/Card";
import AddInventoryModal from "../components/AddInventoryModal";

function Inventory() {
const [showModal, setShowModal] = useState(false);
const [inventory, setInventory] = useState([]);

const fetchInventory = async () => {
  try {
    const token=localStorage.getItem("token");
    const response=await api.get(
      "/inventory/",
      {
        headers: {Authorization:`Bearer ${token}`}
      }
    );
    setInventory(response.data);
  }
  catch(error){
    console.log(error);
  }
};
useEffect(() => {fetchInventory();},[]);

//search
const [search, setSearch]=useState("");
const filteredInventory=
  inventory.filter((item) =>
    item.medicine_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
    ||
    item.batch_number
      ?.toLowerCase()
      .includes(search.toLowerCase())
    ||
    item.distributor_name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );


return (
  <Layout>
    <h1 className="text-4xl font-bold text-blue-600 mb-8">
      Inventory
    </h1>

    <Card>
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/2">
          <SearchBar
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search inventory..."
          />
        </div>

        <Button onClick={()=>setShowModal(true)}>
          Add Inventory
        </Button>
      </div>

      <Table 
      headers={[
        "Batch",
        "Medicine",
        "Distributor",
        "Bought Qty",
        "Current Qty",
        "Cost",
        "Selling",
        "Expiry"
        ]}
      >
        {filteredInventory.map((item)=>(
          <tr key={item.batch_id}>
            <td className="border p-2">
              {item.batch_number}
            </td>
            <td className="border p-2">
              {item.medicine_name}
            </td>
            <td className="border p-2">
              {item.distributor_name}
            </td>

            <td className="border p-2">
            {item.initial_quantity}
            </td>

            <td className="border p-2">
              {item.quantity}
            </td>
            
            <td className="border p-2">
              ₹ {item.cost_price}
            </td>
            <td className="border p-2">
              ₹ {item.selling_price}
            </td>
            <td className="border p-2">
              {item.expiry_date}
            </td>
          </tr>
        ))}
      </Table>
    </Card>

    <AddInventoryModal
      isOpen={showModal}
      onClose={()=>setShowModal(false)}
      onInventoryAdded={fetchInventory}
    />
  </Layout>
);
}

export default Inventory;