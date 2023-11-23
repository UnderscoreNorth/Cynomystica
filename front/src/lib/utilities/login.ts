import { io } from '$lib/realtime';
export const login = (username: string | null, authentication: string | null, type: string) => {
	const sendObject = {
		username
	};
	switch (type) {
		case 'guest':
			io.emit('login-guest', sendObject);
			break;
		case 'token':
			sendObject.refreshToken = authentication;
			io.emit('login-token', sendObject);
			break;
		case 'password':
			sendObject.password = authentication;
			io.emit('sign-in', sendObject);
			break;
		default:
			return;
	}
	return;
};
