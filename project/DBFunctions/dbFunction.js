const pgp = require('pg-promise')(/*options*/);

const cn = {
    host: '172.30.195.209', // server name or IP address;
    port: 5432,
    database: 'gali',
    user: 'gali',
    password: 'gali'
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