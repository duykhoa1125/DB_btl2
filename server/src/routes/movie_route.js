const express = require("express");
const movieRouter = express.Router();
const movieController = require("../controllers/movie_controller");
// Define routes here
movieRouter.get("/", movieController.getAll);
movieRouter.get("/top-revenue", movieController.getTopRevenue);
movieRouter.get("/:id", movieController.getById);

module.exports = movieRouter;