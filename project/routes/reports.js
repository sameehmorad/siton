
const express = require('express');
const router = express.Router();
const db = require('../DBFunctions/dbFunction')

/* GET home page. */
router.get('/', async function (req, res, next) {
    const query = `
  SELECT id, event_name, event_description, event_type, event_time, report_time, user_name, lat, lon, criminal
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

router.post('/', async (req, res, next) => {
    let fields = ['event_name','event_description', 'event_type', 'event_time', 'report_time', 'user_name', 'lat', 'lon', 'criminal'];
    let table = 'reports';
    let values = fields.reduce((object, field) => ({ ...object, [field]: req.body.report[field] }), {});

    const id = await db.insert(values, fields, table, true);
    const tables = ['shooting_reports', 'stabbing_reports', 'kidnap_reports', 'accident_reports'];

    table = tables[values.event_type - 1];
    const colunms = (await db.getColumns(table)).map(colunm => colunm.column_name);
    req.body.report["report_id"] = id[0].id;
    values = colunms.reduce((object, field) => ({ ...object, [field]: req.body.report[field] }), {});

    await db.insert(values, colunms, table);

    res.send();
});

module.exports = router;
