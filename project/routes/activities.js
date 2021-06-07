const express = require('express');
const router = express.Router();
const db = require('../DBFunctions/dbFunction')

/* GET home page. */
router.get('/', async function (req, res, next) {
  const query = `
  SELECT ac.activity_type, ac.activity_time, ac.activity_goal, st.status_name, ac.activity_approver
  FROM activities ac, status_types st
  WHERE st.id = ac.status;`;
  const data = await db.select(query);
  res.send(data);
});

module.exports = router;
