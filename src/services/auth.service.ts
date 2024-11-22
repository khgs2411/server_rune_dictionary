import type { ProcessArgs } from "common/types";
import UsersRepository from "repositories/users.repo";
import BaseService from "./service.base";
import { Actions } from "common/enums";

export default class AuthService extends BaseService {
	constructor() {
		super();
		this.run = {
			[Actions.AUTH_LOGIN]: this.login,
		};
	}
	public static async Call(args: ProcessArgs) {
		const action = args.strategy.action;
		const self = new AuthService();
		const run = self.run[action];
		if (!run) throw "runes.call - Invalid action provided!";
		return await run(args.strategy.data);
	}

	public static async Authenticate(api_key: string) {
		const user = await UsersRepository.Validate(api_key);
		return user;
	}

	//TODO: implement an actual login method with a user session
	private async login(username: string, api_key: string) {
		const user = await UsersRepository.Validate(username, api_key);
		return user;
	}
}
