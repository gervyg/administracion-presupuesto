const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")
const path = require("path");
const db = require('./db')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.resolve(__dirname,'./client/build')));

/* APIs */
app.get('/categories', async (req, res) => {   
    
    const results = await db.getCategories()
    res.json(results);   
})

app.get('/budgets', async (req, res) => {   
    const { limit } = req.query;
    const results = await db.getBudgets(limit);
    res.json(results);   
})

app.post('/budget', async (req, res) => {    
    
    const { budget } = req.body;  
    const result = await db.addBudget(budget);
    res.json(result);    

})
/***/

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,'./client/build'), 'index.html');
});

app.listen(5000, () => console.log("Escuchando el puerto 5000"));