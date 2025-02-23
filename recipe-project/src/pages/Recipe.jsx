import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styles from "./Recipe.module.css";
import axios from "axios";

export default function Recipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("username");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/recipes/${id}`)
      .then((res) => {
        setRecipe(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recipe:", err.response?.data || err.message);
        setError("Failed to load recipe.");
        setLoading(false);
      });
  }, [id]);

  const increaseLikes = () => {
    if (isLoggedIn) {
      setRecipe((prev) => ({ ...prev, likes: prev.likes + 1 }));
    }
  };

  const saveRecipe = () => {
    const userId = localStorage.getItem("userId");
    if (isLoggedIn && userId) {
      axios
        .post(`http://localhost:5000/api/saved/${userId}`, { recipeId: Number(id) })
        .then(() => alert("Recipe saved!"))
        .catch((err) => console.error("Error saving recipe:", err));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!recipe) return <div>No recipe found.</div>;

  return (
    <>
      <header className={styles.headerSettings}>
        <img src="/recipe-logo.jpg" alt="logo" className={styles.logoSettings} />
        <nav>
          <ul className={styles.listSettings}>
            <li className={styles.listItemSettings}><Link to={isLoggedIn ? "/home" : "/"}>Home</Link></li>
            {isLoggedIn && (
              <>
                <li className={styles.listItemSettings}><Link to="/trending">Trending</Link></li>
                <li className={styles.listItemSettings}><Link to="/saved">Saved</Link></li>
                <li className={styles.listItemSettings}><Link to="/published">Published</Link></li>
              </>
            )}
          </ul>
        </nav>
        <div className="d-flex ms-auto dummy12">
          <input type="text" placeholder="Search" className={styles.searchBarSettings} disabled={!isLoggedIn} />
          <img src="/search.svg" alt="search" className={styles.searchSettings} />
        </div>
        {isLoggedIn && (
          <img
            src="/profile_dp.jpg"
            alt="user"
            className={`${styles.headerUserSettings} ms-4 me-2`}
          />
        )}
      </header>

      <main className="container mt-4">
        <div className="d-flex gap-4">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="recipe-image"
            style={{ width: "300px", height: "300px", objectFit: "cover", borderRadius: "8px" }}
          />
          <section className="recipe-section flex-grow-1">
            <h1>{recipe.title}</h1>
            <div className="recipe-meta d-flex justify-content-between mb-3">
              <p>Published by: <strong>{recipe.author}</strong></p>
              <p className="likes">
                ❤️ {recipe.likes} Likes{" "}
                <button
                  onClick={increaseLikes}
                  className="btn btn-sm btn-outline-danger"
                  disabled={!isLoggedIn}
                >
                  Like
                </button>
              </p>
            </div>

            <div className="ingredients mb-4">
              <h2>Ingredients</h2>
              <ul>
                {recipe.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="steps">
              <h2>Step-by-Step Instructions</h2>
              <ol>
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </section>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <Link to={isLoggedIn ? "/home" : "/"} className="btn btn-secondary">
            Back to Home
          </Link>
          {isLoggedIn && (
            <button onClick={saveRecipe} className="btn btn-primary">
              Save Recipe
            </button>
          )}
        </div>
      </main>
    </>
  );
}