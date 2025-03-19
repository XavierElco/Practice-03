const {Router} = require('express');
const {
    getAllMovies, 
    addMovie, 
    getMovieById, 
    deleteMovieById, 
    updateMovieById,
    addReviewByMovieId,
    getReviewsByMovieId
} = require('../controllers/movie.controller')
const movieRouter = Router();


movieRouter.get('/', getAllMovies)

movieRouter.post('/', addMovie)

movieRouter.get('/:id', getMovieById)

movieRouter.delete('/:id', deleteMovieById)


movieRouter.put('/:id', updateMovieById)


movieRouter.post('/:id/reviews', addReviewByMovieId)

movieRouter.get('/:id/reviews', getReviewsByMovieId)

module.exports = movieRouter;