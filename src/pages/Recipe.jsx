import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import styles from "./Recipe.module.css";
import axios from "axios";

export default function Recipe() {
  const { id } = useParams();
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "User";
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
    setRecipe((prev) => ({ ...prev, likes: prev.likes + 1 }));
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
            <li className={styles.listItemSettings}><Link to="/home">Home</Link></li>
            <li className={styles.listItemSettings}><Link to="/trending">Trending</Link></li>
            <li className={styles.listItemSettings}><Link to="/saved">Saved</Link></li>
            <li className={styles.listItemSettings}><Link to="/published">Published</Link></li>
          </ul>
        </nav>
        <div className="d-flex ms-auto dummy12">
          <input type="text" placeholder="Search" className={styles.searchBarSettings} />
          <img src="/search.svg" alt="search" className={styles.searchSettings} />
        </div>
        <img
          src="/profile_dp.jpg"
          alt="user"
          className={`${styles.headerUserSettings} ms-4 me-2`}
        />
      </header>

      <main className={`${styles.main} container mt-4`}>
        <h1>Welcome back, {username}!</h1>
        <div className="row">
          <div className="col-md-6">
            <img
              src={recipe.image}
              alt={recipe.title}
              className={`${styles.recipeImage} img-fluid rounded`}
            />
          </div>
          <div className="col-md-6">
            <h1 className="mb-3">{recipe.title}</h1>
            <div className={`${styles.recipeMeta} d-flex justify-content-between align-items-center mb-4`}>
              <p>Published by: <strong>{recipe.author}</strong></p>
              <p className={styles.likes}>
                ❤️ {recipe.likes} Likes{" "}
                <button onClick={increaseLikes} className="btn btn-sm btn-outline-danger">Like</button>
              </p>
            </div>
            <div className={styles.ingredients}>
              <h2>Ingredients</h2>
              <ul className="list-group list-group-flush">
                {recipe.ingredients.map((item, index) => (
                  <li key={index} className="list-group-item">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-5">
          <h2>Step-by-Step Instructions</h2>
          <ol className="list-group list-group-numbered">
            {recipe.steps.map((step, index) => (
              <li key={index} className="list-group-item">{step}</li>
            ))}
          </ol>
        </section>

        <div className="d-flex justify-content-between mt-4">
          <Link to="/home" className="btn btn-secondary">Back to Home</Link>
          {username && <button className="btn btn-primary">Save Recipe</button>}
        </div>
      </main>
    </>
  );
}