import ioClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:5173';

const socket = ioClient(ENDPOINT, { transports: ['websocket'], upgrade: false });

export const io = socket;
