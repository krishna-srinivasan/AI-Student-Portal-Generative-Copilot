import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGraduationCap,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function RegisterForm() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (
      !fullName ||
      !email ||
      !course ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await api.post("/auth/register", {
        full_name: fullName,
        email: email,
        course: course,
        password: password,
      });

      alert("✅ Registration Successful");

      navigate("/");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Registration Failed");
      }
    }
  };

  return (
    <div className="login-card register-card">

      <div className="logo-circle">
        🤖
      </div>

      <h1 className="portal-title">
        AI STUDENT PORTAL
      </h1>

      <p className="portal-subtitle">
        Create your account
      </p>

      <div className="divider"></div>

      {/* Full Name */}

      <div className="input-box">
        <FaUser className="input-icon" />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      {/* Email */}

      <div className="input-box">
        <FaEnvelope className="input-icon" />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Course */}

      <div className="input-box">
        <FaGraduationCap className="input-icon" />

        <input
          type="text"
          placeholder="Course / Program"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />
      </div>

      {/* Password */}

      <div className="input-box">
        <FaLock className="input-icon" />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password */}

      <div className="input-box">
        <FaLock className="input-icon" />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button
        className="login-btn"
        onClick={handleRegister}
      >
        🚀 Create Account
      </button>

      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        Already have an account?{" "}
        <span
          style={{
            color: "#00d4ff",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>

    </div>
  );
}

export default RegisterForm;












