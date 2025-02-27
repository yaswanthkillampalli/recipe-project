const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());

let users = JSON.parse(fs.readFileSync("./users.json", "utf8"));

const recipesData = [
  {
    id: 1,
    title: "Classic Spaghetti Carbonara",
    author: "Chef John",
    likes: 1234,
    image: "/dish2.jpg",
    ingredients: [
      "400g spaghetti",
      "150g pancetta, diced",
      "2 large eggs",
      "1 cup grated Parmesan cheese",
      "2 cloves garlic, minced",
      "Salt and black pepper to taste",
      "Fresh parsley, chopped (for garnish)"
    ],
    steps: [
      "Cook spaghetti until al dente. Reserve 1 cup of pasta water.",
      "Cook pancetta until crispy. Add garlic.",
      "Whisk eggs and Parmesan.",
      "Toss spaghetti with pancetta, then egg mixture. Add water as needed.",
      "Season and garnish."
    ]
  },
  {
    id: 2,
    title: "Chicken Stir Fry",
    author: "Chef Amy",
    likes: 85,
    image: "/dish1.jpg",
    ingredients: [
      "500g chicken breast, sliced",
      "2 tbsp soy sauce",
      "1 bell pepper, sliced",
      "1 broccoli head, chopped",
      "2 tbsp vegetable oil",
      "1 tsp ginger, minced",
      "Salt and pepper to taste"
    ],
    steps: [
      "Marinate chicken in soy sauce.",
      "Heat oil, add ginger, then chicken.",
      "Add bell pepper and broccoli.",
      "Season and serve."
    ]
  }
];

const dishesData = {
  allTimeBest: [
    { title: "Spaghetti Bolognese", time: "45 mins", likes: 300, image: "/dish7.jpg" },
    { title: "Pizza Margherita", time: "30 mins", likes: 450, image: "/dish8.jpg" },
    { title: "Butter Chicken", time: "50 mins", likes: 275, image: "/dish9.jpg" },
    { title: "Chocolate Cake", time: "1 hr", likes: 320, image: "/dish10.jpg" },
    { title: "Caesar Salad", time: "15 mins", likes: 180, image: "/dish11.jpg" },
    { title: "Sushi Rolls", time: "40 mins", likes: 210, image: "/dish12.jpg" }
  ],
  todaySpecials: [
    { title: "Fish Curry", time: "40 mins", likes: 130, image: "/dish19.jpg" },
    { title: "Steak Fries", time: "45 mins", likes: 220, image: "/dish20.jpg" },
    { title: "Quinoa Salad", time: "20 mins", likes: 95, image: "/dish21.jpg" },
    { title: "Pancakes", time: "25 mins", likes: 310, image: "/dish22.jpg" },
    { title: "Lamb Chops", time: "50 mins", likes: 160, image: "/dish23.jpg" },
    { title: "Mango Sorbet", time: "30 mins", likes: 140, image: "/dish24.jpg" }
  ]
};

const trendingRecipesData = [
  { id: 13, title: "Avocado Toast", time: "10 mins", likes: 500, image: "/dish13.jpg", trendScore: 98 },
  { id: 1, title: "Classic Spaghetti Carbonara", time: "45 mins", likes: 1234, image: "/dish2.jpg", trendScore: 87 }
];

let publishedRecipesData = [];

app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      res.json({ userId: user.userId, username: user.username, email: user.email });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.error("Error in /login:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/register", (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (users.some((u) => u.email === email)) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const username = fullName.toLowerCase().replace(/\s+/g, "") + Math.floor(Math.random() * 1000);
    const newUser = {
      userId: users.length + 1,
      email,
      password,
      username,
      fullName,
      savedRecipes: []
    };
    users.push(newUser);
    fs.writeFileSync("./users.json", JSON.stringify(users, null, 2), "utf8");
    res.status(201).json({ message: "Registration successful", userId: newUser.userId });
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/recipes/:id", (req, res) => {
  try {
    const recipe = recipesData.find((r) => r.id === parseInt(req.params.id));
    if (recipe) res.json(recipe);
    else res.status(404).json({ message: "Recipe not found" });
  } catch (err) {
    console.error("Error in /api/recipes/:id:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/dishes", (req, res) => {
  try {
    res.json(dishesData);
  } catch (err) {
    console.error("Error in /api/dishes:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/saved/:userId", (req, res) => {
  try {
    const user = users.find((u) => u.userId === parseInt(req.params.userId));
    if (!user) return res.status(404).json({ message: "User not found" });
    const saved = recipesData.filter((r) => user.savedRecipes.includes(r.id));
    res.json(saved);
  } catch (err) {
    console.error("Error in /api/saved/:userId:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/saved/:userId", (req, res) => {
  try {
    const user = users.find((u) => u.userId === parseInt(req.params.userId));
    if (!user) return res.status(404).json({ message: "User not found" });
    const { recipeId } = req.body;
    if (!user.savedRecipes.includes(recipeId)) {
      user.savedRecipes.push(recipeId);
      fs.writeFileSync("./users.json", JSON.stringify(users, null, 2));
    }
    res.json(user.savedRecipes);
  } catch (err) {
    console.error("Error in POST /api/saved/:userId:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/trending", (req, res) => {
  try {
    const sorted = [...trendingRecipesData].sort((a, b) => b.trendScore - a.trendScore);
    res.json(sorted);
  } catch (err) {
    console.error("Error in /api/trending:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/published", (req, res) => {
  try {
    const userId = parseInt(req.query.userId);
    const userRecipes = publishedRecipesData.filter((recipe) => recipe.userId === userId);
    res.json(userRecipes);
  } catch (err) {
    console.error("Error in /api/published:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/published", (req, res) => {
  try {
    const newRecipe = {
      id: publishedRecipesData.length + 1,
      ...req.body,
    };
    publishedRecipesData.push(newRecipe);
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("Error in POST /api/published:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/api/users/:userId", (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const updatedProfile = req.body;
    const userIndex = users.findIndex((u) => u.userId === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    users[userIndex] = { ...users[userIndex], ...updatedProfile };
    fs.writeFileSync("./users.json", JSON.stringify(users, null, 2), "utf8");
    res.json(users[userIndex]);
  } catch (err) {
    console.error("Error in PUT /api/users/:userId:", err);
    res.status(500).json({ message: "Error saving profile" });
  }
});
app.put("/api/published/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedRecipe = req.body;
    const index = publishedRecipesData.findIndex((r) => r.id === id);
    if (index === -1) return res.status(404).json({ message: "Recipe not found" });
    publishedRecipesData[index] = { ...publishedRecipesData[index], ...updatedRecipe };
    res.json(publishedRecipesData[index]);
  } catch (err) {
    console.error("Error in PUT /api/published/:id:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});