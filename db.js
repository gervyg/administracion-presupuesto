const { Pool } = require("pg");

//Connection DB.
const config = {
    user: "postgres",
    host: "localhost",
    password: "0718",
    database: "admin_presupuesto",
    port: 5432,
    max: 20,
   
};

const pool = new Pool(config);

//Search all categories
const getCategories = async () => {

    const query = `(SELECT * FROM categoria );`;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.log('Error in getCategories');
        return err;
    }
};


//Search all budgets (with conditional limit)
const getBudgets = async (limit) => {

    const limitQuery = (limit)? "LIMIT 10": "";
    const query = `(SELECT * FROM presupuesto ${limitQuery});`;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.log('Error in getBudgets');
        return err;
    }
};

const addBudget = async (budget) => {

    const insert = `INSERT INTO presupuesto (concepto, monto, fecha, tipo, id_categoria, balance_actual)
                    VALUES ('${budget.concept}', '${budget.amount}' , 'NOW()', '${budget.type}', '${budget.category}', 0 );`;
    try {
        await pool.query(insert);
        return true;
    } catch (err) {
        console.log('Error addBudget: ', err);
        return false;
    }
};

module.exports = { getCategories, getBudgets, addBudget }