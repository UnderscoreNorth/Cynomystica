import moment from 'moment';
export const secondsToTime = (duration: number) => {
	if (duration == -1) return 'LIVE';
	let hours = 0,
		minutes = 0,
		seconds = 0;
	if (duration > 60 * 60) hours = Math.floor(duration / 3600);
	if (duration > 60) minutes = Math.floor(duration / 60) % 60;
	seconds = Math.floor(duration % 60);
	return (
		(hours ? hours.toString().padStart(2, '0') + ':' : '') +
		minutes.toString().padStart(2, '0') +
		':' +
		seconds.toString().padStart(2, '0')
	);
};
export const dateTime = (date: string | Date) => {
	return moment.utc(date).local().format('YYYY-MM-DD HH:mm');
};
export const dateTimeSeconds = (date: string | Date) => {
	return moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');
};
export const time = (date: string | Date) => {
	return moment.utc(date).local().format('HH:mm:ss');
};
