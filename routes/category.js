const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController');

router.post("/", CategoryController.createCategory);

router.get("/", CategoryController.getAllCategories);

router.get("/random", CategoryController.getRandomCategories);

module.exports= router;
