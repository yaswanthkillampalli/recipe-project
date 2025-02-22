import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./NotLHome.module.css";
import axios from "axios";
import dishesData from "../data/dishes.json";

export default function NotLHome() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState(dishesData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/dishes")
      .then((res) => {
        setDishes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching dishes:", err.response?.data || err.message);
        setError("Failed to load dishes.");
        setLoading(false);
      });
  }, []);

  const increaseLikes = (section, index) => {
    setDishes((prevDishes) => {
      const updatedSection = [...prevDishes[section]];
      updatedSection[index] = { ...updatedSection[index], likes: updatedSection[index].likes + 1 };
      return { ...prevDishes, [section]: updatedSection };
    });
  };

  const tags = [
    "Chinese", "Morning Foods", "Italian Cuisine", "Desserts", "Healthy Snacks",
    "Vegan", "Gluten-Free", "Quick Meals", "Beverages", "Appetizers", "Main Course"
  ];

  const renderSection = (title, sectionKey) => (
    <section className="mt-4">
      <h2 className="mb-3">{title}</h2>
      <div className="row">
        {dishes[sectionKey].slice(0, 3).map((dish, index) => (
          <div className="col-md-4" key={`${sectionKey}-${index}`}>
            <div className="card shadow-sm border-0 rounded-3">
              <img
                src={dish.image}
                className="card-img-top rounded-top"
                alt={dish.title}
              />
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">{dish.title}</h5>
                  <p className="card-text text-muted">⏳ {dish.time}</p>
                </div>
                <div className="text-center">
                  <p className="mb-0 fw-bold text-danger">{dish.likes}</p>
                  <button
                    className="btn btn-sm btn-light border"
                    onClick={(e) => {
                      e.stopPropagation();
                      increaseLikes(sectionKey, index);
                    }}
                    disabled
                  >
                    ❤️ Like
                  </button>
                </div>
              </div>
              <div className="card-footer text-muted text-center">
                <Link to="/login">Login to view recipe</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <>
      <header className={styles.headerSettings}>
        <img src="/recipe-logo.jpg" alt="logo" className={styles.logoSettings} />
        <nav>
          <ul className={styles.listSettings}>
            <li className={styles.listItemSettings}><Link to="/">Home</Link></li>
          </ul>
        </nav>
        <div className="d-flex ms-auto me-3 align-items-center">
          <input
            type="text"
            placeholder="Search"
            className={styles.searchBarSettings}
            disabled
          />
          <Link to="/login">
            <button className={`${styles.headerRegisterButtonSettings} ms-1 me-1`}>Login</button>
          </Link>
          <Link to="/register">
            <button className={`${styles.headerRegisterButtonSettings} ms-1 me-1`}>Register</button>
          </Link>
        </div>
      </header>

      <main className="container p-3">
        {loading ? (
          <div className="text-center py-5">
            <p className="lead">Loading dishes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="lead text-danger">{error}</p>
          </div>
        ) : (
          <>
            <section className={`${styles.tagsSection} container mt-4`}>
              <h5>Explore by Category</h5>
              <ul className={`${styles.listSettings} d-flex flex-wrap justify-content-center`}>
                {tags.slice(0, 8).map((tag, index) => (
                  <li key={index} className="m-1">
                    <button className={styles.buttonSettings} disabled>{tag}</button>
                  </li>
                ))}
              </ul>
              <p className="text-center mt-3">
                <Link to="/login">Login</Link> to explore all categories!
              </p>
            </section>

            {renderSection("In Progress", "inProgress")}
            {renderSection("All Time Best", "allTimeBest")}
            {renderSection("Trending", "trending")}
            {renderSection("Today Specials", "todaySpecials")}
          </>
        )}
      </main>
    </>
  );
}