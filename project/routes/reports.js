
const express = require('express');
const router = express.Router();
const db = require('../DBFunctions/dbFunction')

/* GET home page. */
router.get('/', async function (req, res, next) {
  const query = `
  SELECT event_name, event_type, event_time, report_time, user_name, lat, lon, criminal
  FROM reports;`;
  console.log(db.select(query));
});

module.exports = router;
