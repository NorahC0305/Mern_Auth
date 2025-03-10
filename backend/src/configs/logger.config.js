import winston from "winston";

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	verbose: 3,
	debug: 4,
	silly: 5,
};

const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.splat(),
		winston.format.timestamp({
			format: "DD/MM HH:mm:ss",
		}),
		winston.format.colorize(),
		winston.format.printf((log) => {
			if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
			return `[${log.timestamp}] [${log.level}] ${log.message}`;
		}),
	),
	transports: [new winston.transports.Console()],
});
export default logger;
