const Meal = require('../models/meal');

// Create a new meal
exports.createMeal = async (req, res) => {
    try {
      const { name, price } = req.body;
  
      if (!name || !price) {
        return res.status(400).json({ message: "Name and Price are required" });
      }
  
      const meal = new Meal({ name, price });
      await meal.save();
  
      res.status(201).json({ message: "Meal created successfully", meal });
    } catch (error) {
      console.error("Error creating meal:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

// Get all meals
exports.getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get total Meals count
exports.getMealCount = async (req, res) => {
  try {
    const count = await Meal.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error fetching Meal count:", error);
    res.status(500).json({ message: "Failed to get Meal count" });
  }
};
// Book selected meals
exports.bookMeals = async (req, res) => {
  try {
    const { selectedMeals, numberOfPeople } = req.body;

    if (!selectedMeals || !Array.isArray(selectedMeals) || selectedMeals.length === 0) {
      return res.status(400).json({ error: "No meals selected." });
    }

    if (!numberOfPeople || numberOfPeople <= 0) {
      return res.status(400).json({ error: "Invalid number of people." });
    }

    let totalCost = 0;
    for (const mealId of selectedMeals) {
      const meal = await Meal.findById(mealId);
      if (!meal) {
        return res.status(404).json({ error: `Meal with ID ${mealId} not found.` });
      }
      totalCost += meal.price * numberOfPeople;
    }

    res.json({ message: "Meals booked successfully!", totalCost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a meal
exports.updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      { name, price },
      { new: true }
    );

    if (!updatedMeal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    res.status(200).json({ message: "Meal updated successfully", meal: updatedMeal });
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ message: "Failed to update meal" });
  }
};


// Delete a meal
exports.deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findByIdAndDelete(id);

    if (!meal) {
      return res.status(404).json({ error: "Meal not found." });
    }

    res.json({ message: "Meal deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
