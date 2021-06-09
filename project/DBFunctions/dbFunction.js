const pgp = require('pg-promise')({
    capSQL: true
});

const cn = {
    host: '172.30.195.209', // server name or IP address;
    port: 5432,
    database: 'gali',
    user: 'gali',
    password: 'gali'
};

// const cn = {
//     host: '127.0.0.1', // server name or IP address;
//     port: 32000,
//     database: 'gali',
//     user: 'gali',
//     password: 'gali'
// };

const db = pgp(cn);

exports.select = select = (query) => {
    return db.any(query, ['active'])
        .then(data => {
            console.log('DATA->' + data);
            return data;
        })
        .catch(error => {
            console.log('ERROR->' + error);
            return error;
        });
};

exports.selectWithCondition = selectWithCondition = async (fieldToSelect, fieldToCompare, valueTocompare, table) => {
    try {
        const query = `SELECT ${fieldToSelect} FROM ${table} WHERE ${fieldToCompare}=${valueTocompare};`
        const data = await db.any(query);
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }

};

exports.insert = insert = async (values, fields, table, returnValue = '') => {
    try {
        let query = pgp.helpers.insert(values, new pgp.helpers.ColumnSet(fields), new pgp.helpers.TableName(table))
        query = query + returnValue;
        return await db.any(query);
    } catch (err) {
        console.log(err);
    }
};

exports.update = update = async (values, fields, table, condition = '') => {
    try {
        let query = pgp.helpers.update(values, new pgp.helpers.ColumnSet(fields), new pgp.helpers.TableName(table));
        query = query + condition;
        return await db.any(query);
    } catch (err) {
        console.log(err);
    }
};

exports.getColumns = getColumns = async (table) => {
    try {
        const query = `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = '${table}'
     ;`
        return await db.any(query);
    } catch (err) {
        console.log(err);
    }
}