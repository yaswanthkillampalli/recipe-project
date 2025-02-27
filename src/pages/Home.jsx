import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import dishesData from "../data/dishes.json";

export default function Home() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState(dishesData);

  const increaseLikes = (section, index) => {
    const updatedSection = [...dishes[section]];
    updatedSection[index].likes += 1;
    setDishes({ ...dishes, [section]: updatedSection });
  };

  const tags = [
    "Chinese", "Morning Foods", "Italian Cuisine", "Desserts", "Healthy Snacks",
    "Vegan", "Gluten-Free", "Quick Meals", "Beverages", "Appetizers", "Main Course"
  ];

  const renderSection = (title, sectionKey) => (
    <section className="mt-3">
      <h2>{title}</h2>
      <div className="row">
        {dishes[sectionKey].map((dish, index) => (
          <div className="col-md-2" key={index}>
            <div
              className="card shadow-sm border-0 rounded-3"
              onClick={() => navigate(`/recipe/${index + 1}`)}
            >
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
                  >
                    ❤️ Like
                  </button>
                </div>
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

      <section className={styles.tagsSection}>
        <ul className={styles.listSettings}>
          {tags.map((tag, index) => (
            <li key={index}>
              <button className={styles.buttonSettings}>{tag}</button>
            </li>
          ))}
        </ul>
      </section>

      <main className="p-3">
        {renderSection("In Progress", "inProgress")}
        {renderSection("All Time Best", "allTimeBest")}
        {renderSection("Trending", "trending")}
        {renderSection("Today Specials", "todaySpecials")}
      </main>
    </>
  );
}