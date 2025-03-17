const express = require('express');
const app = express();
app.use(express.json())
app.use(cors)

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

// app.get('/', (req, res, next) => {
//     console.log(req);
//     res.json('hello');
// })

app.get('/v1/movies/', (req, res, next) => {
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
})

app.post('/v1/movies', (req, res, next) => {
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
})

app.get('/v1/movies/:id', (req, res, next) => {
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
})


app.delete('/v1/movies/:id', (req, res, next) => {
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
})


app.put('/v1/movies/:id', (req, res, next) => {
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
})


app.post('/v1/movies/:id/reviews', (req, res, next) => {
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

})

app.get('/v1/movies/:id/reviews', (req, res, next) => {
    const movie = movies.find(movie => movie.id === +req.params.id);
    if (!movie) {
        return res.status(404).json({
            message:'Movie not found!'
        })
    }

    res.json(movie.reviews);
})


app.listen(3000, () => {
    console.log('server listening on prot 3000');
});

function cors(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next();
}