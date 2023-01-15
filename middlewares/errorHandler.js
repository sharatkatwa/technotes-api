const { logEvents } = require('./logger');

const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${err.method}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'errLog.log'
  );
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500; //internal server error

  res.status(status).json({
    message: err.message,
  });
};
module.exports = errorHandler;
