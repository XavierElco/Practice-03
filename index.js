const express = require('express');
const app = express();
app.use(express.json())
app.use(cors)

let nextMovieId = 2;
let nextReviewsId = 3;

const movieRouter = express.Router();

app.use('/v1/movies', movieRouter);


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

movieRouter.get('/')

movieRouter.post('/')

movieRouter.get('/:id')

movieRouter.delete('/:id')


movieRouter.put('/:id')


movieRouter.post('/:id/reviews')

movieRouter.get('/:id/reviews')


app.listen(3000, () => {
    console.log('server listening on prot 3000');
});

function cors(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next();
}