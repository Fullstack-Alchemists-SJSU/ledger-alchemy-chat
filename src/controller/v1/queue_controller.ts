import { Request, Response } from 'express';
import { errorResponses, successResponses } from '../../utils/responses';
import messagesDBQueue, { QUEUE_NAME, TaskType } from '../../queue/messages_db_queue';
import { logApiRequest } from '../../utils/logger';

export const addTaskToQueue = async (req: Request, res: Response) => {
	const { messages, userId } = req.body;

	if (!messages || !userId) {
		logApiRequest(req, errorResponses.INSUFFICIENT_DATA);
		res.status(400).json(errorResponses.INSUFFICIENT_DATA);
	}

	const task: TaskType<{ messages: any; userId: any }, void> = {
		type: 'async',
		messages,
		userId,
	};

	try {
		const job = await messagesDBQueue.add(QUEUE_NAME, task);
		logApiRequest(req, successResponses.MESSAGE_ADDED_TO_QUEUE);
		res.status(200).json(successResponses.MESSAGE_ADDED_TO_QUEUE);
	} catch (err) {
		console.log('err', err);
		logApiRequest(req, { data: errorResponses.SOMETHING_WENT_WRONG, err });
		res.status(400).json(errorResponses.SOMETHING_WENT_WRONG);
	}
};
