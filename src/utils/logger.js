const winston = require('winston') // 打印日志
const path = require("path") // 只取文件名字，不要路径
const config = require("./config")

const createLogger = (filename) => {
    const logger = winston.createLogger({
        level: config.LOG_LEVEL,
        defaultMeta: {
            filename: filename ? path.basename(filename) : undefined,
        },
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({timestamp, filename, level, message, payload})=>{
                const fileInfo = filename?`[${filename}]`:''
                const payloadInfo = payload ? `\n${JSON.stringify(payload)}`: ''
                return `[${timestamp}] [${level}] ${fileInfo}: [${message}][${payloadInfo}]`
            })
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: 'logs/combined.log'
            }),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error'
            })
        ]
    })
    return logger;
}

module.exports = {
    createLogger,
    logger: createLogger(),
}