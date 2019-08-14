const express = require('express');
const bodyParser = require('body-parser');
const app = require('../app');

const server = express();

/*
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
*/

/*
app.get('/wagerapp', (req, res) => {
    res.json({"message": "Welcome to Wager App application."});
});
*/

server.use(app);

// listen for requests
server.listen(8000, () => {
    console.log("Server is listening on port 8000");
});
