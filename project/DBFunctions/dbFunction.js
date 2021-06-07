const pgp = require('pg-promise')(/*options*/);

// const cn = {
//     host: '127.0.0.1', // server name or IP address;
//     port: 31000,
//     database: 'sampledb',
//     user: 'postgres',
//     password: 'sitonteam'
// };
// alternative:
const cn = 'postgres://postgres:sitonteam@172.30.179.169:5432/sampledb';

const db = pgp(cn);

exports.select = select = (query) => {
    return db.any(query, ['active'])
        .then(data => {
            return data;
        })
        .catch(error => {
            return error;
        });
};