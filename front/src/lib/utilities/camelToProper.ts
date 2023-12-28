export default function camelToProper(str: string) {
	return str.replace(/([A-Z]+)/g, ' $1').replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}
