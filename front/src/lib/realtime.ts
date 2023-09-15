import ioClient from 'socket.io-client';
import CONFIG from './clientconfig.json';
const ENDPOINT = `${CONFIG.SERVER_URL}:${CONFIG.SERVER_PORT}`;

const socket = ioClient(ENDPOINT, { transports: ['websocket'], upgrade: false });
export const io = socket;
