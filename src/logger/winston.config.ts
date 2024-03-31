import { formatDate } from 'src/helper/formatDate';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as TelegramLogger from 'winston-telegram';

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, context, trace }) => {
        return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
      }),
    ),
  }),

  new winston.transports.DailyRotateFile({
    filename: 'logs/info/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    level: 'info',
  }),

  new winston.transports.DailyRotateFile({
    filename: 'logs/error/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    level: 'error',
  }),

  new TelegramLogger({
    level: 'error',
    token: process.env.TELEGRAM_TOKEN_API,
    chatId: parseInt(process.env.TELEGRAM_CHAT_ID_ERROR),
    batchingDelay: 1000,
    unique: true,
    formatMessage: function (options) {
      let message = options.message;
      return (message = `❌[ERROR] ${formatDate(
        new Date().toString(),
      )} \n\n${message}\n\n${JSON.stringify(options.metadata?.trace)}`);
    },
  }),

  new TelegramLogger({
    level: 'info',
    token: process.env.TELEGRAM_TOKEN_API,
    chatId: parseInt(process.env.TELEGRAM_CHAT_ID_INFO),
    batchingDelay: 1000,
    unique: true,
    disableNotification: true,
    formatMessage: function (options) {
      let message = options.message;
      return (message = `ℹ️[INFO] ${formatDate(
        new Date().toString(),
      )} \n\n${message}`);
    },
  }),
];

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.json(),
    winston.format.metadata(),
  ),
  transports,
});
