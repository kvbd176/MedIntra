import { useEffect, useState } from "react";

import api from "../api/axios";

import Layout from "../components/Layout";
import Card from "../components/Card";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import Button from "../components/Button";

function Invoices() {
  const [invoices,setInvoices]=useState([]);
  const [search,setSearch]=useState("");
  const [selectedInvoice,setSelectedInvoice]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const fetchInvoices=async ()=>{
    try{
      const token=localStorage.getItem("token");
      const response =
        await api.get(
          "/invoices/",
          {
            headers:{Authorization:`Bearer ${token}`}
          }
        );
      setInvoices(response.data);
    }
    catch(error){console.log(error);}
  };
  useEffect(()=>{fetchInvoices();},[]);
  const filteredInvoices=invoices.filter((invoice)=>
      invoice.customer_name?.toLowerCase().includes(search.toLowerCase())
      ||
      invoice.customer_phone?.includes(search)
      ||
      invoice.invoice_id?.toString().includes(search)
    );
  
  const viewInvoice = async (invoiceId) => {
  try{
    const token=localStorage.getItem("token");
    const response=await api.get(
      `/pdf/invoice/${invoiceId}`,
      {
        responseType: "blob",
        headers:{
          Authorization: `Bearer ${token}`
        }
      }
    );
    const fileURL=window.URL.createObjectURL(
        new Blob([response.data],{
          type: "application/pdf"
        })
      );
      window.open(fileURL, "_blank");
    } 
    catch(error){
      console.log(error);
      alert("Failed to open invoice");
    }
  };

  const downloadPDF=async(invoiceId)=>{
    try{
      const token=localStorage.getItem("token");
      const response=
        await api.get(
          `/pdf/invoice/${invoiceId}`,
          {
            responseType:"blob",
            headers:{Authorization:`Bearer ${token}`}
          }
        );
      const url=window.URL.createObjectURL(new Blob([response.data]));
      const link=document.createElement("a");
      link.href=url;
      link.download=`invoice_${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    catch(error){
      console.log(error);
      alert("Failed to download PDF");
    }
  };

  return(
    <Layout>
      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Invoices
      </h1>
      <Card>
        <div className="mb-4 w-1/2">
          <SearchBar
            value={search}
            onChange={(e)=>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search by customer, phone or invoice ID"
          />
        </div>
        <Table
          headers={[
            "Invoice ID",
            "Customer",
            "Phone",
            "Amount",
            "Date",
            "Actions"
          ]}
        >
          {filteredInvoices.map(
            (invoice)=>(
              <tr
                key={invoice.invoice_id}
              >
                <td className="border p-2">
                  {invoice.invoice_id}
                </td>
                <td className="border p-2">
                  {invoice.customer_name}
                </td>
                <td className="border p-2">
                  {invoice.customer_phone}
                </td>
                <td className="border p-2">
                  ₹ {invoice.total_amount}
                </td>
                <td className="border p-2">
                  {
                    new Date(invoice.invoice_date).toLocaleDateString()
                  }
                </td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <Button onClick={()=>viewInvoice(invoice.invoice_id)}>
                      View
                    </Button>
                    <Button onClick={()=>downloadPDF(invoice.invoice_id)}>
                      PDF
                    </Button>
                  </div>
                </td>
              </tr>
            )
          )}
        </Table>
      </Card>
      {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[700px]">
            <h2 className="text-2xl font-bold mb-4">
              Invoice Details
            </h2>
            <p>
              Invoice ID:
              {" "}
              {selectedInvoice.invoice_id}
            </p>
            <p>
              Customer:
              {" "}
              {selectedInvoice.customer_name}
            </p>
            <p>
              Phone:
              {" "}
              {selectedInvoice.customer_phone}
            </p>
            <p>
              Total:
              {" "}
              ₹
              {selectedInvoice.total_amount}
            </p>
            <h3 className="text-lg font-semibold mt-4 mb-2">
              Medicines
            </h3>
            <table className="w-full border">
              <thead>
                <tr>
                  <th className="border p-2">
                    Medicine
                  </th>
                  <th className="border p-2">
                    Quantity
                  </th>
                  <th className="border p-2">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map(
                  (item,index)=>(
                    <tr key={index}>
                      <td className="border p-2">
                        {item.medicine_name}
                      </td>
                      <td className="border p-2">
                        {item.quantity}
                      </td>
                      <td className="border p-2">
                        ₹ {item.subtotal}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div className="flex gap-2 mt-4">
              <Button onClick={()=>downloadPDF(selectedInvoice.invoice_id)}>
                Download PDF
              </Button>
              <Button onClick={()=>setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Invoices;