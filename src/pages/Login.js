import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { AnimatedPage } from "../components/AnimatedPage";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  useEffect(() => {
    document.title = "Login";
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [consecutiveSuccess, setConsecutiveSuccess] = useState(0); 
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    if (localStorage.getItem("role") === "user") {
      navigate("/profile");
    } else {
      navigate("/admin");
    }
    window.location.reload()
    setConsecutiveSuccess(0)
  };
  const headers = new Headers();
  
  headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);
  headers.set('content-type', 'application/json');
  const handleSubmit = async (event) => {
    event.preventDefault()
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers,
    });
    
    if (response.ok) {
      const data = await response.json();
      const token = btoa(`${username}:${password}`)
      localStorage.setItem("role", data.Status)
      localStorage.setItem('token', token)
      if (consecutiveSuccess === 0) { 
      toast.success("Login successful", {
        onClose: handleLoginSuccess
      });
    }
    setConsecutiveSuccess(consecutiveSuccess + 1);
    } else {
        toast.error("Invalid username or password");
    }
  };

  return (
    <AnimatedPage>
      <ToastContainer autoClose={1300}/>
      <div className="login-wrapper">
      <div className="form-block">
        <div className="side-image"></div>
        <form method="#" className="log-in" onSubmit={handleSubmit}>
          <h1>
            <span className="highlight">Log in</span>
          </h1>
          <div className="floating-label">
            <input
              className="input"
              placeholder="Username"
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
            />
            <label htmlFor="username">Username:</label>
          </div>
          <div className="floating-label">
            <input
              className="input"
              placeholder="Password"
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
            <label htmlFor="password">Password:</label>
          </div>
          <h3>
            Don`t have an account yet?{" "}
            <Link to="/register" target="_self">
              Sign up!
            </Link>
          </h3>
          <Button Title="Log in" Id="login-btn" />
        </form>
      </div>
      </div>
    </AnimatedPage>
  );
}
