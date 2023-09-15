import * as fs from 'fs';
import type { MessagesType } from './socketChat';
import * as csv from 'csv';

export const writeChatToLog = (messages: MessagesType) => {
	if (messages.length) {
		const date = messages[0].time;
		const path = `./chatlogs/${date.getFullYear()}/${date.getMonth() + 1}/`;
		const fileName = `${date.getDay()}.csv`;
		createFolder(path);
		csv.stringify(messages, { header: false }, (err, output) => {
			fs.appendFile(path + fileName, output, (err) => {
				if (err) throw err;
				messages.splice(0, messages.length);
			});
		});
	}
};
export const createFolder = (path: string) => {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, { recursive: true });
	}
};
export const getChatFromLog = async () => {
	let tries = 0;
	const date = new Date();
	let logFile: string;
	do {
		logFile = `./chatlogs/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()}.csv`;
		tries++;
		date.setDate(date.getDate() - 1);
	} while (tries < 10 && !fs.existsSync(logFile));
	if (logFile) {
		//console.log(csv.parse(await fs.promises.readFile(logFile)));
		return [];
	} else {
		return [];
	}
};
