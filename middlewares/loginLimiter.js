const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const loginLimiter = rateLimit({
  windowMs: 60 * 100,
  max: 5,
  message: {
    message:
      'To many login attempts form this IP, please try again after a minute',
  },
  handler: (req, res, next, options) => {
    logEvents(
      `To many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      'errLog.log'
    );
    res.status(options.statusCode).send(options.message);
  },
  standerdHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
