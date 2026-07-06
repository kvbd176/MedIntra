import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {

  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [pharmacyName,setPharmacyName]=useState("");
  const [ownerName,setOwnerName]=useState("");
  const [phone,setPhone]=useState("");

  const navigate=useNavigate();

  const handleRegister=async (e) => {
    e.preventDefault();
    try{
        const payload={
        username,
        email,
        password,
        pharmacy_name: pharmacyName,
        owner_name: ownerName,
        phone
        };
        const response=await api.post(
        "/register",
        payload
        );
        alert("Account Created Successfully. Please login.");
        navigate("/");
    } catch (error) {

        console.log("STEP ERROR");

        console.log(error);
            if(error.response?.data?.detail==="Email already registered"){
            alert("An account with this email already exists.");
            }
            else{
            alert(error.response?.data?.detail || "Registration Failed");
            }
    }
    };

  return (

    <div className="
    min-h-screen
    flex
    justify-center
    items-center
    bg-slate-950
    ">

      <div className="
      w-full
      max-w-md
      bg-slate-900
      border
      border-slate-800
      rounded-3xl
      p-8
      ">

        <h1 className="
        text-3xl
        text-white
        font-bold
        mb-6
        ">
          Create Account
        </h1>

        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >

          <input
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-950
            border
            border-slate-700
            text-white
            "
          />

          <input
            placeholder="Pharmacy Name"
            value={pharmacyName}
            onChange={(e)=>setPharmacyName(e.target.value)}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-950
            border
            border-slate-700
            text-white
            "
            />

            <input
            placeholder="Owner Name"
            value={ownerName}
            onChange={(e)=>setOwnerName(e.target.value)}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-950
            border
            border-slate-700
            text-white
            "
            />

            <input
            placeholder="Phone Number"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-950
            border
            border-slate-700
            text-white
            "
            />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-950
            border
            border-slate-700
            text-white
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="
            w-full
            p-3
            rounded-xl
            bg-slate-950
            border
            border-slate-700
            text-white
            "
          />

          <button
            type="submit"
            className="
            w-full
            bg-cyan-500
            text-black
            font-bold
            py-3
            rounded-xl
            "
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;