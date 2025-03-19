const {Router} = require('express');

const {
    addMovie,
    getAllMovies,
    getMovieById,
    deleteMovieById,
    updateMovieById,
    addReviewByMovieId,
    getReviewByMovieId,
} = require('../controllers/movie.controller')
const movieRouter = Router();


movieRouter.get('/', getAllMovies)

movieRouter.post('/', addMovie)

movieRouter.get('/:id', getMovieById)

movieRouter.delete('/:id', deleteMovieById)


movieRouter.put('/:id', updateMovieById)


movieRouter.post('/:id/reviews', addReviewByMovieId)

movieRouter.get('/:id/reviews', getReviewByMovieId)

module.exports = movieRouter;