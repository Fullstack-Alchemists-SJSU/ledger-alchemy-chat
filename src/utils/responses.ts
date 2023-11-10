export const errorResponses = {
	USER_NOT_FOUND: {
		message: 'User not found.',
	},
	INVALID_CREDENTIALS: {
		message: 'Invalid credentials.',
	},
	INSUFFICIENT_DATA: {
		message: 'Insufficient data.',
	},
	EMAIL_OR_PHONE_ALREADY_EXISTS: {
		message: 'Email or phone already exists.',
	},
	SOMETHING_WENT_WRONG: {
		message: 'Something went wrong.',
	},

	CHAT_NOT_FOUND: {
		message: 'Chat not found.',
	},
};

export const successResponses = {
	USER_FOUND: {
		message: 'User found.',
	},
	USER_CREATED: {
		message: 'User created successfully.',
	},
	USER_UPDATED: {
		message: 'User updated successfully.',
	},
};

export const responseWithData = (response: any, data: any) => {
	return { response, data };
};
