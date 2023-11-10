import { DataTypes } from 'sequelize';
import sequelize from '../db';
import Message from './message';

const Chat = sequelize.define('chat', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	user: {
		type: DataTypes.STRING,
		allowNull: false,
		references: {
			model: 'user',
			key: 'id',
		},
	},
	title: {
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'New Chat',
	},
});

Chat.hasMany(Message);

export default Chat;
