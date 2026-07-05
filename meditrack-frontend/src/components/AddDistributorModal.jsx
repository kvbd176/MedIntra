import { useState } from "react";
import api from "../api/axios";

function AddDistributorModal({isOpen,onClose,onDistributorAdded}){
  const [formData, setFormData]=useState({
    distributor_name: "",
    phone: "",
    email: "",
    address: ""
  });
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      const token=localStorage.getItem("token");
      await api.post(
        "/distributors/",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );
      onDistributorAdded();
      onClose();
      setFormData({
        distributor_name: "",
        phone: "",
        email: "",
        address: ""
      });
    }
    catch(error) {console.log(error);}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-[500px]">
        <h2 className="text-2xl font-bold mb-4">
          Add Distributor
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="distributor_name"
            placeholder="Distributor Name"
            value={formData.distributor_name}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDistributorModal;