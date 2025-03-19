const { createLogger } = require('./utils/logger');
const logger = createLogger(__filename)
const helmet = require('helmet')
const cors = require('cors');
const express = require('express');
const morganMiddleware = require('./middleware/morgan.middleware')
const v1Router = require('./routes');
const config = require('./utils/config');
const { default: rateLimit } = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('./utils/swagger')

const app = express();

app.use(helmet()) // 防护外部攻击，项目安全
// app.use(rateLimit())
app.use(cors()); // 域权限管理
app.use(morganMiddleware) // 记录外部访问请求
// 日志记录
app.use(express.json())


app.use('/v1', v1Router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc))

app.listen(config.PORT, () => {
    console.log(config.NODE_ENV)
   logger.info(`server listening on port ${config.PORT}`);
});



