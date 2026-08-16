// import { useState } from "react";
// import {
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// function LoginForm() {

//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);

//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {

//     try {

//       setLoading(true);

//       const formData = new URLSearchParams();

//       formData.append("username", email);
//       formData.append("password", password);

//       const response = await api.post(

//         "/auth/login",

//         formData,

//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded"
//           }
//         }

//       );

//       localStorage.setItem(
//         "token",
//         response.data.access_token
//       );

//       localStorage.setItem(
//         "name",
//         response.data.name
//       );

//       localStorage.setItem(
//         "course",
//         response.data.course
//       );

//       localStorage.setItem(
//         "email",
//         response.data.email
//       );

//       alert("✅ Login Successful");

//       navigate("/dashboard");

//     }

//     catch (error) {

//       console.log(error);

//       alert("❌ Invalid Email or Password");

//     }

//     finally {

//       setLoading(false);

//     }

//   };

//   return (

//     <div className="login-card">

//       <div className="logo-circle">
//         🤖
//       </div>

//       <h1 className="portal-title">
//         AI STUDENT PORTAL
//       </h1>

//       <p className="portal-subtitle">
//         Intelligent Academic Assistant
//       </p>

//       <div className="divider"></div>

//       <div className="input-box">

//         <FaEnvelope className="input-icon" />

//         <input
//           type="email"
//           placeholder="Enter your Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//       </div>

//       <div className="input-box">

//         <FaLock className="input-icon" />

//         <input
//           type={showPassword ? "text" : "password"}
//           placeholder="Enter your Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button
//           className="eye-btn"
//           type="button"
//           onClick={() => setShowPassword(!showPassword)}
//         >
//           {showPassword ? <FaEyeSlash /> : <FaEye />}
//         </button>

//       </div>

//       <button
//         className="login-btn"
//         onClick={handleLogin}
//         disabled={loading}
//       >
//         {loading ? "Logging in..." : "🚀 LOGIN"}
//       </button>

//       <p
//         style={{
//           marginTop: "20px",
//           textAlign: "center",
//           color: "#b0b0b0"
//         }}
//       >
//         Don't have an account?{" "}

//         <span
//           onClick={() => navigate("/register")}
//           style={{
//             color: "#00d4ff",
//             cursor: "pointer",
//             fontWeight: "600"
//           }}
//         >
//           Create New Account
//         </span>

//       </p>

//       <div className="login-footer">

//         <span className="footer-dot"></span>

//         <span>
//           Powered by <b>Generative AI</b>
//         </span>

//         <span className="footer-dot"></span>

//       </div>

//     </div>

//   );

// }

// export default LoginForm;



import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("⚠️ Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("username", email.trim());
      formData.append("password", password);

      const response = await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      // Save user session details
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("course", response.data.course);
      localStorage.setItem("email", response.data.email);

      alert("✅ Login Successful");
      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      // Distinguish between actual authentication errors and server/network issues
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 400) {
          alert("❌ Invalid Email or Password");
        } else if (error.response.status === 503 || error.response.status === 504) {
          alert("⏳ Server is warming up. Please try again in a few seconds.");
        } else {
          alert(`❌ Server error (${error.response.status}). Please try again.`);
        }
      } else if (error.request) {
        alert("🌐 Network error or server connecting. Please try again.");
      } else {
        alert("❌ An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <div className="logo-circle">🤖</div>

      <h1 className="portal-title">AI STUDENT PORTAL</h1>
      <p className="portal-subtitle">Intelligent Academic Assistant</p>

      <div className="divider"></div>

      <form onSubmit={handleLogin}>
        <div className="input-box">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="input-box">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            className="eye-btn"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          className="login-btn"
          type="submit"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Connecting..." : "🚀 LOGIN"}
        </button>
      </form>

      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
          color: "#b0b0b0"
        }}
      >
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{
            color: "#00d4ff",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Create New Account
        </span>
      </p>

      <div className="login-footer">
        <span className="footer-dot"></span>
        <span>
          Powered by <b>Generative AI</b>
        </span>
        <span className="footer-dot"></span>
      </div>
    </div>
  );
}

export default LoginForm;