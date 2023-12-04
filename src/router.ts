import express from 'express';
import {
	createNewChat,
	deleteChatById,
	getChatById,
	getChatByUser,
	streamChatCompletion,
} from './controller/v1/chat_controller';
import { addTaskToQueue } from './controller/v1/queue_controller';
const router = (app: express.Express) => {
	const baseApiRouter = express.Router();
	const v1Router = express.Router();
	const chatRouter = express.Router();
	const messageQueueRouter = express.Router();

	chatRouter.get('/', async (req, res) => {
		res.send({ message: 'Chat API microservice for Ledger Alchemy' });
	});
	chatRouter.post('/stream', streamChatCompletion);
	chatRouter.post('/', createNewChat);
	chatRouter.get('/:id', getChatById);
	chatRouter.get('/user/:user', getChatByUser);
	chatRouter.delete('/:id', deleteChatById);

	messageQueueRouter.post('/', addTaskToQueue);

	v1Router.use('/message-queue', messageQueueRouter);
	v1Router.use('/chat', chatRouter);
	baseApiRouter.use('/v1', v1Router);
	app.use('/api', baseApiRouter);
};
export default router;
