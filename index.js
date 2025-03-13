const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    req.json('hello');
    }
)

app.listen(3000, () => {
    console.log('server listening on prot 3000');
})