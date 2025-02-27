import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Saved.module.css";
import axios from "axios";

export default function Saved() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state || {};
  const userId = localStorage.getItem("userId") || "guest";
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/saved/${userId}`)
      .then((res) => {
        setLikedRecipes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching saved recipes:", err.response?.data || err.message);
        setError("Failed to load saved recipes.");
        setLoading(false);
      });
  }, [userId]);

  const increaseLikes = (index) => {
    setLikedRecipes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], likes: updated[index].likes + 1 };
      return updated;
    });
  };

  const removeRecipe = (index) => {
    setLikedRecipes((prev) => prev.filter((_, i) => i !== index));
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
          <input type="text" placeholder="Search Saved Recipes" className={styles.searchBarSettings} />
          <img src="/search.svg" alt="search" className={styles.searchSettings} />
        </div>
        <img
          src="/profile_dp.jpg"
          alt="user"
          className={`${styles.headerUserSettings} ms-4 me-2`}
        />
      </header>

      <main className="container p-3">
        <h1 className="mb-4">{user.username ? `${user.username}'s Saved Recipes` : "Saved Recipes"}</h1>
        {loading ? (
          <div className="text-center py-5">
            <p className="lead">Loading saved recipes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="lead text-danger">{error}</p>
          </div>
        ) : likedRecipes.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead">No saved recipes yet.</p>
            <Link to="/home" className="btn btn-primary">Explore Recipes</Link>
          </div>
        ) : (
          <div className="row">
            {likedRecipes.map((recipe, index) => (
              <div className="col-md-3 mb-4" key={recipe.id}>
                <div className="card shadow-sm border-0 rounded-3">
                  <img
                    src={recipe.image}
                    className="card-img-top rounded-top"
                    alt={recipe.title}
                  />
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
                    <div className="mt-auto d-flex justify-content-between">
                      <Link to={`/recipe/${recipe.id}`} className="btn btn-primary btn-sm">View Recipe</Link>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecipe(index);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}