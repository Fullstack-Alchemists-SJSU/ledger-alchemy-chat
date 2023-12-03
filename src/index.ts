import express from 'express';
import router from './router';
import db from './db/db';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { errorLogger, infoLogger } from './utils/logger';
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
router(app);

const server = http.createServer(app);

db.authenticate()
	.then(() => {
		console.log('Database is connected');
		infoLogger.info('Database is connected');
		db.sync({ force: false, logging: false })
			.then(() => {
				console.log('Database is synced');
				infoLogger.info('Database is synced');
				app.listen(3100, () => {
					console.log('Server is listening on port 3100');
					infoLogger.info('Server started on port 3100');
				});
			})
			.catch((err) => {
				errorLogger.error(err);
			});
	})
	.catch((err) => {
		console.log(err);
		errorLogger.error(err);
	});
