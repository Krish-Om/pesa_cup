import pino from 'pino'

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  redact: ['req.headers.authorization','password','creditCard','OTP'],
  level: process.env.LOG_LEVEL || (isDev ? 'debug': 'info') ,
  transport: isDev ? {
  target: 'pino-pretty',
  options :{
  colorize :true,
  trnslateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
  ignore:'pid,hostname'
  },
  }
  :undefined,
})
