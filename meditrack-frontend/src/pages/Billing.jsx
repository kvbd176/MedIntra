import { useEffect, useState } from "react";
import api from "../api/axios";

import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";

function Billing() {

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [medicines, setMedicines] = useState([]);
  const [manufacturerSearch, setManufacturerSearch] = useState("");

  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [items, setItems] = useState([]);

  const [invoiceResult, setInvoiceResult] = useState(null);

  const [customerFound, setCustomerFound] = useState(true);
  const [medicinePrices, setMedicinePrices] = useState([]);

  useEffect(() => {
  fetchMedicines();
  fetchPrices();
  }, []);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/medicines/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMedicines(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  const fetchPrices = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await api.get(
        "/billing/medicine-prices",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );
      console.log("PRICE DATA:", response.data);

      setMedicinePrices(response.data);

    } catch(error){
      console.log(error);
    }
  };

  const searchCustomer = async (phone) => {

    if (phone.length < 10) return;

    try {

      const token = localStorage.getItem("token");

      const response = await api.get(
        `/customers/phone/${phone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCustomerName(response.data.customer_name);
      setCustomerFound(true);

    } catch {

      setCustomerFound(false);
      setCustomerName("");

    }
  };

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.manufacturer
        ?.toLowerCase()
        .includes(
          manufacturerSearch.toLowerCase()
        )
  );

  const addItem = () => {

    if (!selectedMedicine) return;

    const medicine = medicines.find(
      (m) =>
        m.medicine_id ===
        parseInt(selectedMedicine)
    );

    const existing = items.find(
      (item) =>
        item.medicine_id ===
        medicine.medicine_id
    );

    if (existing) {

      setItems(
        items.map((item) =>
          item.medicine_id ===
          medicine.medicine_id
            ? {
                ...item,
                quantity:
                  item.quantity +
                  Number(quantity),
                  price: item.price
              }
            : item
        )
      );

    } else {

      const priceData = medicinePrices.find(
        p => p.medicine_id === medicine.medicine_id
      );

      setItems([
        ...items,
        {
          medicine_id: medicine.medicine_id,
          medicine_name: medicine.medicine_name,
          manufacturer: medicine.manufacturer,
          price: priceData?.selling_price || 0,
          quantity: Number(quantity)
        }
      ]);

    }

    setSelectedMedicine("");
    setQuantity(1);
  };

  const increaseQty = (medicineId) => {

    setItems(
      items.map((item) =>
        item.medicine_id === medicineId
          ? {
              ...item,
              quantity:
                item.quantity + 1
            }
          : item
      )
    );

  };

  const decreaseQty = (medicineId) => {

    setItems(
      items.map((item) =>
        item.medicine_id === medicineId
          ? {
              ...item,
              quantity:
                Math.max(
                  1,
                  item.quantity - 1
                )
            }
          : item
      )
    );

  };

  const removeItem = (medicineId) => {

    setItems(
      items.filter(
        (item) =>
          item.medicine_id !==
          medicineId
      )
    );

  };

  const createInvoice = async () => {
    if (!customerName.trim()) {
    alert("Enter customer name");
    return;
    }

    if (!phoneNumber.trim()) {
      alert("Enter phone number");
      return;
    }

    if (items.length === 0) {
      alert("Add at least one medicine");
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      const payload = {

        customer_name:
          customerName,

        phone_number:
          phoneNumber,

        items: items.map((item) => ({
          medicine_id:
            item.medicine_id,
          quantity:
            item.quantity
        }))

      };

      const response =
        await api.post(
          "/billing/create-invoice",
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
      setInvoiceResult(response.data);
        alert("Invoice Created Successfully");

    } catch (error) {

      alert(
        error.response?.data?.detail ||
        "Invoice creation failed"
      );

    }
  };

  const downloadPDF = async (invoiceId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(
      `/pdf/invoice/${invoiceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      `invoice_${invoiceId}.pdf`
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

    } catch (error) {
      console.log(error);
      alert("Failed to download PDF");
    }
  };

  return (
    <Layout>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Billing Center
        </h1>

        <p className="text-slate-400 mt-2">
          Create invoices and manage customer purchases.
        </p>
      </div>

      <Card>

        <h2 className="text-xl font-semibold mb-4">
          Customer Details
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e)=>{
              setPhoneNumber(e.target.value);
              searchCustomer(e.target.value);
            }}
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
          />

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e)=>setCustomerName(e.target.value)}
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
          />

          {!customerFound &&
            phoneNumber.length >= 10 && (
            <p className="text-orange-600 font-medium">
              New customer. Enter name to save.
            </p>
          )}

        </div>

      </Card>

      <Card>

        <h2 className="text-2xl font-bold text-cyan-400 mb-1">
          Add Medicines
        </h2>

        <p className="text-slate-400 mb-6">
          Search medicines and add them to the invoice
        </p>

        <input
          type="text"
          placeholder="Search Manufacturer"
          value={manufacturerSearch}
          onChange={(e) =>
            setManufacturerSearch(
              e.target.value
            )
          }
          className="
          w-full
          bg-slate-950
          border
          border-slate-700
          rounded-xl
          px-4
          py-3
          text-white
          mb-4
          "
        />

        <div className="flex gap-4">

          <select
            value={selectedMedicine}
            onChange={(e) =>
              setSelectedMedicine(
                e.target.value
              )
            }
            className="
            flex-1
            bg-slate-950
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
            "
          >

            <option value="">
              Select Medicine
            </option>

            {filteredMedicines.map(
              (medicine) => (

                <option
                  key={
                    medicine.medicine_id
                  }
                  value={
                    medicine.medicine_id
                  }
                >
                  {medicine.medicine_name}
                  {" - "}
                  {medicine.manufacturer}
                </option>

              )
            )}

          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
            className="
            w-32
            bg-slate-950
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
            "
          />

          <Button onClick={addItem}>
            Add
          </Button>

        </div>

      </Card>

      <Card>

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-cyan-400">
            Selected Medicines
          </h2>

          <span className="
            bg-cyan-500/20
            text-cyan-400
            px-4
            py-2
            rounded-xl
            text-sm
            font-semibold
          ">
            {items.length} Items
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-700">

                <th className="text-left py-4 text-cyan-400">
                  Medicine
                </th>

                <th className="text-left py-4 text-cyan-400">
                  Manufacturer
                </th>

                <th className="text-center py-4 text-cyan-400">
                  Price
                </th>

                <th className="text-center py-4 text-cyan-400">
                  Qty
                </th>

                <th className="text-center py-4 text-cyan-400">
                  Total
                </th>

                <th className="text-center py-4 text-cyan-400">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item) => (

                <tr
                  key={item.medicine_id}
                  className="
                  border-b
                  border-slate-800
                  hover:bg-slate-800/30
                  transition
                  "
                >

                  <td className="py-4 font-medium text-white">
                    {item.medicine_name}
                  </td>

                  <td className="py-4 text-slate-300">
                    {item.manufacturer}
                  </td>

                  <td className="py-4 text-center text-green-400 font-semibold">
                    ₹{item.price}
                  </td>

                  <td className="py-4 text-center text-white font-bold">
                    {item.quantity}
                  </td>

                  <td className="py-4 text-center text-cyan-400 font-bold">
                    ₹{item.price * item.quantity}
                  </td>

                  <td className="py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          increaseQty(item.medicine_id)
                        }
                        className="
                        bg-green-500
                        hover:bg-green-600
                        text-white
                        w-8
                        h-8
                        rounded-lg
                        "
                      >
                        +
                      </button>

                      <button
                        onClick={() =>
                          decreaseQty(item.medicine_id)
                        }
                        className="
                        bg-yellow-500
                        hover:bg-yellow-600
                        text-black
                        w-8
                        h-8
                        rounded-lg
                        "
                      >
                        -
                      </button>

                      <button
                        onClick={() =>
                          removeItem(item.medicine_id)
                        }
                        className="
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-3
                        rounded-lg
                        "
                      >
                        Remove
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </Card>

      <Card>

        <div className="flex justify-between items-center">

          <div>

            <p className="text-slate-400">
              Estimated Bill Amount
            </p>

            <h2 className="
              text-4xl
              font-bold
              text-green-400
            ">
              ₹{
                items.reduce(
                  (sum, item) =>
                    sum +
                    (item.price * item.quantity),
                  0
                )
              }
            </h2>

          </div>

          <div className="
            text-right
            text-slate-400
          ">
            <p>Total Medicines</p>

            <p className="text-white text-2xl font-bold">
              {items.length}
            </p>
          </div>

        </div>

      </Card>
      <div className="mt-4">
  <Button onClick={createInvoice}>
    Create Invoice
  </Button>
