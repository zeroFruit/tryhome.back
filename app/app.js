import './config/env/env';

import express from 'express';
import logger from './config/logger';
import bodyParser from 'body-parser';
import cors from 'cors';

import {mongoose} from './config/mongodb';

const env = (process.env.NODE_ENV || 'development').trim();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let Router;

if (env === 'development' || env === 'production')  Router = require('./routes/index');
else if (env === 'test')                            Router = require('./test/routes/index');

Router(app);


app.listen(port, () => {
  logger.log('info', `env: ${env}, port: ${port}`)
});

module.exports = { app };
