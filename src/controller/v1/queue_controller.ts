import { Request, Response, response } from 'express';
import { errorResponses, successResponses } from '../../utils/responses';
import messagesDBQueue, { QUEUE_NAME, TaskType } from '../../queue/messages_db_queue';

export const addTaskToQueue = async (req: Request, res: Response) => {
	const { messages, userId } = req.body;

	if (!messages || !userId) {
		res.status(400).json(errorResponses.INSUFFICIENT_DATA);
	}

	const task: TaskType<{ messages: any; userId: any }, void> = {
		type: 'async',
		messages,
		userId,
	};

	try {
		const job = await messagesDBQueue.add(QUEUE_NAME, task);
		res.status(200).json(successResponses.MESSAGE_ADDED_TO_QUEUE);
	} catch (err) {
		console.log('err', err);
		res.status(400).json(errorResponses.SOMETHING_WENT_WRONG);
	}
};
