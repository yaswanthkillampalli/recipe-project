import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import axios from "axios";

export default function Register({ setIsLoggedIn }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!fullName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/register", { fullName, email, password });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

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
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
              <div className="mb-3 d-flex flex-column">
                <label htmlFor="exampleInputName">Full Name</label>
                <input
                  type="text"
                  className={styles.inputFieldSettings}
                  id="exampleInputName"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
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
                  <button type="button" className="btn btn-primary" onClick={togglePasswordVisibility}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="mb-3 d-flex flex-column">
                <label htmlFor="exampleInputConfirmPass">Confirm Password</label>
                <div className="d-flex">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={styles.inputFieldSettings}
                    id="exampleInputConfirmPass"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="btn btn-primary" onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-end mb-2">
                <a href="#">Any issues? Contact support</a>
              </div>
              {error && <div className="text-danger text-center mb-2">{error}</div>}
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
            <div className="d-flex align-items-center justify-content-center mt-3">
              <Link to="/login">Already have an account? Login</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}