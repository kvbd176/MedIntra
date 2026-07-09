import { useState } from "react";
import api from "../api/axios";

function AddMedicineModal({
  isOpen,
  onClose,
  onMedicineAdded
}) {
  const [medicineName, setMedicineName] = useState("");
  const [manufacturer, setManufacturer] = useState("");

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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/medicines/",
        {
          medicine_name: medicineName,
          manufacturer: manufacturer
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMedicineName("");
      setManufacturer("");

      onMedicineAdded();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to add medicine");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Add Medicine
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Medicine Name"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            className={inputStyle}
            required
          />

          <input
            type="text"
            placeholder="Manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
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

export default AddMedicineModal;