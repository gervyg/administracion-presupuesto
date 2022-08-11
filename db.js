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

module.exports = { getCategories, getBudgets }