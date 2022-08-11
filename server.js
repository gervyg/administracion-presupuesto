const express = require('express');
const app = express();
const axios = require('axios')
const bodyParser = require("body-parser")
const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname,'./client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,'./client/build'), 'index.html');
});

app.listen(5000, () => console.log("Escuchando el puerto 5000"));