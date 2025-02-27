import { useState } from "react";
import axios from "axios";
import styles from "./ProfileModal.module.css";

export default function ProfileModal({ onClose }) {
  const userId = localStorage.getItem("userId");
  const [profile, setProfile] = useState({
    userId: Number(userId),
    username: localStorage.getItem("username") || "",
    fullName: localStorage.getItem("fullName") || "",
    email: localStorage.getItem("email") || "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile.username || !profile.fullName || !profile.email) {
      setError("All fields are required.");
      return;
    }
    localStorage.setItem("username", profile.username);
    localStorage.setItem("fullName", profile.fullName);
    localStorage.setItem("email", profile.email);
    axios
      .put(`http://localhost:5000/api/users/${userId}`, profile)
      .then((res) => {
        console.log("Profile updated:", res.data);
        onClose();
      })
      .catch((err) => {
        console.error("Error updating profile:", err.response?.data || err.message);
        setError("Failed to update profile. Please try again.");
      });
  };

  return (
    <div className={`${styles.modalContainer} modal fade show d-block`} tabIndex="-1">
      <div className="modal-dialog modal-md">
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h5 className={styles.modalTitle}>User Profile</h5>
            <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
          </div>
          <div className={styles.modalBody}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <form onSubmit={handleSubmit} id="profileForm">
              <div className="mb-3">
                <label htmlFor="username" className={styles.formLabel}>Username</label>
                <input
                  type="text"
                  className={styles.formInput}
                  id="username"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="fullName" className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  id="fullName"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className={styles.formLabel}>Email</label>
                <input
                  type="email"
                  className={styles.formInput}
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </form>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.closeFooterButton} onClick={onClose}>Close</button>
            <button type="submit" className={styles.saveButton} form="profileForm">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}