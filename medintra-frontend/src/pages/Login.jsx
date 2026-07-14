import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const navigate=useNavigate();

  const handleLogin=async(e)=>{
    e.preventDefault();

    try{

      const formData=new URLSearchParams();

      formData.append("username",email);
      formData.append("password",password);

      const response=await api.post(
        "/login",
        formData
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      navigate("/dashboard");

    }catch(error){

      alert(
        error.response?.data?.detail ||
        "Login Failed"
      );
    }
  };

  return (

    <div className="min-h-screen flex bg-slate-950">

      {/* LEFT SECTION */}

      <div className="
      hidden
      lg:flex
      w-1/2
      flex-col
      justify-center
      px-20
      relative
      overflow-hidden
      ">

        <div className="
        absolute
        w-96
        h-96
        bg-cyan-500/20
        blur-[120px]
        rounded-full
        top-10
        left-10
        " />

        <h1 className="
        text-6xl
        font-extrabold
        bg-gradient-to-r
        from-cyan-400
        to-blue-500
        bg-clip-text
        text-transparent
        ">
          MediTrack Pro
        </h1>

        <p className="
        mt-6
        text-xl
        text-slate-300
        max-w-lg
        ">
          AI Powered Pharmacy Management System
          for inventory tracking, billing,
          distributors, customers and
          intelligent business insights.
        </p>

        <div className="mt-12 space-y-5">

          <div className="text-slate-300">
            ✓ Smart Inventory Tracking
          </div>

          <div className="text-slate-300">
            ✓ AI Pharmacy Assistant
          </div>

          <div className="text-slate-300">
            ✓ Distributor Analytics
          </div>

          <div className="text-slate-300">
            ✓ Demand Forecasting
          </div>

        </div>

      </div>

      {/* RIGHT SECTION */}

      <div className="
      flex
      w-full
      lg:w-1/2
      items-center
      justify-center
      p-8
      ">

        <div className="
        w-full
        max-w-md
        bg-slate-900/70
        backdrop-blur-xl
        border
        border-slate-800
        rounded-3xl
        p-10
        shadow-2xl
        ">

          <h2 className="
          text-3xl
          font-bold
          text-white
          text-center
          ">
            Welcome Back
          </h2>

          <p className="
          text-slate-400
          text-center
          mt-2
          mb-8
          ">
            Login to your pharmacy dashboard
          </p>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="
              w-full
              bg-slate-950
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              focus:border-cyan-500
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="
              w-full
              bg-slate-950
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              focus:border-cyan-500
              "
            />

            <button
              type="submit"
              className="
              w-full
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              text-white
              font-bold
              py-3
              rounded-xl
              hover:scale-[1.02]
              transition-all
              "
            >
              Login
            </button>

            <div className="mt-6 text-center">

              <span className="text-slate-400">
                Don't have an account?
              </span>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="
                ml-2
                text-cyan-400
                font-semibold
                hover:text-cyan-300
                "
              >
                Create Account
              </button>

            </div>
          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;