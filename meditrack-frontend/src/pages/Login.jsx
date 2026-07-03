import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate();
  const handleLogin=async (e) => {
    e.preventDefault();
    try{
      const formData = new URLSearchParams();
      formData.append("username",email);
      formData.append("password",password);
      const response = await api.post(
        "/login",
        formData
      );
      localStorage.setItem(
        "token",
        response.data.access_token
      );
      alert("Login Successful");
      navigate("/dashboard");

    } catch (error) {
      alert(
        error.response?.data?.detail ||
        "Login Failed"
      );
    }
  };

  return (
    <div>
      <h1>MediTrack Pro Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
        <br /><br />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;