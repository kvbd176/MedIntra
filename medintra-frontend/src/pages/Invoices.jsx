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
    <div className="mb-8">
      <h1
        className="
        text-5xl
        font-extrabold
        bg-gradient-to-r
        from-cyan-400
        via-blue-400
        to-indigo-400
        text-transparent
        bg-clip-text
        "
      >
        Invoices
      </h1>
      <p className="text-slate-400 mt-2">
        View, manage and download customer invoices.
      </p>
    </div>
    <Card>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-slate-400">
            Total Invoices
          </p>
          <h2 className="text-3xl font-bold text-cyan-400">
            {invoices.length}
          </h2>
        </Card>
        <Card>
          <p className="text-slate-400">
            Search Results
          </p>
          <h2 className="text-3xl font-bold text-green-400">
            {filteredInvoices.length}
          </h2>
        </Card>
        <Card>
          <p className="text-slate-400">
            Revenue Generated
          </p>
          <h2 className="text-3xl font-bold text-purple-400">
            ₹ {
              invoices.reduce((sum,invoice)=>sum+invoice.total_amount,0).toFixed(0)
            }
          </h2>
        </Card>
      </div>
      <div className="mb-6 w-1/2">
        <SearchBar
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
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
              className="
              hover:bg-slate-800/50
              transition
              "
            >
              <td className="border p-3 font-semibold">
                #{invoice.invoice_id}
              </td>
              <td className="border p-3">
                <div className="flex items-center gap-3">
                  <div
                    className="
                    w-8
                    h-8
                    rounded-full
                    bg-cyan-500/20
                    text-cyan-400
                    flex
                    items-center
                    justify-center
                    font-bold
                    "
                  >
                    {invoice.customer_name?.charAt(0).toUpperCase()}
                  </div>
                  <span>
                    {invoice.customer_name}
                  </span>
                </div>
              </td>
              <td
                className="
                border
                p-3
                text-cyan-400
                "
              >
                {invoice.customer_phone}
              </td>
              <td
                className="
                border
                p-3
                text-green-400
                font-bold
                "
              >
                ₹ {invoice.total_amount}
              </td>
              <td className="border p-3">
                {
                  new Date(invoice.invoice_date).toLocaleDateString()
                }
              </td>
              <td className="border p-3">
                <div className="flex gap-2">
                  <Button onClick={() => viewInvoice(invoice.invoice_id)}>
                    View
                  </Button>
                  <Button onClick={() => downloadPDF(invoice.invoice_id)}>
                    PDF
                  </Button>
                </div>
              </td>
            </tr>
          )
        )}
      </Table>
    </Card>
    {
      filteredInvoices.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-400">
            No invoices found.
          </p>
        </div>
      )
    }
  </Layout>
);
}

export default Invoices;