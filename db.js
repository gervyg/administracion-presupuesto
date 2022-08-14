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
const getBudgets = async (limit, idUser) => {

    const limitQuery = (limit)? "LIMIT 10": "";
    const query = `(SELECT * FROM presupuesto WHERE id_usuario = ${idUser} 
                    ORDER BY id desc ${limitQuery} );`;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.log('Error in getBudgets');
        return err;
    }
};

const getBudgetsByFilter = async (type, category, idUser) => {

    const typeParams = (type != "")? " AND tipo='"+type+"'": "";
    const categoryParams = (category != "")? " AND id_categoria='"+category+"'": "";
    const query = `(SELECT * FROM presupuesto WHERE id_usuario = ${idUser} 
                    ${typeParams} ${categoryParams}
                     ORDER BY id desc);`;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.log('Error in getBudgetsByFilter', err);
        return err;
    }
};

const addBudget = async (budget) => {

    const amount = (budget.type === '0')? -(budget.amount): budget.amount;

    const insert = `INSERT INTO presupuesto (concepto, monto, fecha, fecha_actualizacion, tipo, id_categoria, id_usuario)
                    VALUES ('${budget.concept}', '${amount}' , 'NOW()', 'NOW()',
                    ${budget.type}, '${budget.category}', '${budget.idUser}' ) RETURNING id;`;
    try {
        await pool.query(insert);
        try {

            const result = await pool.query(`SELECT id FROM usuario_balance WHERE id_usuario=${budget.idUser};`);
            
            if(result.rows.length === 0){
                const queryBalance = `INSERT INTO usuario_balance (id_usuario, balance_actual, total_ingresos, total_egresos)
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

const editBudget = async (id, budget) => {

    const amount = (budget.type === '0')? -(budget.amount): budget.amount;

    const update = `UPDATE presupuesto SET concepto='${budget.concept}', monto='${amount}', 
                    fecha_actualizacion='NOW()', id_categoria='${budget.category}' 
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

const deleteBudget = async (id, idUser) => {
    
    const deleteQuery = `DELETE FROM presupuesto WHERE id='${id}';`;
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

const queryBalanceString = (idUser) => {
   return `UPDATE usuario_balance SET balance_actual=(
                SELECT COALESCE(SUM(monto),0) FROM presupuesto WHERE id_usuario='${idUser}'
            ),
            total_ingresos=(
                SELECT COALESCE(SUM(monto),0) FROM presupuesto WHERE tipo = 1 AND id_usuario='${idUser}'
            ),
            total_egresos=(
                SELECT COALESCE(SUM(monto),0) FROM presupuesto WHERE tipo = 0 AND id_usuario='${idUser}'
            ) WHERE id_usuario=${idUser};`;
}

module.exports = { getCategories, getBudgets, addBudget, editBudget, deleteBudget, getBudgetsByFilter }