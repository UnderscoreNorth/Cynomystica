import { theThreeGuys } from '$lib/stores/theThreeGuys';
let threeGuys: any;
theThreeGuys.subscribe((v) => (threeGuys = v));
export default function parseThreeGuys(username: string) {
	const index = threeGuys.indexOf(username);
	switch (index) {
		case 0:
			username += ', the first guy';
			break;
		case 1:
			username += ', the second guy';
			break;
		case 2:
			username += ', the third guy';
			break;
	}
	return username;
}
