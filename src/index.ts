import express from 'express';
import router from './router';
import db from './db/db';
import bodyParser from 'body-parser';
import cors from 'cors';
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
console.log('env', process.env.SOME_VAR);
db.authenticate()
	.then(() => {
		console.log('Database is connected');
		db.sync().then(() => {
			console.log('Database is synced');
			app.listen(3100, () => {
				console.log('Server is listening on port 3100');
			});
		});
	})
	.catch((err) => {
		console.log(err);
	});
