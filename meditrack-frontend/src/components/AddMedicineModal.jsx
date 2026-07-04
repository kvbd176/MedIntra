import { useState } from "react";
import api from "../api/axios";

function AddMedicineModal({
  isOpen,
  onClose,
  onMedicineAdded
}) {

  const [medicineName, setMedicineName]=useState("");
  const [manufacturer, setManufacturer]=useState("");
  if(!isOpen) return null;
  const handleSubmit=async(e)=>{e.preventDefault();
    try{
      const token=localStorage.getItem("token");

      await api.post(
        "/medicines/",
        {
          medicine_name: medicineName,
          manufacturer: manufacturer
        },
        {
          headers:{Authorization: `Bearer ${token}`}
        }
      );
      setMedicineName("");
      setManufacturer("");
      onMedicineAdded();
      onClose();
    }
    catch(error){
      console.log(error);
      alert("Failed to add medicine");
    }
  };

  return(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">
          Add Medicine
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicineName}
            onChange={(e) =>
              setMedicineName(
                e.target.value
              )
            }
            className="w-full border p-2 rounded mb-3"
            required
          />

          <input
            type="text"
            placeholder="Manufacturer"
            value={manufacturer}
            onChange={(e) =>
              setManufacturer(
                e.target.value
              )
            }
            className="w-full border p-2 rounded mb-4"
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMedicineModal;