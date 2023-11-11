import { Request, Response } from 'express';
import { errorResponses } from '../../utils/responses';
import Chat from '../../db/models/chat';
import openAi from '../../openai/openai';
import { ForeignKeyConstraintError } from 'sequelize';
import Message from '../../db/models/message';

export const streamChatCompletion = async (req: Request, res: Response) => {
	const messages = req.body.messages;
	if (!messages) {
		res.status(400).json(errorResponses.INSUFFICIENT_DATA);
	}

	const response = await openAi.chat.completions.create(
		{
			model: 'gpt-3.5-turbo-16k',
			messages: messages.map((message: any) => ({
				role: message.role,
				content: message.content,
			})),
			stream: true,
			temperature: 1,
			max_tokens: 5000,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		},
		{ stream: true }
	);

	for await (const chunk of response) {
		if (chunk === undefined) return;

		if (!chunk.choices[0].delta || chunk.choices[0].finish_reason === 'stop') {
			break;
		}

		const token = chunk.choices[0].delta.content;
		res.write(token, (err) => {
			if (err) {
				console.log('stream error', err);
			}
		});
	}

	res.end();
};

export const createNewChat = async (req: Request, res: Response) => {
	const user = req.body.user;

	if (!user) {
		res.status(400).json(errorResponses.INSUFFICIENT_DATA);
	}

	try {
		const newChat = await Chat.create({
			user,
		});

		res.status(201).json(newChat);
	} catch (err) {
		if (err instanceof ForeignKeyConstraintError) {
			res.status(404).json(errorResponses.USER_NOT_FOUND);
		}
	}
};

export const getChatByUser = async (req: Request, res: Response) => {
	const user = req.params.user;

	if (!user) {
		res.status(400).json(errorResponses.INSUFFICIENT_DATA);
	}

	const chat = await Chat.findAll({
		subQuery: false,
		where: {
			user,
		},
		include: [
			{
				model: Message,
				as: 'messages',
			},
		],
	});

	if (!chat) {
		res.status(404).json(errorResponses.CHAT_NOT_FOUND);
	}

	res.status(200).json(chat);
};

export const getChatById = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		res.status(400).json(errorResponses.INSUFFICIENT_DATA);
	}

	const chat = await Chat.findOne({
		where: {
			id,
		},
	});

	if (!chat) {
		res.status(404).json(errorResponses.CHAT_NOT_FOUND);
	}

	res.status(200).json(chat);
};

export const deleteChatById = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		res.status(400).json(errorResponses.INSUFFICIENT_DATA);
	}

	const chat = await Chat.findOne({
		where: {
			id,
		},
	});

	if (!chat) {
		res.status(404).json(errorResponses.CHAT_NOT_FOUND);
	} else {
		await chat.destroy();
		res.status(200).json({ message: 'Chat deleted' });
	}
};
