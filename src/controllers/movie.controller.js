
let nextMovieId = 2;
let nextReviewsId = 3;

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


const getReviewsByMovieId = (req, res, next) => {
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

const addReviewByMovieId = (req, res, next) => {
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
    getReviewsByMovieId,
    addReviewByMovieId
}