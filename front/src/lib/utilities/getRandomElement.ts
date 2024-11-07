export function getRandomElement(array: Array<unknown>) {
	return array[Math.floor(Math.random() * array.length)];
}
