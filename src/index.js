const cors = require('cors');
const express = require('express');
const v1Router = require('./routes');
const corsMiddleware = require('./middleware/cors.middleware');


const app = express();

app.use(cors());
app.use(express.json())


app.use('/v1', v1Router)


app.listen(3000, () => {
    console.log('server listening on prot 3000');
});