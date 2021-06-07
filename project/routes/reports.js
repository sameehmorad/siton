
const express = require('express');
const router = express.Router();
const db = require('../DBFunctions/dbFunction')

/* GET home page. */
router.get('/', async function (req, res, next) {
    const query = `
  SELECT event_name, event_description, event_type, event_time, report_time, user_name, lat, lon, criminal
  FROM reports;`;
    const data = await db.select(query);
    res.send(data);
});

const getTypes = async () => {
    const query = `
  SELECT id, status_name
  FROM status_types;`;
    const data = await db.select(query);
    return data;
}

router.get('/statuses', async (req, res, next) => {
    const data = await getTypes();
    res.send(data);
});

// router.post('/', async (req, res, next) => {
//     const fields = ['event_name', 'event_type', 'event_time', 'report_time, user_name', 'lat', 'lon', 'criminal'];
//     const table = 'reports';

//     switch (req.body.report.event_type) {
//         case 1:

//     };

//     await db.insert(req.body.report, fields, table);
//     res.send();
// });

// const stabbing = (report_id) => {
//     const fields = ['report_id', 'weapon_type', 'casualties'];
//     const table = 'event_description';

// }

module.exports = router;
