const jwt = require('jsonwebtoken');

const verifyJWT = (request, res, next) => {
  const authHeaders = req.headers.authorization || req.headers.Authorization;
  if (!authHeaders || !authHeaders.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeaders.split('')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'forbidden' });
    req.user = decoded.userInfo.username;
    req.roles = decoded.userInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
