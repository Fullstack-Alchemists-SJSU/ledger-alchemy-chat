import express from 'express';
import router from './router';
import db from './db/db';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { errorLogger, infoLogger } from './utils/logger';
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
router(app);

const server = http.createServer(app);
export const io = new Server(server, {
	cors: {
		origin: 'http://localhost:4000',
	},
});

io.on('connection', (socket) => {
	console.log('a user connected');
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

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
					server.listen(3333, () => {
						infoLogger.info('Socket listening on *:3333');
						console.log('socket listening on *:3333');
					});
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
