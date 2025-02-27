import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Trending.module.css";
import ProfileModal from "../components/profileModal";

export default function Trending() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "User";
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/trending")
      .then((res) => {
        setTrendingRecipes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trending recipes:", err.response?.data || err.message);
        setError("Failed to load trending recipes. Please try again later.");
        setLoading(false);
      });
  }, []);

  const increaseLikes = (index) => {
    setTrendingRecipes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], likes: updated[index].likes + 1 };
      return updated;
    });
  };

  return (
    <>
      <header className={styles.headerSettings}>
        <img src="/recipe-logo.jpg" alt="logo" className={styles.logoSettings} />
        <nav>
          <ul className={styles.listSettings}>
            <li className={styles.listItemSettings}><Link to="/home">Home</Link></li>
            <li className={styles.listItemSettings}><Link to="/trending">Trending</Link></li>
            <li className={styles.listItemSettings}><Link to="/saved">Saved</Link></li>
            <li className={styles.listItemSettings}><Link to="/published">Published</Link></li>
          </ul>
        </nav>
        <div className="d-flex ms-auto dummy12 align-items-center">
          <input type="text" placeholder="Search trending recipes" className={styles.searchBarSettings} />
          <img src="/search.svg" alt="search" className={styles.searchSettings} />
        </div>
        <img
          src="/profile_dp.jpg"
          alt="user"
          className={`${styles.headerUserSettings} ms-4 me-2`}
          onClick={() => setShowProfileModal(true)}
          style={{ cursor: "pointer" }}
        />
      </header>

      <main className="container p-3">
        <h1 className="mb-4">Trending Recipes</h1>
        <p>Welcome back, {username}!</p>
        {loading ? (
          <div className="text-center py-5">
            <p className="lead">Loading trending recipes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="lead text-danger">{error}</p>
          </div>
        ) : trendingRecipes.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead">No trending recipes available.</p>
          </div>
        ) : (
          <div className="row">
            {trendingRecipes.map((recipe, index) => (
              <div className="col-md-4 mb-4" key={recipe.id}>
                <div className="card shadow-sm border-0 rounded-3">
                  <div className="position-relative">
                    <img
                      src={recipe.image}
                      className="card-img-top rounded-top"
                      alt={recipe.title}
                    />
                    <span className="badge bg-success position-absolute top-0 end-0 m-2">
                      #{index + 1} Trending
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title mb-0">{recipe.title}</h5>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          increaseLikes(index);
                        }}
                      >
                        ❤️ {recipe.likes}
                      </button>
                    </div>
                    <p className="card-text text-muted">⏳ {recipe.time}</p>
                    <p className="text-muted small">Trend Score: {recipe.trendScore}%</p>
                    <div className="mt-auto">
                      <Link to={`/recipe/${recipe.id}`} className="btn btn-primary btn-sm w-100">View Recipe</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
}