import { useEffect, useState } from "react";

import api from "../api/axios";

import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import Table from "../components/Table";
import Card from "../components/Card";
import AddMedicineModal from "../components/AddMedicineModal";

function Medicines() {

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchMedicines = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await api.get(
        "/medicines/",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setMedicines(response.data);

    }
    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchMedicines();

  }, []);

  const filteredMedicines =
    medicines.filter((medicine) => {

      const searchTerm =
        search.toLowerCase();

      return (

        medicine.medicine_name
          ?.toLowerCase()
          .includes(searchTerm)

        ||

        medicine.manufacturer
          ?.toLowerCase()
          .includes(searchTerm)

      );

    });

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
          Medicines
        </h1>

        <p className="text-slate-400 mt-2">
          Manage medicine catalog and stock availability.
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
              placeholder="Search by medicine or manufacturer..."
            />

          </div>

          <p className="text-sm text-slate-400 mt-2">
            Showing {filteredMedicines.length} medicines
          </p>

          <Button
            onClick={() =>
              setShowModal(true)
            }
          >
            Add Medicine
          </Button>

        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <p className="text-slate-400">Total Medicines</p>
            <h2 className="text-3xl font-bold text-cyan-400">
              {medicines.length}
            </h2>
          </Card>

          <Card>
            <p className="text-slate-400">Manufacturers</p>
            <h2 className="text-3xl font-bold text-green-400">
              {[...new Set(medicines.map(m => m.manufacturer))].length}
            </h2>
          </Card>

          <Card>
            <p className="text-slate-400">Total Stock</p>
            <h2 className="text-3xl font-bold text-yellow-400">
              {medicines.reduce((sum,m)=>sum+m.quantity,0)}
            </h2>
          </Card>
        </div>

        <Table
          headers={[
            "ID",
            "Medicine Name",
            "Manufacturer",
            "Quantity"
          ]}
        >

          {filteredMedicines.map(
            (medicine) => (

              <tr
                key={medicine.medicine_id}
              >

                <td className="border p-2">
                  {medicine.medicine_id}
                </td>

                <td className="border p-2">
                  {medicine.medicine_name}
                </td>

                <td className="border p-2">
                  {medicine.manufacturer}
                </td>
                <td className="border p-2">
                  <span
                    className={
                      medicine.quantity < 10
                      ? "text-red-400 font-bold"
                      : medicine.quantity < 50
                      ? "text-yellow-400 font-bold"
                      : "text-green-400 font-bold"
                    }
                  >
                    {medicine.quantity}
                  </span>
                </td>

              </tr>

            )
          )}

        </Table>

      </Card>
      {
      filteredMedicines.length===0 && (
        <div className="text-center py-10">
          <p className="text-slate-400">
            No medicines found.
          </p>
        </div>
      )
      }

      <AddMedicineModal
        isOpen={showModal}
        onClose={() =>
          setShowModal(false)
        }
        onMedicineAdded={
          fetchMedicines
        }
      />

    </Layout>
  );
}

export default Medicines;