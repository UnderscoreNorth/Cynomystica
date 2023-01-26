export interface MessageType {
	from: string;
	message: string;
	time: Date;
}
export type MessagesType = Array<MessageType>;

export const trimMessages = (messages: MessagesType) => {
	if (messages.length > 100) {
		messages.splice(0, messages.length - 100);
	}
};

export const sendMessage = (socket: unknown, message: MessageType) => {
	socket.emit('message', message);
};

export const sendLatestMessage = (socket: unknown, messages: MessagesType) => {
	socket.emit('messages', messages);
};
