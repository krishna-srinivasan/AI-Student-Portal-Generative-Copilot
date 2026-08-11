import Background from "../components/Background";
import LoginForm from "../components/LoginForm";
import robot from "../assets/images/robot.png";

import "../styles/login.css";

function Login() {
  return (
    <div className="login-page">

      <Background />

      <div className="main-container">

        <div className="left-panel">

          <div className="robot-glow"></div>

          <img
            src={robot}
            alt="AI Robot"
            className="robot-image"
          />

        </div>

        <div className="right-panel">

          <LoginForm />

        </div>

      </div>

    </div>
  );
}

export default Login;

