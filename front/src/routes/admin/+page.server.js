import { getUsers } from '$lib/server/sqliteTables/users';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { users: getUsers() };
}
