import { useEffect, useState } from "react";

import api from "../api/axios";

import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import Table from "../components/Table";
import Card from "../components/Card";

import AddDistributorModal from "../components/AddDistributorModal";

function Distributors() {
  const [distributors, setDistributors] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fetchDistributors = async () => {
    try {
      const token=localStorage.getItem("token");
      const response=await api.get(
        "/distributors/",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );
      setDistributors(response.data);
    }
    catch(error) {console.log(error);}
  };
  useEffect(()=>{fetchDistributors();}, []);
  const filteredDistributors =
    distributors.filter((distributor) =>
      distributor.distributor_name?.toLowerCase().includes(search.toLowerCase())
      ||
      distributor.phone?.toLowerCase().includes(search.toLowerCase())
      ||
      distributor.email?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Layout>
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Distributors
      </h1>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <div className="w-1/2">
            <SearchBar
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search distributor..."
            />
          </div>
          <Button onClick={()=>setShowModal(true)}>
            Add Distributor
          </Button>
        </div>
        <Table
          headers={[
            "ID",
            "Distributor Name",
            "Phone",
            "Email",
            "Address"
          ]}
        >
          {filteredDistributors.map(
            (distributor)=>(
            <tr key={distributor.distributor_id}>
              <td className="border p-2">
                {distributor.distributor_id}
              </td>
              <td className="border p-2">
                {distributor.distributor_name}
              </td>
              <td className="border p-2">
                {distributor.phone}
              </td>
              <td className="border p-2">
                {distributor.email}
              </td>
              <td className="border p-2">
                {distributor.address}
              </td>
            </tr>
          ))}
        </Table>
      </Card>
      <AddDistributorModal
        isOpen={showModal}
        onClose={()=>setShowModal(false)}
        onDistributorAdded={fetchDistributors}
      />
    </Layout>
  );
}

export default Distributors;