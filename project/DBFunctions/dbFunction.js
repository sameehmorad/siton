const pgp = require('pg-promise')(/*options*/);

const cn = {
    host: '172.30.179.169', // server name or IP address;
    port: 5432,
    database: 'sampledb',
    user: 'postgres',
    password: 'sitonteam'
};
// alternative:
// const cn = 'postgres://username:password@host:port/database';

const db = pgp(cn);

exports.select = select = (query) => {
    db.any(query, ['active'])
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log('ERROR:', error);
        });
}