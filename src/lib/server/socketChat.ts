export interface MessageType {
	from: string;
	message: string;
	time: string;
}
export type MessagesType = Array<MessageType>;

export const trimMessages = (messages: MessagesType) => {
	if (messages.length > 100) {
		messages.splice(0, messages.length - 100);
	}
};

export const sendMessage = (
	socket: any,
	username: string,
	message: string,
	messages: MessagesType
) => {
	const messageObj = {
		from: username,
		message: message,
		time: new Date().toLocaleString()
	};
	messages.push(messageObj);
	socket.emit('message', messageObj);
};

export const sendLatestMessage = (socket: any, messages: MessagesType) => {
	socket.emit('messages', messages);
};
