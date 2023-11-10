import express from 'express';
import { createNewChat, getChatById, getChatByUser, streamChatCompletion } from './controller/v1/chat_controller';
const router = (app: express.Express) => {
	const baseApiRouter = express.Router();
	const v1Router = express.Router();
	const chatRouter = express.Router();

	baseApiRouter.get('/', async (req, res) => {
		res.send('Hello World!');
	});

	chatRouter.post('/stream', streamChatCompletion);
	chatRouter.post('/', createNewChat);
	chatRouter.get('/:id', getChatById);
	chatRouter.get('/user/:user', getChatByUser);

	v1Router.use('/chat', chatRouter);
	baseApiRouter.use('/v1', v1Router);
	app.use('/api', baseApiRouter);
};
export default router;
