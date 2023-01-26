import bcrypt from 'bcryptjs';
import { db } from '../sqliteDB';
export const name = 'users';
export const create = `CREATE TABLE 'users' (
    'username' VARCHAR(20) NOT NULL,
    'email' VARCHAR(100),
    'passwordHash' VARCHAR(100) NOT NULL,
	'accessLevel' int,
    'dateCreated' DATETIME(20) DEFAULT (DATETIME('now')),
    PRIMARY KEY ('username')
);`;

export const usernameCheck = (username: string) => {
	const errorMessages = [];
	if (username.length <= 2) {
		errorMessages.push('Username must be at least 3 characters long.');
	} else if (username.length > 20) {
		errorMessages.push('Username are max 20 characters long.');
	}
	const regexp = /^[a-zA-Z0-9-_]+$/;
	if (username.search(regexp) === -1) {
		errorMessages.push(
			'Username must only contain alphanumeric characters, underscores (_), and dashes (-)'
		);
	}
	return errorMessages;
};

export const passwordCheck = (password: string) => {
	const errorMessages = [];
	if (password.length < 8) {
		errorMessages.push('Password must be at least 8 characters long.');
	} else if (password.length > 100) {
		errorMessages.push('Password are max 100 characters long.');
	}
	return errorMessages;
};

export const passwordHashCheck = async (input: string, passwordHash: string) => {
	return await bcrypt.compare(input, passwordHash);
};

export const existsUser = (username: string) => {
	const results = db
		.prepare(`SELECT COUNT(*) AS 'count' FROM users WHERE username=@username`)
		.get({ username: username });
	return results.count > 0;
};

export const insertUser = (username: string, passwordHash: string) => {
	if (existsUser(username)) {
		return { pass: false, message: 'Username already taken.' };
	}
	const results = db.prepare(`SELECT COUNT(*) AS 'count' FROM users`).get({ username: username });
	const access = results.count > 0 ? 0 : 4;
	db.prepare(
		`
        INSERT INTO users 
        (username, email, accessLevel, passwordHash) 
        VALUES (@username,'',${access},@passwordHash)
        ON CONFLICT(username) DO UPDATE SET
            passwordHash = @passwordHash`
	).run({ username: username, passwordHash: passwordHash });
	return { pass: true, message: 'User created', accessLevel: access };
};

export const createUser = async (username: string, password: string) => {
	const usernameErrors = usernameCheck(username);
	const passwordErrors = passwordCheck(password);
	const errors =
		usernameErrors.length + passwordErrors.length
			? [usernameErrors.join('\n'), passwordErrors.join('\n')]
			: [];
	if (errors.length) {
		return { pass: false, message: errors.join('\n') };
	}
	const passwordHash = await bcrypt.hash(password, 10);
	return insertUser(username, passwordHash);
};

export const getUsers = () => {
	const results = db
		.prepare(`SELECT username, accessLevel, dateCreated FROM users ORDER BY username`)
		.all();
	return results;
};

export const authenticateUser = async (username: string, password: string) => {
	const usernameErrors = usernameCheck(username);
	const passwordErrors = passwordCheck(password);
	const errors =
		usernameErrors.length + passwordErrors.length
			? [usernameErrors.join('\n'), passwordErrors.join('\n')]
			: [];
	if (errors.length) {
		return { pass: false, message: 'Invalid username/password' };
	}
	const sqlResult = db
		.prepare(`SELECT username,passwordHash, accessLevel from users where username=@username`)
		.get({ username: username });
	const passwordCheckResult = await passwordHashCheck(password, sqlResult.passwordHash);
	if (passwordCheckResult) {
		return { pass: true, username: sqlResult.username, accessLevel: sqlResult.accessLevel };
	}
	return { pass: false, message: 'Invalid username/password' };
};
