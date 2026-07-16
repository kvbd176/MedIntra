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
  const [loading, setLoading] = useState(true);
  const fetchDistributors = async () => {
    setLoading(true);
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
    finally{
      setLoading(false);
    }
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

  if (loading) {
      return (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="bg-slate-900/70 backdrop-blur-md border border-slate-700 rounded-2xl px-10 py-8 shadow-xl">
            <div className="flex flex-col items-center">

              <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

              <h2 className="mt-4 text-xl font-semibold">
                Loading Distributors
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Fetching inventory data...
              </p>

            </div>
          </div>
        </div>
      );
}

  return ( 
  <Layout>
     <div className="mb-8">
       <h1 className=" text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 text-transparent bg-clip-text " >
         Distributors 
        </h1> 
        <p className="text-slate-400 mt-2"> 
          Manage supplier information and distributor contacts. 
        </p> 
      </div> 
      <Card> 
        <div className="flex justify-between items-center mb-6 gap-4"> 
          <div className="w-1/2"> 
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value) } 
          placeholder="Search distributor..." /> 
          </div> 
          <Button onClick={() => setShowModal(true) } >
             Add Distributor 
          </Button> 
          </div> 
        <div className="grid grid-cols-3 gap-4 mb-6"> 
          <Card> 
            <p className="text-slate-400"> 
              Total Distributors 
            </p> 
            <h2 className="text-3xl font-bold text-cyan-400"> 
              {distributors.length} 
            </h2> 
          </Card> 
        <Card> 
          <p className="text-slate-400"> 
            Search Results 
          </p> 
          <h2 className="text-3xl font-bold text-green-400"> 
            {filteredDistributors.length} 
          </h2> 
        </Card> 
        <Card> 
          <p className="text-slate-400"> 
            Active Suppliers 
          </p> 
          <h2 className="text-3xl font-bold text-purple-400"> 
            {distributors.length} 
          </h2> 
        </Card> 
      </div> 
      <Table headers={[ "ID", "Distributor Name", "Phone", "Email", "Address" ]} > 
        {filteredDistributors.map( (distributor) => (
           <tr key={distributor.distributor_id} className=" hover:bg-slate-800/50 transition " > 
           <td className="border p-3"> 
            {distributor.distributor_id} 
            </td> 
           <td className="border p-3"> 
            <div className="flex items-center gap-3"> 
              <div className=" w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold " >
               {distributor.distributor_name ?.charAt(0) .toUpperCase()} 
              </div> 
              <span> 
                {distributor.distributor_name} 
              </span> 
            </div> 
            </td> 
            <td className=" border p-3 text-green-400 font-medium " > 
              {distributor.phone} 
            </td> 
            <td className=" border p-3 text-cyan-400 " > 
              {distributor.email} 
            </td> 
            <td className="border p-3"> 
              {distributor.address} 
            </td> 
            </tr> ) )}
            </Table> 
            </Card> 
            { filteredDistributors.length === 0 && ( 
              <div className="text-center py-10"> 
                <p className="text-slate-400"> 
                  No distributors found. 
                </p> 
              </div> 
            ) } 
            <AddDistributorModal isOpen={showModal} 
            onClose={() => setShowModal(false) } 
            onDistributorAdded={ fetchDistributors } />
            </Layout> 
            ); 
          } 
  export default Distributors;