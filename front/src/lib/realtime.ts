import ioClient from 'socket.io-client';
import CONFIG from './clientconfig.json';
const ENDPOINT = `${CONFIG.SERVER_URL}${CONFIG.SERVER_PORT ? `:${CONFIG.SERVER_PORT}` : ''}/`;
//console.log({ ENDPOINT });
const socket = ioClient(ENDPOINT, {
	path: 'ws',
	transports: ['websocket'],
	upgrade: false
});
export const io = socket;
