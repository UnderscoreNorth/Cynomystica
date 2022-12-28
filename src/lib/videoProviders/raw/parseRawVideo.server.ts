import { getVideoDurationInSeconds } from 'get-video-duration';

const parseRawVideo = (mediaURL: string) => {
	return new Promise((resolve, reject) => {
		try {
			getVideoDurationInSeconds(mediaURL).then((duration: number) => {
				resolve({
					name: mediaURL,
					url: mediaURL,
					endDate: 'N/A',
					user: 'N/A',
					duration: duration,
					type: 'raw'
				});
			});
		} catch (err) {
			console.log(err);
			reject();
		}
	});
};

export default parseRawVideo;
