const winston = require('winston');
const config = require('./config');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

const dir = `./logs`
const pathExist = fs.existsSync(dir);
if (!pathExist) {
  return fs.mkdirSync(dir, { recursive: true })
}

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json(),
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
    new winston.transports.File({ filename: `./logs/${moment().format('DD-MM-YYYY')}.log` })

  ],
});

module.exports = logger;
