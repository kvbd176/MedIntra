import { useEffect, useState } from "react";
import api from "../api/axios";

function AddInventoryModal({isOpen,onClose,onInventoryAdded}){
  const[medicines,setMedicines]=useState([]);
  const[distributors,setDistributors]=useState([]);
  const[formData,setFormData]=
    useState({
      medicine_id: "",
      distributor_id: "",
      batch_number: "",
      manufacturing_date: "",
      expiry_date: "",
      stock_entry_date: "",
      cost_price: "",
      selling_price: "",
      quantity: ""
    });
  useEffect(()=>{
    if(!isOpen) return;
    const fetchData=async()=>{
      try{
        const token=localStorage.getItem("token");
        const medicinesResponse=
          await api.get(
            "/medicines/",
            {
              headers:{Authorization: `Bearer ${token}`}
            }
          );
        const distributorsResponse=
          await api.get(
            "/distributors/",
            {
              headers:{Authorization: `Bearer ${token}`}
            }
          );

        setMedicines(medicinesResponse.data);
        setDistributors(distributorsResponse.data);
      }
      catch(error){console.log(error);}
    };
    fetchData();
  },[isOpen]);
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };
  const handleSubmit=async(e)=>{e.preventDefault();
    try {
      const token=localStorage.getItem("token");
      await api.post(
        "/inventory/",
        {
          ...formData,
          medicine_id:Number(formData.medicine_id),
          distributor_id:Number(formData.distributor_id),
          cost_price:Number(formData.cost_price),
          selling_price:Number(formData.selling_price),
          quantity:Number(formData.quantity)
        },
        {
          headers:{Authorization:`Bearer ${token}`}
        }
      );

      setFormData({
        medicine_id: "",
        distributor_id: "",
        batch_number: "",
        manufacturing_date: "",
        expiry_date: "",
        stock_entry_date: "",
        cost_price: "",
        selling_price: "",
        quantity: ""
      });
      onInventoryAdded();
      onClose();
    }
    catch(error) {
      console.log(error);
      alert("Failed to add inventory");
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[700px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          Add Inventory
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <select
            name="medicine_id"
            value={formData.medicine_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >

            <option value="">
              Select Medicine
            </option>

            {medicines.map(
              (medicine) => (
                <option
                  key={medicine.medicine_id}
                  value={medicine.medicine_id}
                >{medicine.medicine_name}
                </option>
              )
            )}
          </select>

          <select
            name="distributor_id"
            value={formData.distributor_id}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">
              Select Distributor
            </option>
            {distributors.map(
              (distributor)=>(
                <option
                  key={distributor.distributor_id}
                  value={distributor.distributor_id}
                >{distributor.distributor_name}
                </option>
              )
            )}
          </select>

          <input
            type="text"
            name="batch_number"
            placeholder="Batch Number"
            value={formData.batch_number}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <label className="block mb-1 font-medium">
            Manufacturing Date
          </label>
          <input
            type="date"
            name="manufacturing_date"
            value={formData.manufacturing_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <label className="block mb-1 font-medium">
            Expiry Date
          </label>
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <label className="block mb-1 font-medium">
            Stock Entry Date
          </label>
          <input
            type="date"
            name="stock_entry_date"
            value={formData.stock_entry_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            step="0.01"
            name="cost_price"
            placeholder="Cost Price"
            value={formData.cost_price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            step="0.01"
            name="selling_price"
            placeholder="Selling Price"
            value={formData.selling_price}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddInventoryModal;