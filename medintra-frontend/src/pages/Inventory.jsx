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
const [loading, setLoading] = useState(true);

const fetchInventory = async () => {
  setLoading(true);
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
  finally {
    setLoading(false);
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

if (loading) {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl px-10 py-8 shadow-xl">
            <div className="flex flex-col items-center">

              <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

              <h2 className="mt-4 text-xl font-semibold">
                Loading Inventory
              </h2>

            </div>
          </div>
        </div>
      );
}


return (
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
        Inventory
      </h1>

      <p className="text-slate-400 mt-2">
        Track batches, stock levels and expiry dates.
      </p>
    </div>

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
        <p className="text-sm text-slate-400 mt-2">
          Showing {filteredInventory.length} batches
        </p>

        <Button onClick={()=>setShowModal(true)}>
          Add Inventory
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">

        <Card>
          <p className="text-slate-400">
            Total Batches
          </p>
          <h2 className="text-3xl font-bold text-cyan-400">
            {inventory.length}
          </h2>
        </Card>

        <Card>
          <p className="text-slate-400">
            Total Stock
          </p>
          <h2 className="text-3xl font-bold text-green-400">
            {
              inventory.reduce(
                (sum,item)=>sum+item.quantity,
                0
              )
            }
          </h2>
        </Card>

        <Card>
          <p className="text-slate-400">
            Low Stock
          </p>
          <h2 className="text-3xl font-bold text-yellow-400">
            {
              inventory.filter(
                item=>item.quantity<10
              ).length
            }
          </h2>
        </Card>

        <Card>
          <p className="text-slate-400">
            Expired
          </p>
          <h2 className="text-3xl font-bold text-red-400">
            {
              inventory.filter(
                item =>
                new Date(item.expiry_date)
                <
                new Date()
              ).length
            }
          </h2>
        </Card>

      </div>

      <Table 
      headers={[
        "Batch",
        "Medicine",
        "Distributor",
        "Manufacturer",
        "Bought Qty",
        "Current Qty",
        "Cost",
        "Selling",
        "Expiry"
        ]}
      >
        {filteredInventory.map((item)=>(
          <tr
            key={item.batch_id}
            className="
            hover:bg-slate-800/50
            transition
            "
          >
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
              {item.manufacturer}
            </td>
            <td className="border p-2">
            {item.initial_quantity}
            </td>

            <td className="border p-2">
              <span
                className={
                  item.quantity < 10
                  ? "text-red-400 font-bold"
                  : item.quantity < 50
                  ? "text-yellow-400 font-bold"
                  : "text-green-400 font-bold"
                }
              >
                {item.quantity}
              </span>
            </td>
            
            <td className="border p-2">
              ₹ {item.cost_price}
            </td>
            <td className="border p-2">
              ₹ {item.selling_price}
            </td>
            <td className="border p-2">
              <div className="flex flex-col">

                <span>
                  {item.expiry_date}
                </span>

                {
                  new Date(item.expiry_date) <
                  new Date()

                  ? (
                    <span className="text-red-400 text-xs font-bold">
                      EXPIRED
                    </span>
                  )

                  : (
                    new Date(item.expiry_date) <
                    new Date(
                      Date.now() +
                      90 * 24 * 60 * 60 * 1000
                    )

                    &&

                    <span className="text-yellow-400 text-xs font-bold">
                      EXPIRING SOON
                    </span>
                  )
                }

              </div>
            </td>
          </tr>
        ))}
      </Table>
    </Card>

    {
    filteredInventory.length===0 && (
      <div className="text-center py-10">
        <p className="text-slate-400">
          No inventory batches found.
        </p>
      </div>
    )
    }

    <AddInventoryModal
      isOpen={showModal}
      onClose={()=>setShowModal(false)}
      onInventoryAdded={fetchInventory}
    />
  </Layout>
);
}

export default Inventory;