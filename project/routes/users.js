const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../DBFunctions/dbFunction');

router.post('/login', async (req, res, next) => {
  const colunms = (await db.getColumns("users")).map(colunm => colunm.column_name).toString();
  const user = await db.selectWithCondition(colunms, 'user_name', "'" + req.body.userName + "'", "users");

  if (!user) {
    res.sendStatus(404);
  } else if (user[0].password !== req.body.password) {
    res.sendStatus(403);
  } else {
    const token = jwt.sign({ userName: user.user_name, admin: user.is_admin }, 'loginUser');
    delete user[0].password;
    res.send({ token, user: user[0] });
  }
});

module.exports = router;
