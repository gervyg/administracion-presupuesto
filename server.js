const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser")
const path = require("path");
const db = require('./db');
const jwt = require('jsonwebtoken');
const secretKey = "12346899";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.resolve(__dirname,'./client/build')));

/* APIs */
app.get('/login', async (req, res) => {
    const { email, password } = req.query;
    const user = await db.login(email, password)

    if (user.length != 0) {
        const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + 240, data: user[0], },
            secretKey
        );
        res.json({login:true, token: token});
    } else {
        res.json({login:false,  token: ""});
    }
});

const checkLogin = (req, res, next) => {
    let { token } = req.query; 
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) { 
            res.json({login:false,  token: ""});
        } else { 
            req.user = decoded;
            next();
        };
    })
};

app.get('/categories', async (req, res) => {   
    
    const results = await db.findCategories()
    res.json(results);   
})

app.get('/budgets', checkLogin, async (req, res) => {   
    const { limit, idUser } = req.query;
    const results = await db.findBudgets(limit, idUser);
    res.json(results);   
})

app.get('/budgetsFilter', checkLogin, async (req, res) => {   
    const { type, category, idUser } = req.query;
    const results = await db.findBudgetsByFilter(type, category, idUser);
    res.json(results);   
})

app.post('/budget', checkLogin, async (req, res) => {  
    const { budget } = req.body;  
    const result = await db.addBudget(budget); 
    res.json(result);    
})

app.put('/budget/:id', checkLogin, async (req, res) => {    
    const { id } = req.params;
    const { budget } = req.body;   
    const result = await db.editBudget(id, budget);
    res.json(result);   

})

app.delete('/budget/:id', checkLogin, async (req, res) => {  
    const { id } = req.params;
    const { idUser } = req.query;   
    const result = await db.deleteBudget(id, idUser);
    res.json(result);   

})

app.get('/userBalance', checkLogin, async (req, res) => {
    const { idUser } = req.query;  
    const result = await db.findUserBalance(idUser)
    res.json(result);   
});
/***/

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,'./client/build'), 'index.html');
});

app.listen(5000, () => console.log("Escuchando el puerto 5000"));