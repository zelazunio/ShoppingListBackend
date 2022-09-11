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

dbo.connectToServer(function(err) {
    if (err) {
        console.log(err);
        process.exit();
    }

    app.listen(port, () => console.log(`Server is running on port ${port}`));
});