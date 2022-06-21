const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const cors = require("cors");
const express = require("express");

const app = express();

const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api", require("./api/api"));

app.use(errorHandler());

app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});

module.exports = app;