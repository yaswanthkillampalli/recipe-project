import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useState } from "react";
import axios from "axios";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("email", res.data.email);
      setIsLoggedIn(true);
      navigate("/home", {
        state: { userId: res.data.userId, username: res.data.username, email: res.data.email }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <header className={styles.headerSettings}>
        <img src="/recipe-logo.jpg" alt="logo" className={styles.logoSettings} />
        <nav>
          <ul className={styles.listSettings}>
            <li className={styles.listItemSettings}><Link to="/">Home</Link></li>
            <li className={styles.listItemSettings}><Link to="/trending">Trending</Link></li>
          </ul>
        </nav>
        <div className="d-flex ms-auto me-3">
          <Link to="/login">
            <button className={`${styles.headerLoginButtonSettings} ms-1 me-1`}>Login</button>
          </Link>
          <Link to="/register">
            <button className={`${styles.headerRegisterButtonSettings} ms-1 me-1`}>Register</button>
          </Link>
        </div>
      </header>

      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh", backgroundColor: "white", backgroundSize: "cover" }}
      >
        <div className={`${styles.loginContainerSettings} d-flex`}>
          <div className={`${styles.loginLeftCard} p-3`} style={{ width: "50%" }}>
            <h1 className={styles.greetSettings}>Welcome to<br />Recipe Book</h1>
          </div>
          <div className="p-3">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-3 d-flex flex-column">
                <label htmlFor="exampleInputEmail1">Email</label>
                <input
                  type="email"
                  className={styles.inputFieldSettings}
                  id="exampleInputEmail1"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3 d-flex flex-column">
                <label htmlFor="exampleInputPass">Password</label>
                <div className="d-flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.inputFieldSettings}
                    id="exampleInputPass"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-end mb-2">
                <a href="#">Forgot password?</a>
              </div>
              {error && <div className="text-danger text-center mb-2">{error}</div>}
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
            <div className="d-flex align-items-center justify-content-center mt-3">
              <Link to="/register">Don't have an account? Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}