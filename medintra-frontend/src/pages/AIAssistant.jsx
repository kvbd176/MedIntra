import { useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";

function AIAssistant() {

  const [query,setQuery]=useState("");
  const [response,setResponse]=useState("");
  const [loading,setLoading] = useState(false);

  const askAI = async () => {
  try{
    setLoading(true);
    const token=localStorage.getItem("token");
    const res=await api.post(
      "/ai/chat",
      {query},
      {headers: { Authorization: `Bearer ${token}`}}
    );
    setResponse(res.data.answer);
    } 
    catch(error){
      console.log(error);
      setResponse(
        "AI Assistant is temporarily unavailable. Daily AI usage limit may have been reached. Please try again later."
      );
    } 
    finally{
      setLoading(false);
    }
  };

  return (
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
          AI Pharmacy Assistant
        </h1>

        <p className="text-slate-400 mt-2">
          Ask questions about inventory, sales, customers, distributors and business insights.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">

        <button
          onClick={() => setQuery("Show low stock medicines")}
          className="px-3 py-1 bg-slate-800 rounded-full text-sm"
        >
          Low Stock
        </button>

        <button
          onClick={() => setQuery("Show top customers")}
          className="px-3 py-1 bg-slate-800 rounded-full text-sm"
        >
          Top Customers
        </button>

        <button
          onClick={() => setQuery("Show estimated profit")}
          className="px-3 py-1 bg-slate-800 rounded-full text-sm"
        >
          Profit
        </button>

        <button
          onClick={() => setQuery("Show fast moving medicines")}
          className="px-3 py-1 bg-slate-800 rounded-full text-sm"
        >
          Fast Moving
        </button>

      </div>

      <div
        className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        p-6
        shadow-xl
        "
      >

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-cyan-400">
            Ask a Question
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Examples: Low stock medicines, top customers, profit report, fast moving medicines.
          </p>
        </div>

        <textarea
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          className="
          w-full
          bg-slate-950
          border
          border-slate-700
          rounded-xl
          p-4
          text-white
          focus:border-cyan-500
          outline-none
          resize-none
          "
          rows="5"
          placeholder="Ask anything about your pharmacy..."
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={askAI}
            disabled={loading}
            className="
            bg-gradient-to-r
            from-cyan-500
            to-blue-500
            hover:from-cyan-400
            hover:to-blue-400
            text-black
            px-6
            py-3
            rounded-xl
            font-bold
            transition
            shadow-lg
            disabled:opacity-50
            "
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

      </div>

      {response && (
        <div
          className="
          mt-8
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          shadow-xl
          overflow-hidden
          "
        >

          <div
            className="
            px-6
            py-4
            border-b
            border-slate-800
            bg-slate-950
            "
          >
            <h2 className="text-cyan-400 font-semibold text-lg">
              AI Response
            </h2>
          </div>

          <div
            className="
            p-6
            whitespace-pre-wrap
            text-slate-200
            leading-relaxed
            prose
            prose-invert
            max-w-none
            "
          >
            <ReactMarkdown>
              {response}
            </ReactMarkdown>
          </div>

        </div>
      )}

    </Layout>
  );
}

export default AIAssistant;