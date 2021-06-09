const express = require('express');
const router = express.Router();
const db = require('../DBFunctions/dbFunction');
const { clients } = require('./users');
const query = `
  SELECT ac.id, ac.activity_name, at.activity_name AS activity_type, ac.activity_time, ac.activity_goal, st.status_name, ac.activity_approver, ac.lat, ac.lon
  FROM activities ac, status_types st, activity_types at
  WHERE st.id = ac.status
    AND at.id = ac.activity_type;`;


function sendEventsToAll(activity, force) {
  try {
    clients.filter(client => force.includes(client.name)).forEach(client => client.response.write(`data: ${JSON.stringify(activity)}\n\n`));
    console.log("send alerts");
  } catch(err) {
    console.log(err);
  }
}

router.get('/', async function (req, res, next) {
  try {
    let data = await db.select(query);
    data = await Promise.all(data.map(async (activity) => {
      const scheduledPower = await getForce(activity.id);
      return { ...activity, scheduledPower }
    }))
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

const getForce = async (id) => {
  const table = await db.selectWithCondition("officer_id", "activity_id", id, "activity_forces");
  console.log(table);
  return table.reduce((array, policeman) => ([...array, policeman['officer_id']]), []);
}

router.post('/', async function (req, res, next) {
  try {
    const fields = ['activity_name', 'activity_type', 'activity_time', 'activity_goal', 'status', 'activity_approver', 'lat', 'lon'];
    const table = 'activities';
    const values = fields.reduce((object, field) => ({ ...object, [field]: req.body.activity[field] }), {});
    const id = await db.insert(values, fields, table, 'RETURNING *');
    const force = req.body.activity.scheduledPower;
    const policemans = force.map(policeman => ({ 'officer_id': policeman, 'activity_id': id[0].id }));
    await db.insert(policemans, ['officer_id', 'activity_id'], 'activity_forces');
    const activity_type = (await db.selectWithCondition("activity_name", "id", id[0].activity_type, "activity_types"))[0].activity_name;
    const status_name = (await db.selectWithCondition("status_name", "id", id[0].status, "status_types"))[0].status_name;

    res.send({ ...id[0], scheduledPower: force, activity_type, status_name });
  } catch (err) {
    console.log(err);
  }

});

router.get('/statuses', async (req, res, next) => {
  const query = `
SELECT id, status_name
FROM status_types;`;
  const data = await db.select(query);
  res.send(data);
});

router.get('/types', async (req, res, next) => {
  const query = `
SELECT id, activity_name
FROM activity_types;`;
  const data = await db.select(query);
  res.send(data);
});

router.patch('/start/:id', async (req, res) => {
  if (!isNaN(req.params.id)) {
    const status = await db.selectWithCondition("id", "status_name", "'מתרחש עכשיו'", "status_types");
    const activity = await db.update({ "status": status[0].id }, ["status"], "activities", `WHERE id=${req.params.id} RETURNING *`);
    sendEventsToAll({ ...activity[0], "status_name": "מתרחש עכשיו" });
    res.send({ ...activity[0], "status_name": "מתרחש עכשיו" });
  }
  res.sendStatus(404);
})

module.exports = router;
