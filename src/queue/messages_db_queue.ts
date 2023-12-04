import { Queue, Worker } from 'bullmq';
import redis from './redis';
import Message from '../db/models/message';

export type TaskType<S, T> = {
	type: 'sync' | 'async';
	messages: any[];
	userId: number;
};

export const QUEUE_NAME = 'messages-db';

const messagesDBQueue = new Queue(QUEUE_NAME, {
	connection: redis,
	defaultJobOptions: {
		removeOnComplete: true,
		removeOnFail: true,
	},
});

const messageWorker = new Worker(
	QUEUE_NAME,
	async (job) => {
		const { messages, userId } = job.data;
		const newMessages = await Message.bulkCreate(
			messages.map((message: any) => ({
				content: message.content,
				role: message.role,
				chat: message.chat,
				timestamp: message.timestamp,
			}))
		);
	},
	{ connection: redis }
);

messagesDBQueue.on('waiting', (job) => {
	console.log('added new job for user ', job.data.userId, ' with ', job.data.messages.length, ' messages');
});

messagesDBQueue.on('paused', () => {
	console.log('queue paused');
});

messagesDBQueue.on('resumed', () => {
	console.log('queue resumed');
});

messagesDBQueue.on('progress', (job) => {
	console.log('job progress', job.id, job.getState());
});

export default messagesDBQueue;
