const express = require('express');
const router = express.Router();
const {createMeal,getAllMeals,bookMeals,deleteMeal, getMealCount, updateMeal}=require("../controllers/mealController")

// Create new Meal
router.post('/create', createMeal);

// Get all meals
router.get('/',getAllMeals);

// Get Count
router.get('/count',getMealCount);

// Update meal
router.put('/update/:id',updateMeal);

// Book meals
router.post('/book',bookMeals);

// Delete meal by ID
router.delete('/:id',deleteMeal);

module.exports = router;
