
const { createLogger } = require('../utils/logger');
const swagger = require('../utils/swagger');
const logger = createLogger(__filename)

let nextMovieId = 2;
let nextReviewsId = 3;


/**
 * @swagger
 * /movies:
 *   get:
 *     summary: 获取所有电影
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 电影关键字查询
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [rating, -rating]
 *         description: 按评分排序
 *     responses:
 *       200:
 *         description: 成功获取电影列表
 */
/**
 * @swagger
 * /movies:
 *   post:
 *     summary: 添加一部新电影
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               types:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - title
 *               - description
 *               - types
 *     responses:
 *       201:
 *         description: 成功创建电影
 */
/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: 根据ID获取电影
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功获取电影
 *       404:
 *         description: 电影未找到
 */
/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: 删除指定ID的电影
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 成功删除电影
 *       404:
 *         description: 未找到电影
 */
/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: 根据ID更新电影信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               types:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 成功更新电影
 *       404:
 *         description: 未找到电影
 */
/**
 * @swagger
 * /movies/{id}/reviews:
 *   get:
 *     summary: 获取某电影所有评价
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功获取电影评价
 *       404:
 *         description: 未找到电影
 */
/**
 * @swagger
 * /movies/{id}/reviews:
 *   post:
 *     summary: 为指定电影添加评价
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *             required:
 *               - content
 *               - rating
 *     responses:
 *       201:
 *         description: 成功添加评价
 *       404:
 *         description: 未找到电影
 */

const movies = [
    {
      id: 1,
      title: "Inception",
      description: "A skilled thief steals secrets from dreams.",
      types: ["Sci-Fi"],
      averageRating: 4.5,
      reviews: [
        { id: 1, content: "Amazing movie!", rating: 5 },
        { id: 2, content: "Great visuals.", rating: 4 },
      ],
    },
];


const addMovie = (req, res, next) => {
        // data validation
        const {title, description, types} = req.body;
    
        if (
            !title || !description || 
            !Array.isArray(types) || 
            types.length === 0
        ) {
            return res.status(400).json({
                message:
                    'All fields must required and types must be a non-empty array',
            });
        }
    
        const newMovies = {
            id: nextMovieId++,
            title, description, types, averageRating: 0, reviews:[]
        }
        movies.unshift(newMovies);
        res.status(201).json(newMovies)

}

const getAllMovies = (req, res, next) => {
    logger.info("Getting all movies", {payload:{query: req.query}})
    const {keyword, sort, page = 1, limit = 10} = req.query

    let filteredMovies = [...movies];

    if (keyword) {
        filteredMovies = filteredMovies.filter(
            m=>
                m.title.toLowerCase().includes(keyword.toLowerCase()) || 
                m.description.toLowerCase().includes(keyword.toLowerCase())
            )
    }

    if (sort === 'rating') {
        filteredMovies.sort((a, b) => a.averageRating - b.averageRating)
    } else if (sort === '-rating') {
        filteredMovies.sort((a, b) => b.averageRating - a.averageRating)
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const pageinatedMovies = filteredMovies.slice(startIndex, endIndex)

    logger.debug("movie returned successfully", {payload:{count: pageinatedMovies.length}})
    res.json(pageinatedMovies);
}



const getMovieById = (req, res, next) => {
    const movieId = req.params.id;
    const queryMovie = movies.find (item => 
        item.id === parseInt(movieId)
    )
    if (!queryMovie) {
        return res.status(404).json({
            message:'Movie not found!'
        })
    }
    res.status(200).json(queryMovie);
}



const deleteMovieById = (req, res, next) => {
    const movieId = parseInt(req.params.id);
    const deleteMovieIndex = movies.findIndex(item => 
        item.id === movieId
    )
    if (deleteMovieIndex === -1) {
        return res.status(404).json({
            message:'Movie not found!'
        })
    }
    movies.splice(deleteMovieIndex, 1)
    res.status(204).json(movies);
}


const updateMovieById = (req, res, next) => {
    const {title, description, types} = req.body;
    const updateMovie = movies.find(item => item.id == +req.params.id)
    if (!updateMovie) {
        return res.status(404).json({
            message: "not found"
        })
    }

    if (title){
        updateMovie.title = title;
    }
    
    if (description) {
        updateMovie.description = description;
    } 
    

    if (types) {
        if (!Array.isArray(types) || types.length === 0) {
            return res.status(400).json({
                message:
                    'All fields must required and types must be a non-empty array',
            });
        }
        updateMovie.types = types;
    }

    return res.status(200).json(updateMovie)
}


const addReviewByMovieId = (req, res, next) => {
    const movie = movies.find(movie => movie.id === +req.params.id);
    if (!movie) {
        return res.status(404).json({
            message:'Movie not found!'
        })
    }
    const {content, rating} = req.body;
    if (!content || !rating || rating < 1 || rating > 5) {
        return res.status(400).json ({
            message: "content and rating are requireds. Rating must be between 1 and 5"
        })
    }
    const newReview = 
        {
            id: nextReviewsId++,
            content, rating
        }
    movie.reviews.push(newReview)
    movie.averageRating = +(movie.reviews.reduce((sum, current)=>sum+current.rating, 0)/movie.reviews.length).toFixed(2)
    return res.status(201).json(movie)

}


const getReviewByMovieId = (req, res, next) => {
    const movie = movies.find(movie => movie.id === +req.params.id);
    if (!movie) {
        return res.status(404).json({
            message:'Movie not found!'
        })
    }

    res.json(movie.reviews);
}







module.exports = {
    addMovie,
    getAllMovies,
    getMovieById,
    deleteMovieById,
    updateMovieById,
    addReviewByMovieId, getReviewByMovieId,
}