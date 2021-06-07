const pgp = require('pg-promise')(/*options*/);

const cn = {
    host: '172.30.179.169', // server name or IP address;
    port: 5432,
    database: 'sampledb',
    user: 'postgres',
    password: 'sitonteam'
};
// alternative:
// const cn = 'postgres://postgres:sitonteam@postgresql:5432/sampledb';

const db = pgp(cn);

exports.select = select = (query) => {
    return db.any(query, ['active'])
        .then(data => {
            console.log('DATA->'+data);
            return data;
        })
        .catch(error => {
            console.log('ERROR->'+error);
            return error;
        });
};