const express = require('express');
const router = express.Router();
const db = require('../DBFunctions/dbFunction');
const tables = ['shooting_reports', 'stabbing_reports', 'kidnap_reports', 'accident_reports', 'insulation_reports'];

/* GET home page. */
router.get('/', async function (req, res, next) {
    const query = `
  SELECT rep.id, rep.event_name, rep.event_description, rep.event_type AS event_id, et.event_name AS event_type, rep.event_time, rep.report_time, rep.user_name, rep.lat, rep.lon, rep.region, rep.criminal
  FROM reports rep,event_types et
  WHERE rep.event_type = et.id;`;
    let data = await db.select(query);
    data = await Promise.all(data.map(async (report) => {
        const specificData = await getMoreDetails(report);
        return { ...report, ...specificData[0] }
    }));

    res.send(data);
});

router.get('/by/:region', async function (req, res, next) {
    const regions = (await db.select("SELECT region_name FROM regions;")).map(reg => (reg.region_name));
    if (regions.includes(req.body.region)) {
        const query = `
    SELECT rep.id, rep.event_name, rep.event_description, rep.event_type AS event_id, et.event_name AS event_type, rep.event_time, rep.report_time, rep.user_name, rep.lat, rep.lon, rep.region, rep.criminal
    FROM reports rep,event_types et
    WHERE rep.event_type = et.id
      AND rep.region=${region};`;
        let data = await db.select(query);
        data = await Promise.all(data.map(async (report) => {
            const specificData = await getMoreDetails(report);
            return { ...report, ...specificData[0] }
        }));

        res.send(data);
    }

    res.sendStatus(404);
});

router.get('/events', async (req, res, next) => { // 
    const query = `
    SELECT id, event_name
    FROM event_types;`;
    let data = await db.select(query);
    res.send(data);
});

const getMoreDetails = async (report) => {
    const table = tables[report.event_id - 1];
    const colunms = (await db.getColumns(table)).map(colunm => colunm.column_name).toString();
    return await db.selectWithCondition(colunms, 'report_id', report.id, table);
};

router.post('/', async (req, res) => {
    const { ev_type, ev_time, evreporttime, reporter_id, ev_loc_x, ev_loc_y, ev_area} = res.rep;

    db.query(`INSERT INTO report (ev_type, ev_time, evreporttime, reporter_id, ev_loc_x, ev_loc_y, ev_area)
    VALUES('${ev_type}', '${ev_time}', '${evreporttime}', ${reporter_id}, ${ev_loc_x}, ${ev_loc_y}, '${ev_area}')`)
    .then(result => console.log('success'));

    res.send();
});

module.exports = router;
