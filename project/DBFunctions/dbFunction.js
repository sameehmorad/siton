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
        const query = pgp.helpers.concat([
            { query: 'SELECT $1 FROM $2 WHERE $3=$4', values: [fieldToSelect, table, fieldToCompare, valueTocompare] }]);
        const data = await db.one(query);
        return data;
    } catch (err) {
        console.log(err);
    }

};

exports.insert = insert = async (values, fields, table) => {
    try {
        const query = pgp.helpers.insert(values, fields, table);
        await db.none(query);
    } catch (err) {
        console.log(err);
    }
};