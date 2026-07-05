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

  useEffect(() => {
    fetchMedicines();
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
                  Number(quantity)
              }
            : item
        )
      );

    } else {

      setItems([
        ...items,
        {
          medicine_id:
            medicine.medicine_id,

          medicine_name:
            medicine.medicine_name,

          manufacturer:
            medicine.manufacturer,

          quantity:
            Number(quantity)
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

      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Billing
      </h1>

      <Card>

        <h2 className="text-xl font-semibold mb-4">
          Customer Details
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => {

              setPhoneNumber(
                e.target.value
              );

              searchCustomer(
                e.target.value
              );

            }}
            className="border p-2 w-full rounded"
          />

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="border p-2 w-full rounded"
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

        <h2 className="text-xl font-semibold mb-4">
          Add Medicines
        </h2>

        <input
          type="text"
          placeholder="Search Manufacturer"
          value={manufacturerSearch}
          onChange={(e) =>
            setManufacturerSearch(
              e.target.value
            )
          }
          className="border p-2 w-full mb-4 rounded"
        />

        <div className="flex gap-4">

          <select
            value={selectedMedicine}
            onChange={(e) =>
              setSelectedMedicine(
                e.target.value
              )
            }
            className="border p-2 rounded"
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
            className="border p-2 rounded"
          />

          <Button onClick={addItem}>
            Add
          </Button>

        </div>

      </Card>

      <Card>

        <h2 className="text-xl font-semibold mb-4">
          Selected Medicines
        </h2>

        <table className="w-full">

          <thead>

            <tr>
              <th>Name</th>
              <th>Manufacturer</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>

          </thead>

          <tbody>

            {items.map((item) => (

              <tr
                key={item.medicine_id}
              >

                <td>
                  {item.medicine_name}
                </td>

                <td>
                  {item.manufacturer}
                </td>

                <td>
                  {item.quantity}
                </td>

                <td className="space-x-2">

                  <button
                    onClick={() =>
                      increaseQty(
                        item.medicine_id
                      )
                    }
                  >
                    ➕
                  </button>

                  <button
                    onClick={() =>
                      decreaseQty(
                        item.medicine_id
                      )
                    }
                  >
                    ➖
                  </button>

                  <button
                    onClick={() =>
                      removeItem(
                        item.medicine_id
                      )
                    }
                  >
                    ❌
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </Card>

      <div className="mt-4">
  <Button onClick={createInvoice}>
    Create Invoice
  </Button>
</div>

{invoiceResult && (
  <Card>
    <h2 className="text-xl font-bold mb-3">
      Invoice Created Successfully
    </h2>

    <p>
      Invoice ID: {invoiceResult.invoice_id}
    </p>

    <p>
      Customer: {invoiceResult.customer_name}
    </p>

    <p>
      Total Amount: ₹{invoiceResult.total_amount}
    </p>

    <div className="mt-4">
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