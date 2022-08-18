const { Pool } = require("pg");

//Connection DB.
const config = {
    user: "postgres",
    host: "localhost",
    password: "0718",
    database: "admin_budget",
    port: 5432,
    max: 20,
   
};

const pool = new Pool(config);

//Search all categories
const findCategories = async () => {

    const query = `(SELECT * FROM category );`;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.log('Error in findCategories', err);
        return err;
    }
};


//Search all budgets (with conditional limit)
const findBudgets = async (limit, idUser) => {

    const limitQuery = (limit)? "LIMIT 10": "";
    const query = `(SELECT * FROM budget WHERE id_user = '${idUser}'
                    ORDER BY id desc ${limitQuery} );`;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.log('Error in findBudgets', err);
        return err;
    }
};

//Search all budgets by filters (category and type)
const findBudgetsByFilter = async (type, category, idUser) => {

    const typeParams = (type != "")? " AND type='"+type+"'": "";
    const categoryParams = (category != "")? " AND id_category='"+category+"'": "";
    const query = `(SELECT * FROM budget WHERE id_user = ${idUser} 
                    ${typeParams} ${categoryParams}
                     ORDER BY id desc);`;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.log('Error in findBudgetsByFilter', err);
        return err;
    }
};

//Create budgets
const addBudget = async (budget) => {

    const amount = (budget.type === '0')? -(budget.amount): budget.amount;

    const insert = `INSERT INTO budget (concept, amount, date, date_update, type, id_category, id_user)
                    VALUES ('${budget.concept}', '${amount}' , 'NOW()', 'NOW()',
                    ${budget.type}, '${budget.category}', '${budget.idUser}' ) RETURNING id;`;
    try {
        await pool.query(insert);
        try {

            const result = await pool.query(`SELECT id FROM user_balance WHERE id_user=${budget.idUser};`);
            
            if(result.rows.length === 0){
                const queryBalance = `INSERT INTO user_balance (id_user, balance, total_revenue, total_expenditure)
                    VALUES ('${budget.idUser}','${amount}','${amount}','${amount}');`;
                 await pool.query(queryBalance);
            }else{
                const queryBalance = queryBalanceString(budget.idUser);
                await pool.query(queryBalance);
            }            
            return true;

        } catch (err) {
            console.log('Error addBudget balance: ', err);
            return false;
        }

    } catch (err) {
        console.log('Error addBudget: ', err);
        return false;
    }
};

//Edit budgets (by id).
const editBudget = async (id, budget) => {

    const amount = (budget.type === '0')? -(budget.amount): budget.amount;

    const update = `UPDATE budget SET concept='${budget.concept}', amount='${amount}', 
                    date_update='NOW()', id_category='${budget.category}' 
                    WHERE id=${id};`;
    try {
        await pool.query(update);

        try {
            const queryBalance = queryBalanceString(budget.idUser); 
            await pool.query(queryBalance);
            return true;
        } catch (err) {
            console.log('Error editBudget balance: ', err);
            return false;
        }

    } catch (err) {
        console.log('Error editBudget: ', err);
        return false;
    }
};

//Delete budget
const deleteBudget = async (id, idUser) => {
    
    const deleteQuery = `DELETE FROM budget WHERE id='${id}';`;
    try {
        await pool.query(deleteQuery);
        try {
            const queryBalance = queryBalanceString(idUser); 
            await pool.query(queryBalance);
            return true;
        } catch (err) {
            console.log('Error deleteBudget balance: ', err);
            return false;
        }

    } catch (err) {
        console.log('Error deleteBudget: ', err);
        return false;
    }
};

//Query to balance update
const queryBalanceString = (idUser) => {
   return `UPDATE user_balance SET balance=(
                SELECT COALESCE(SUM(amount),0) FROM budget WHERE id_user='${idUser}'
            ),
            total_revenue=(
                SELECT COALESCE(SUM(amount),0) FROM budget WHERE type = 1 AND id_user='${idUser}'
            ),
            total_expenditure=(
                SELECT COALESCE(SUM(amount),0) FROM budget WHERE type = 0 AND id_user='${idUser}'
            ) WHERE id_user=${idUser};`;
}

const login = async (email, password) => {

    const query = `(SELECT id, name FROM users WHERE email='${email}' and password='${password}');`;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.log('Error in login', err);
        return err;
    }
};

//Search user balance 
const findUserBalance = async (idUser) => {

    const query = `(SELECT * FROM user_balance WHERE id_user='${idUser}');`;
    try {
        const result = await pool.query(query);
        return result.rows[0];
    } catch (err) {
        console.log('Error in findUserBalance', err);
        return err;
    }
};

//Add users 
const addUser = async (name, email, password) => {

    const insertUser = `INSERT INTO users (name, email, password)
                    VALUES ('${name}', '${email}' , '${password}' );`;
    try {
        await pool.query(insertUser);       
        return true;
    } catch (err) {
        console.log('Error addUser: ', err);
        return false;
    }
};

module.exports = { findCategories, findBudgets, addBudget, editBudget, deleteBudget, findBudgetsByFilter, login, findUserBalance, addUser }