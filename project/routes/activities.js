const express = require('express');
const router = express.Router();
const db = require('../DBFunctions/dbFunction')

/* GET home page. */
router.get('/', async function (req, res, next) {
  const query = `
  SELECT at.activity_name, ac.activity_time, ac.activity_goal, st.status_name, ac.activity_approver
  FROM activities ac, status_types st, activity_types at
  WHERE st.id = ac.status
    AND at.id = ac.activity_type;`;
  const data = await db.select(query);
  data.map(activity => ({ ...data, scheduledPower: getForce() }))
  console.log(data);
  res.send(data);
});

const getForce = async (id) => {
  const table = await db.selectWithCondition('officer_id', 'activity_id', id, activity_forces);
  return table.reduce((array, policeman) => [...array, policeman['officer_id']], []);
}

router.post('/', async function (req, res, next) {
  try {
    const fields = ['activity_type', 'activity_time', 'activity_goal', 'status', 'activity_approver'];
    const table = 'activities';
    const values = fields.reduce((object, field) => ({ ...object, [field]: req.body.activity[field] }), {});
    const id = await db.insert(values, fields, table, true);
    const force = req.body.activity.scheduledPower;
    const policemans = force.map(policeman => ({ 'officer_id': policeman, 'activity_id': id }));
    await db.insert(policemans, ['officer_id', 'activity_id'], 'activity_forces');
    
    res.send();
  } catch (err) {
    console.log(err);
  }

});

router.get('/statuses', async function (req, res, next) {
  const query = `
SELECT id, status_name
FROM status_types;`;
  const data = await db.select(query);
  res.send(data);
});

router.get('/types', async function (req, res, next) {
  const query = `
SELECT id, status_name
FROM status_types;`;
  const data = await db.select(query);
  res.send(data);
});

module.exports = router;
