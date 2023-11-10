import { DataTypes } from 'sequelize';
import sequelize from '../db';

export enum RegistrationType {
	EMAIL = 'EMAIL',
	GOOGLE = 'GOOGLE',
}

const User = sequelize.define(
	'user',
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		firstName: {
			type: DataTypes.STRING,
		},
		lastName: {
			type: DataTypes.STRING,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		phone: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: true,
		},
		registrationType: {
			type: DataTypes.ENUM(RegistrationType.EMAIL, RegistrationType.GOOGLE),
			defaultValue: RegistrationType.EMAIL,
		},
		googleId: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'google_id',
		},
	},
	{
		scopes: {
			withoutPassword: {
				attributes: { exclude: ['password'] },
			},
		},
	}
);

export default User;
