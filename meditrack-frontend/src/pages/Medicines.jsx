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

      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Medicines
      </h1>

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

          <Button
            onClick={() =>
              setShowModal(true)
            }
          >
            Add Medicine
          </Button>

        </div>

        <Table
          headers={[
            "ID",
            "Medicine Name",
            "Manufacturer"
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

              </tr>

            )
          )}

        </Table>

      </Card>

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