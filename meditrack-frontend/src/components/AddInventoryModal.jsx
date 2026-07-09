import { useEffect, useState } from "react";
import api from "../api/axios";

function AddInventoryModal({isOpen,onClose,onInventoryAdded}){
  const[medicines,setMedicines]=useState([]);
  const[distributors,setDistributors]=useState([]);
  const inputStyle = `
  w-full
  bg-slate-950
  border
  border-slate-700
  rounded-xl
  px-4
  py-3
  text-white
  focus:border-cyan-500
  outline-none
  `;

  const labelStyle = `
  block
  text-slate-300
  font-medium
  mb-1
  `;

  const saveButtonStyle = `
  bg-cyan-500
  hover:bg-cyan-400
  text-black
  font-bold
  px-4
  py-2
  rounded-xl
  transition
  `;

  const cancelButtonStyle = `
  bg-slate-700
  hover:bg-slate-600
  text-white
  px-4
  py-2
  rounded-xl
  transition
  `;
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
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
    <div className="w-[700px] max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        Add Inventory
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <select
          name="medicine_id"
          value={formData.medicine_id}
          onChange={handleChange}
          className={inputStyle}
          required
        >
          <option value="">Select Medicine</option>
          {medicines.map((medicine) => (
            <option
              key={medicine.medicine_id}
              value={medicine.medicine_id}
            >
              {medicine.medicine_name} - {medicine.manufacturer}
            </option>
          ))}
        </select>

        <select
          name="distributor_id"
          value={formData.distributor_id}
          onChange={handleChange}
          className={inputStyle}
          required
        >
          <option value="">Select Distributor</option>
          {distributors.map((distributor) => (
            <option
              key={distributor.distributor_id}
              value={distributor.distributor_id}
            >
              {distributor.distributor_name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="batch_number"
          placeholder="Batch Number"
          value={formData.batch_number}
          onChange={handleChange}
          className={inputStyle}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>
              Manufacturing Date
            </label>
            <input
              type="date"
              name="manufacturing_date"
              value={formData.manufacturing_date}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>

          <div>
            <label className={labelStyle}>
              Expiry Date
            </label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelStyle}>
            Stock Entry Date
          </label>
          <input
            type="date"
            name="stock_entry_date"
            value={formData.stock_entry_date}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            step="0.01"
            name="cost_price"
            placeholder="Cost Price"
            value={formData.cost_price}
            onChange={handleChange}
            className={inputStyle}
            required
          />

          <input
            type="number"
            step="0.01"
            name="selling_price"
            placeholder="Selling Price"
            value={formData.selling_price}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className={inputStyle}
          required
        />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className={saveButtonStyle}
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className={cancelButtonStyle}
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