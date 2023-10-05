import ioClient from 'socket.io-client';
import CONFIG from './clientconfig.json';
const ENDPOINT = `${CONFIG.SERVER_URL}${CONFIG.SERVER_PORT ? `:${CONFIG.SERVER_PORT}` : ''}`;

const socket = ioClient(ENDPOINT, { transports: ['websocket'], upgrade: false });
socket.onAny((eventName, ...args) => {
	console.log('onany', eventName, args);
});
export const io = socket;