</div>

{invoiceResult && (
  <Card>
    <h2 className="text-2xl font-bold text-green-400 mb-4">
      Invoice Created Successfully
    </h2>

    <div className="space-y-2">

    <p className="text-slate-300">
      Invoice ID:
      <span className="text-white ml-2 font-bold">
        {invoiceResult.invoice_id}
      </span>
    </p>

    <p className="text-slate-300">
      Customer:
      <span className="text-white ml-2 font-bold">
        {invoiceResult.customer_name}
      </span>
    </p>

    <p className="text-slate-300">
      Total Amount:
      <span className="text-green-400 ml-2 font-bold">
        ₹{invoiceResult.total_amount}
      </span>
    </p>

  </div>

    <Card>

      <h2 className="text-2xl font-bold text-cyan-400 mb-5">
        Invoice Summary
      </h2>

      <div className="grid grid-cols-3 gap-4">

        <div
          className="
          bg-slate-950
          border
          border-slate-800
          rounded-xl
          p-4
          "
        >
          <p className="text-slate-400 text-sm">
            Customer
          </p>

          <p className="text-white text-lg font-bold">
            {customerName || "N/A"}
          </p>
        </div>

        <div
          className="
          bg-slate-950
          border
          border-slate-800
          rounded-xl
          p-4
          "
        >
          <p className="text-slate-400 text-sm">
            Medicines
          </p>

          <p className="text-white text-lg font-bold">
            {items.length}
          </p>
        </div>

        <div
          className="
          bg-slate-950
          border
          border-slate-800
          rounded-xl
          p-4
          "
        >
          <p className="text-slate-400 text-sm">
            Total Quantity
          </p>

          <p className="text-white text-lg font-bold">
            {
              items.reduce(
                (sum,item)=>sum+item.quantity,
                0
              )
            }
          </p>
        </div>

      </div>

    </Card>
    <div className="mt-6 flex justify-end">
      <Button
        onClick={() =>
          downloadPDF(
            invoiceResult.invoice_id
          )
        }
      >
        Download PDF
      </Button>
      </div>
    </Card>
  )}

    </Layout>
  );
}

export default Billing;