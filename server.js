const express = require('express');
const app = express();
const bodyParser = require("body-parser")
const path = require("path");
const db = require('./db')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname,'./client/build')));

/* APIS */
app.get('/categories', async (req, res) => {   
    
    const results = await db.getCategories()
    res.set('Access-Control-Allow-Origin', '*')
    res.json(results);   
})

app.get('/budgets', async (req, res) => {   
    const { limit } = req.query;
    const results = await db.getBudgets(limit);
    res.set('Access-Control-Allow-Origin', '*')
    res.json(results);   
})
/***/

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,'./client/build'), 'index.html');
});

app.listen(5000, () => console.log("Escuchando el puerto 5000"));