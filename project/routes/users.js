const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../DBFunctions/dbFunction');

router.post('/login', function(req, res, next) {
  const user = db.selectWithCondition('user_name,password,is_admin','user_name',req.body.userName);

  if (!user) {
    res.sendStatus(404);
  } else if (user.password !== req.body.password) {
    res.sendStatus(403);
  } else {
    const token = jwt.sign({ userName: user.user_name, admin: user.is_admin }, 'loginUser');
    res.send(token);
  }
});

module.exports = router;
