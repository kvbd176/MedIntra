import { useState } from "react";
import api from "../api/axios";

function AddCustomerModal({
  isOpen,
  onClose,
  onCustomerAdded
}){

  const [formData, setFormData] = useState({
    customer_name: "",
    phone_number: ""
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token=localStorage.getItem("token");
      await api.post(
        "/customers/",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      onCustomerAdded();
      onClose();
      setFormData({
        customer_name: "",
        phone_number: ""
      });
    }
    catch(error){console.log(error);}
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">
          Add Customer
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="customer_name"
            placeholder="Customer Name"
            value={formData.customer_name}
            onChange={handleChange}
            className="
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
            "
            required
          />

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            className="
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
            "
            required
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

export default AddCustomerModal;