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

      <h1 className="text-4xl font-bold">
        AI Assistant
      </h1>

      <div className="mt-8">

        <textarea
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
          className="
          w-full
          bg-slate-900
          border
          border-slate-700
          rounded-xl
          p-4
          "
          rows="4"
          placeholder="Ask anything..."
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="
          mt-4
          bg-cyan-500
          text-black
          px-5
          py-3
          rounded-xl
          font-bold
          "
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>

        {response && (
          <div
            className="
            mt-6
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-6
            whitespace-pre-wrap
            text-slate-200
            leading-relaxed
            "
          >
            <ReactMarkdown>
              {response}
            </ReactMarkdown>
          </div>
        )}

      </div>

    </Layout>
  );
}

export default AIAssistant;