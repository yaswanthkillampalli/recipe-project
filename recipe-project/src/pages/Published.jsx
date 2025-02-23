import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./Published.module.css";

export default function Published() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const username = location.state?.username || localStorage.getItem("username");
  const [publishedRecipes, setPublishedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    time: "",
    image: "",
    ingredients: [""],
    steps: [""],
    likes: 0,
    userId: Number(userId),
  });
  const [editRecipe, setEditRecipe] = useState(null);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/published?userId=${userId}`)
      .then((res) => {
        setPublishedRecipes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching published recipes:", err.response?.data || err.message);
        setError("Failed to load published recipes.");
        setLoading(false);
      });
  }, [userId]);

  const increaseLikes = (id) => {
    setPublishedRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, likes: recipe.likes + 1 } : recipe
      )
    );
  };

  const handleShowPublishModal = () => setShowPublishModal(true);
  const handleClosePublishModal = () => {
    setShowPublishModal(false);
    setNewRecipe({
      title: "",
      time: "",
      image: "",
      ingredients: [""],
      steps: [""],
      likes: 0,
      userId: Number(userId),
    });
    setModalError(null);
  };

  const handleShowEditModal = (recipe) => {
    setEditRecipe(recipe);
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditRecipe(null);
    setModalError(null);
  };

  const handleChange = (e, isEdit = false) => {
    const setter = isEdit ? setEditRecipe : setNewRecipe;
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleIngredientChange = (index, value, isEdit = false) => {
    const setter = isEdit ? setEditRecipe : setNewRecipe;
    setter((prev) => {
      const updatedIngredients = [...prev.ingredients];
      updatedIngredients[index] = value;
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const addIngredient = (isEdit = false) => {
    const setter = isEdit ? setEditRecipe : setNewRecipe;
    setter((prev) => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
  };

  const handleStepChange = (index, value, isEdit = false) => {
    const setter = isEdit ? setEditRecipe : setNewRecipe;
    setter((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index] = value;
      return { ...prev, steps: updatedSteps };
    });
  };

  const addStep = (isEdit = false) => {
    const setter = isEdit ? setEditRecipe : setNewRecipe;
    setter((prev) => ({ ...prev, steps: [...prev.steps, ""] }));
  };

  const handlePublishSubmit = (e) => {
    e.preventDefault();
    if (!newRecipe.title || !newRecipe.time || !newRecipe.image) {
      setModalError("Please fill in all required fields (Title, Time, Image).");
      return;
    }
    axios
      .post("http://localhost:5000/api/published", newRecipe)
      .then((res) => {
        setPublishedRecipes((prev) => [...prev, res.data]);
        handleClosePublishModal();
      })
      .catch((err) => {
        console.error("Error publishing recipe:", err.response?.data || err.message);
        setModalError("Failed to publish recipe. Please try again.");
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editRecipe.title || !editRecipe.time || !editRecipe.image) {
      setModalError("Please fill in all required fields (Title, Time, Image).");
      return;
    }
    // Note: You'll need to add a PUT endpoint in server.js for editing
    axios
      .put(`http://localhost:5000/api/published/${editRecipe.id}`, editRecipe)
      .then((res) => {
        setPublishedRecipes((prev) =>
          prev.map((r) => (r.id === editRecipe.id ? res.data : r))
        );
        handleCloseEditModal();
      })
      .catch((err) => {
        console.error("Error editing recipe:", err.response?.data || err.message);
        setModalError("Failed to edit recipe. Please try again.");
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

      <main className="p-3">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Published Recipes</h1>
            <button className="btn btn-success" onClick={handleShowPublishModal}>
              Publish New Recipe
            </button>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <p className="lead">Loading your recipes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <p className="lead text-danger">{error}</p>
            </div>
          ) : publishedRecipes.length === 0 ? (
            <div className="text-center py-5">
              <p className="lead">You haven’t published any recipes yet. Start sharing!</p>
            </div>
          ) : (
            <div className="row">
              {publishedRecipes.map((recipe) => (
                <div className="col-md-2" key={recipe.id}>
                  <div className="card shadow-sm border-0 rounded-3 position-relative">
                    <button
                      className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
                      onClick={() => handleShowEditModal(recipe)}
                    >
                      ✏️
                    </button>
                    <Link to={`/recipe/${recipe.id}`}>
                      <img
                        src={recipe.image}
                        className="card-img-top rounded-top"
                        alt={recipe.title}
                      />
                    </Link>
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title mb-1">{recipe.title}</h5>
                        <p className="card-text text-muted">⏳ {recipe.time}</p>
                      </div>
                      <div className="text-center">
                        <p className="mb-0 fw-bold text-danger">{recipe.likes}</p>
                        <button
                          className="btn btn-sm btn-light border"
                          onClick={() => increaseLikes(recipe.id)}
                        >
                          ❤️ Like
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publish Modal */}
        <div className={`modal fade ${showPublishModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Publish New Recipe</h5>
                <button type="button" className="btn-close" onClick={handleClosePublishModal}></button>
              </div>
              <div className="modal-body">
                {modalError && <div className="alert alert-danger">{modalError}</div>}
                <form onSubmit={handlePublishSubmit} id="publishForm">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Recipe Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={newRecipe.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="time" className="form-label">Cooking Time</label>
                    <input
                      type="text"
                      className="form-control"
                      id="time"
                      name="time"
                      value={newRecipe.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      id="image"
                      name="image"
                      value={newRecipe.image}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ingredients</label>
                    {newRecipe.ingredients.map((ingredient, index) => (
                      <input
                        key={index}
                        type="text"
                        className="form-control mb-2"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                      />
                    ))}
                    <button type="button" className="btn btn-outline-primary" onClick={addIngredient}>
                      Add Ingredient
                    </button>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Steps</label>
                    {newRecipe.steps.map((step, index) => (
                      <input
                        key={index}
                        type="text"
                        className="form-control mb-2"
                        value={step}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        placeholder={`Step ${index + 1}`}
                      />
                    ))}
                    <button type="button" className="btn btn-outline-primary" onClick={addStep}>
                      Add Step
                    </button>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClosePublishModal}>
                  Close
                </button>
                <button type="submit" className="btn btn-success" form="publishForm">
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editRecipe && (
          <div className={`modal fade ${showEditModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Recipe</h5>
                  <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                </div>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger">{modalError}</div>}
                  <form onSubmit={handleEditSubmit} id="editForm">
                    <div className="mb-3">
                      <label htmlFor="editTitle" className="form-label">Recipe Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editTitle"
                        name="title"
                        value={editRecipe.title}
                        onChange={(e) => handleChange(e, true)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="editTime" className="form-label">Cooking Time</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editTime"
                        name="time"
                        value={editRecipe.time}
                        onChange={(e) => handleChange(e, true)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="editImage" className="form-label">Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editImage"
                        name="image"
                        value={editRecipe.image}
                        onChange={(e) => handleChange(e, true)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ingredients</label>
                      {editRecipe.ingredients.map((ingredient, index) => (
                        <input
                          key={index}
                          type="text"
                          className="form-control mb-2"
                          value={ingredient}
                          onChange={(e) => handleIngredientChange(index, e.target.value, true)}
                          placeholder={`Ingredient ${index + 1}`}
                        />
                      ))}
                      <button type="button" className="btn btn-outline-primary" onClick={() => addIngredient(true)}>
                        Add Ingredient
                      </button>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Steps</label>
                      {editRecipe.steps.map((step, index) => (
                        <input
                          key={index}
                          type="text"
                          className="form-control mb-2"
                          value={step}
                          onChange={(e) => handleStepChange(index, e.target.value, true)}
                          placeholder={`Step ${index + 1}`}
                        />
                      ))}
                      <button type="button" className="btn btn-outline-primary" onClick={() => addStep(true)}>
                        Add Step
                      </button>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" form="editForm">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}