const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({path: './config.env'});

const app = express();
const port = process.env.PORT || 3000;
const dbo = require('./database/mongo');


app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const routes = require('./routes/routes.js')
app.use('/', routes);

/* app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
}); */

dbo.connectToServer(function(err) {
    if (err) {
        console.log(err);
        process.exit();
    }

    app.listen(port, () => console.log(`Server is running on port ${port}`));
});