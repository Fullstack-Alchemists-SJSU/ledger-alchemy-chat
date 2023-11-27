import winston from 'winston/';

const { combine, timestamp, json } = winston.format;

export const errorLogger = winston.createLogger({
	level: 'error',
	format: combine(timestamp(), json()),
	transports: [new winston.transports.File({ filename: 'logs/error.log', eol: ',,\n' })],
});

export const infoLogger = winston.createLogger({
	level: 'info',
	format: combine(timestamp(), json()),
	transports: [new winston.transports.File({ filename: 'logs/info.log', eol: ',,\n' })],
});

const apiLogger = winston.createLogger({
	level: 'http',
	format: combine(timestamp(), json()),
	transports: [new winston.transports.File({ filename: 'logs/api.log', eol: ',,\n' })],
});

export const dbLogger = winston.createLogger({
	level: 'info',
	format: combine(timestamp(), json()),
	transports: [new winston.transports.File({ filename: 'logs/db.log', eol: ',,\n' })],
});

export const logApiRequest = (req: any, res: any) => {
	apiLogger.http({
		req: {
			url: req.url,
			ip: req.ip,
			method: req.method,
			...req.body,
			...req.headers,
			...req.query,
			...req.params,
		},
		res,
	});
};
