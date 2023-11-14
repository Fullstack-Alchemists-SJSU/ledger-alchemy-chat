import express from 'express';
import router from './router';
import db from './db/db';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cors({
		origin: ['http://localhost:3001', 'http://localhost:3000'],
		methods: 'GET,POST,PUT,DELETE,OPTIONS',
	})
);
router(app);

const server = http.createServer(app);
export const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
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
		db.sync(/*{ force: true }*/).then(() => {
			console.log('Database is synced');
			app.listen(3100, () => {
				console.log('Server is listening on port 3100');
				server.listen(3333, () => {
					console.log('socket listening on *:3333');
				});
			});
		});
	})
	.catch((err) => {
		console.log(err);
	});
