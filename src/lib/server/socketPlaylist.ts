import type { Socket } from 'socket.io-client';
import type { Server } from 'socket.io';

import parseRawVideo from '../videoProviders/raw/parseRawVideo.server';
import parseYoutube from '../videoProviders/youtube/parseYoutube.server';

export type playlistOrderType = Array<number>;
export type playlistObjType = Array<object>;

export const sendPlaylist = (
	socket: Socket | Server,
	playlistOrder: playlistOrderType,
	playlistObj: playlistObjType,
	playlistIndex: number,
	currentSeekTime: number
) => {
	const clientPlaylist: Array<object> = [];
	for (const id in playlistOrder) {
		clientPlaylist[id] = playlistObj[playlistOrder[id]];
	}
	console.log('sendPlaylist');
	socket.emit('playlist', {
		status: 'success',
		playlist: clientPlaylist,
		playlistIndex: playlistIndex,
		seektime: currentSeekTime
	});
};

export const queueVideo = async (
	mediaURL: string,
	playlistObj: playlistObjType,
	playlistOrder: playlistOrderType,
	queueIndex: number
) => {
	const parsedURL = parseURL(mediaURL);
	let playlistItem: any;
	console.log(parsedURL);
	switch (parsedURL.type) {
		case 'raw':
			playlistItem = await parseRawVideo(parsedURL.id);
			break;
		case 'yt':
			playlistItem = await parseYoutube(parsedURL.id);
			break;
		default:
			throw 'type not accounted for yet';
	}
	const id: number = Math.random();
	playlistItem.id = id;
	playlistObj[id] = playlistItem;
	playlistOrder.splice(queueIndex + 1, 0, id);
};

export const parseURL = (url: string) => {
	let data;
	const indeterminable = () => {
		return new Error(
			'Could not determine video type. ' +
				'Check https://git.io/fjtOK for a list of supported media providers.'
		);
	};
	try {
		data = new URL(url);
	} catch (err) {
		throw indeterminable();
	}

	switch (data.hostname.replace('www.', '')) {
		case 'youtube.com':
			if (data.pathname == '/watch') {
				return { type: 'yt', id: data.searchParams.get('v') || '' };
			}
			if (data.pathname.startsWith('/shorts/')) {
				return { type: 'yt', id: data.pathname.slice(8, 19) || '' };
			}
			if (data.pathname == '/playlist') {
				return { type: 'yp', id: data.searchParams.get('list') || '' };
			}
		// eslint-disable-next-line no-fallthrough
		case 'youtu.be':
			return { type: 'yt', id: data.pathname.slice(1) || '' };
		default:
			return { type: 'raw', id: url || '' };
	}
};
