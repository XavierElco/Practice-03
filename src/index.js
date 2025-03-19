const express = require('express');
const movieRouter = require('./routes/movie.router');
const corsMiddleware = require('./middleware/cors.middleware');
const app = express();
app.use(express.json())
app.use(corsMiddleware)



app.use('/v1/movies', movieRouter);


// app.get('/', (req, res, next) => {
//     console.log(req);
//     res.json('hello');
// })



app.listen(3000, () => {
    console.log('server listening on prot 3000');
});